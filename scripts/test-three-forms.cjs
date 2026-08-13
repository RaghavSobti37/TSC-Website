const assert = require('assert');

const bookCall = require('../api/book-call');
const artistQuery = require('../api/query');
const artistPath = require('../api/artist-path');

function makeRes() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(value) {
      this.body = value;
      this.json = JSON.parse(value || '{}');
    },
  };
}

async function call(handler, body) {
  const req = { method: 'POST', body };
  const res = makeRes();
  await handler(req, res);
  return res;
}

async function rejectsInvalidBeforeWebhook(name, handler, body) {
  let called = false;
  global.fetch = async () => {
    called = true;
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  };

  const res = await call(handler, body);
  assert.strictEqual(res.statusCode, 400, `${name} should reject invalid payload`);
  assert.strictEqual(called, false, `${name} should not call webhook for invalid payload`);
  assert.strictEqual(res.json.success, false, `${name} should return success:false`);
}

async function acceptsValid(name, handler, body, checkPayload) {
  let sent = null;
  global.fetch = async (_url, options) => {
    sent = JSON.parse(options.body);
    return { ok: true, status: 200, json: async () => ({ success: true, message: `${name} ok`, leadId: 'lead-1' }) };
  };

  const res = await call(handler, body);
  assert.strictEqual(res.statusCode, 200, `${name} should accept valid payload`);
  assert.strictEqual(res.json.success, true, `${name} should return success:true`);
  assert.ok(sent, `${name} should forward payload`);
  checkPayload(sent);
}

async function rejectsMissingSecret(name, handler, secretKey, body) {
  const original = process.env[secretKey];
  delete process.env[secretKey];
  let called = false;
  global.fetch = async () => {
    called = true;
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  };

  const res = await call(handler, body);
  assert.strictEqual(res.statusCode, 500, `${name} should fail when secret is missing`);
  assert.strictEqual(called, false, `${name} should not call webhook without secret`);
  assert.strictEqual(res.json.success, false, `${name} should return success:false`);
  process.env[secretKey] = original;
}

async function main() {
  process.env.BOOK_CALL_WEBHOOK_SECRET = 'test-secret';
  process.env.ARTIST_ENQUIRY_WEBHOOK_SECRET = 'test-secret';
  process.env.ARTIST_PATH_WEBHOOK_SECRET = 'test-secret';
  process.env.TASKMASTER_WEBHOOK_URL = 'https://example.test/book-call';
  process.env.TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL = 'https://example.test/artist-query';
  process.env.TASKMASTER_ARTIST_PATH_WEBHOOK_URL = 'https://example.test/artist-path';

  await rejectsInvalidBeforeWebhook('book-call', bookCall, {
    name: '',
    email: 'bad',
    phone: '',
    course: '',
    date: '',
    time: '',
  });
  await rejectsInvalidBeforeWebhook('book-an-artist', artistQuery, {
    name: '',
    email: '',
    phone: '',
  });
  await rejectsInvalidBeforeWebhook('artist-query', artistPath, {
    firstName: '',
    lastName: '',
    email: 'bad',
    mobile: '',
  });

  await acceptsValid('book-call', bookCall, {
    name: 'Form Audit',
    email: 'Audit+Call@Example.COM',
    phone: '9876543210',
    course: 'The heART of Composition',
    date: '2026-08-20',
    time: '03:00 PM',
  }, (payload) => {
    assert.strictEqual(payload.name, 'Form Audit');
    assert.strictEqual(payload.email, 'audit+call@example.com');
    assert.strictEqual(payload.phone, '+919876543210');
    assert.strictEqual(payload.course, 'The heART of Composition');
  });

  await acceptsValid('book-an-artist', artistQuery, {
    name: 'Form Audit',
    email: 'audit+artist@example.com',
    phone: '9876543210',
    artist: 'YUGM',
    company: 'TSC',
    collabType: 'Live Performance',
  }, (payload) => {
    assert.strictEqual(payload.name, 'Form Audit');
    assert.strictEqual(payload.email, 'audit+artist@example.com');
    assert.strictEqual(payload.phone, '+919876543210');
    assert.strictEqual(payload.artist, 'YUGM');
    assert.strictEqual(payload.company, 'TSC');
  });

  await acceptsValid('artist-query', artistPath, {
    firstName: 'Form',
    lastName: 'Audit',
    email: 'audit+path@example.com',
    mobile: '9876543210',
    artistIdentity: 'Composer',
  }, (payload) => {
    assert.strictEqual(payload.fullName, 'Form Audit');
    assert.strictEqual(payload.email, 'audit+path@example.com');
    assert.strictEqual(payload.mobile, '+919876543210');
    assert.strictEqual(payload.artistIdentity, 'Composer');
  });

  await rejectsMissingSecret('book-call', bookCall, 'BOOK_CALL_WEBHOOK_SECRET', {
    name: 'Form Audit',
    email: 'audit+call@example.com',
    phone: '9876543210',
    course: 'The heART of Composition',
    date: '2026-08-20',
    time: '03:00 PM',
  });
  await rejectsMissingSecret('book-an-artist', artistQuery, 'ARTIST_ENQUIRY_WEBHOOK_SECRET', {
    name: 'Form Audit',
    email: 'audit+artist@example.com',
    phone: '9876543210',
  });
  await rejectsMissingSecret('artist-query', artistPath, 'ARTIST_PATH_WEBHOOK_SECRET', {
    firstName: 'Form',
    lastName: 'Audit',
    email: 'audit+path@example.com',
    mobile: '9876543210',
  });

  console.log('three visible forms: validation + webhook payloads pass');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
