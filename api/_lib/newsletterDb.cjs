/**
 * Newsletter subscribers in MongoDB (the `newslettersubscribers` collection that
 * already holds every past signup). The connection is cached across warm
 * serverless invocations.
 *
 * Env:
 *   NEWSLETTER_MONGODB_URI  connection string (required)
 *   NEWSLETTER_DB_NAME      database name (default: taskmaster_production)
 *   NEWSLETTER_TENANT_ID    tenant id stamped on new rows (default: the one most
 *                           existing rows use)
 */
const { MongoClient, ObjectId } = require('mongodb');

const COLLECTION = 'newslettersubscribers';
let clientPromise = null;
let tenantIdPromise = null;

function isConfigured() {
  return Boolean((process.env.NEWSLETTER_MONGODB_URI || '').trim());
}

async function collection() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.NEWSLETTER_MONGODB_URI.trim(), {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
      appName: 'tsc-website',
    });
    clientPromise = client.connect().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  const client = await clientPromise;
  return client.db((process.env.NEWSLETTER_DB_NAME || 'taskmaster_production').trim()).collection(COLLECTION);
}

async function tenantId(col) {
  const configured = (process.env.NEWSLETTER_TENANT_ID || '').trim();
  if (configured && ObjectId.isValid(configured)) return new ObjectId(configured);
  if (!tenantIdPromise) {
    tenantIdPromise = col.aggregate([
      { $match: { tenantId: { $ne: null } } },
      { $group: { _id: '$tenantId', n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 1 },
    ]).toArray().then((rows) => (rows[0] ? rows[0]._id : null));
  }
  return tenantIdPromise;
}

/** Add or re-activate a subscriber. Returns { created, reactivated }. */
async function subscribe({ email, source, sourceSite }) {
  const col = await collection();
  const now = new Date();
  const tenant = await tenantId(col);
  const existing = await col.findOne({ email }, { projection: { _id: 1, unsubscribed: 1 } });
  if (existing) {
    if (existing.unsubscribed) {
      await col.updateOne({ _id: existing._id }, {
        $set: { unsubscribed: false, updatedAt: now, 'metadata.resubscribedAt': now },
        $unset: { unsubscribeReason: '' },
      });
      return { created: false, reactivated: true };
    }
    return { created: false, reactivated: false };
  }
  try {
    await col.insertOne({
      email,
      name: email.split('@')[0],
      source,
      subscribedAt: now,
      unsubscribed: false,
      metadata: { sourceSite },
      ...(tenant ? { tenantId: tenant } : {}),
      createdAt: now,
      updatedAt: now,
    });
    return { created: true, reactivated: false };
  } catch (err) {
    if (err && err.code === 11000) return { created: false, reactivated: false }; // raced a duplicate
    throw err;
  }
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toRow(doc) {
  return {
    id: String(doc._id),
    email: doc.email || '',
    name: doc.name || '',
    source: doc.source || '',
    sourceSite: (doc.metadata && doc.metadata.sourceSite) || '',
    subscribedAt: doc.subscribedAt || doc.createdAt || null,
    unsubscribed: Boolean(doc.unsubscribed),
  };
}

function filterFor({ q, status }) {
  const filter = {};
  if (status === 'subscribed') filter.unsubscribed = { $ne: true };
  if (status === 'unsubscribed') filter.unsubscribed = true;
  const term = String(q || '').trim().slice(0, 100);
  if (term) {
    const rx = new RegExp(escapeRegex(term), 'i');
    filter.$or = [{ email: rx }, { name: rx }, { source: rx }];
  }
  return filter;
}

async function list({ q, status, page = 1, pageSize = 50 }) {
  const col = await collection();
  const filter = filterFor({ q, status });
  const size = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
  const current = Math.max(Number(page) || 1, 1);
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const [items, matched, total, unsubscribed, last30] = await Promise.all([
    col.find(filter).sort({ subscribedAt: -1, _id: -1 }).skip((current - 1) * size).limit(size).toArray(),
    col.countDocuments(filter),
    col.countDocuments({}),
    col.countDocuments({ unsubscribed: true }),
    col.countDocuments({ subscribedAt: { $gte: since } }),
  ]);
  return {
    items: items.map(toRow),
    matched,
    page: current,
    pageSize: size,
    counts: { total, active: total - unsubscribed, unsubscribed, last30 },
  };
}

async function exportAll({ q, status }) {
  const col = await collection();
  const docs = await col.find(filterFor({ q, status })).sort({ subscribedAt: -1, _id: -1 }).limit(50000).toArray();
  return docs.map(toRow);
}

async function setUnsubscribed(id, unsubscribed) {
  if (!ObjectId.isValid(id)) return false;
  const col = await collection();
  const update = unsubscribed
    ? { $set: { unsubscribed: true, unsubscribeReason: 'admin', updatedAt: new Date() } }
    : { $set: { unsubscribed: false, updatedAt: new Date() }, $unset: { unsubscribeReason: '' } };
  const res = await col.updateOne({ _id: new ObjectId(id) }, update);
  return res.matchedCount === 1;
}

module.exports = { isConfigured, subscribe, list, exportAll, setUnsubscribed };
