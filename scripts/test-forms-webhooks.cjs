/**
 * POST smoke-test all website form APIs (local serve-mirror or Vercel).
 * Usage: node scripts/test-forms-webhooks.cjs [baseUrl]
 */
const base = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '');
const stamp = Date.now();
const tomorrow = new Date(Date.now() + 86400000 * 2);
const dateStr = tomorrow.toISOString().slice(0, 10);

const cases = [
  {
    name: 'newsletter',
    path: '/api/newsletter',
    body: { email: `audit+newsletter.${stamp}@theshakticollective.in`, source: 'form-audit' },
  },
  {
    name: 'book-call',
    path: '/api/book-call',
    body: {
      name: 'Form Audit',
      email: `audit+bookcall.${stamp}@theshakticollective.in`,
      phone: '9876543210',
      course: 'The heART of Composition',
      date: dateStr,
      time: '03:00 PM',
      message: 'Automated form audit — ignore',
      source: 'tsc-website',
    },
  },
  {
    name: 'query/book-artist',
    path: '/api/query',
    body: {
      name: 'Form Audit',
      email: `audit+query.${stamp}@theshakticollective.in`,
      phone: '9876543210',
      artist: 'YUGM',
      company: 'TSC Audit',
      collabType: 'Live Performance',
      nature: 'Automated form audit',
      locationTime: 'Remote / audit',
      scale: 'Small',
      logisticsSupport: 'Not Provided',
      additionalVision: 'Automated form audit — ignore',
      source: 'form-audit',
    },
  },
  {
    name: 'leads',
    path: '/api/leads',
    body: {
      userType: 'Artist',
      name: 'Form Audit',
      email: `audit+leads.${stamp}@theshakticollective.in`,
      phone: '9876543210',
      message: 'Automated form audit — ignore',
      genres: 'Indie',
      experience: 'Beginner',
      lookingFor: 'Mentorship',
      source: 'form-audit',
    },
  },
  {
    name: 'artist-path',
    path: '/api/artist-path',
    body: {
      name: 'Form Audit',
      email: `audit+artistpath.${stamp}@theshakticollective.in`,
      phone: '9876543210',
      pathInterest: 'Audit',
      message: 'Automated form audit — ignore',
      source: 'form-audit',
    },
  },
  {
    name: 'reviews',
    path: '/api/reviews',
    body: {
      firstName: 'Form',
      lastName: 'Audit',
      registeredMobile: '9876543210',
      registeredEmail: `audit+reviews.${stamp}@theshakticollective.in`,
      oneLineExperience: 'Automated form audit — ignore',
      improvementSuggestion: 'Automated form audit — ignore',
      overallExperience: 'Excellent',
      source: 'form-audit',
    },
  },
  {
    name: 'reviews02',
    path: '/api/reviews02',
    body: {
      firstName: 'Form',
      lastName: 'Audit',
      registeredMobile: '9876543210',
      registeredEmail: `audit+reviews02.${stamp}@theshakticollective.in`,
      oneLineExperience: 'Automated form audit — ignore',
      improvementSuggestion: 'Automated form audit — ignore',
      overallExperience: 'Excellent',
      source: 'form-audit',
    },
  },
];

async function run() {
  const results = [];
  for (const c of cases) {
    const url = base + c.path;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(c.body),
      });
      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text.slice(0, 200) };
      }
      const ok = res.status >= 200 && res.status < 300 && (json.success === true || json.ok === true || !('success' in (json || {})));
      // Prefer explicit success flag when present
      const pass = res.ok && (json.success === true || json.success === undefined);
      results.push({
        name: c.name,
        status: res.status,
        pass: Boolean(pass && json && (json.success === true || json.message)),
        body: json,
      });
      // More accurate: require success:true from our API handlers
      results[results.length - 1].pass = res.status === 200 && json && json.success === true;
      console.log(`${results[results.length - 1].pass ? 'OK' : 'FAIL'}\t${c.name}\t${res.status}\t${JSON.stringify(json).slice(0, 160)}`);
    } catch (err) {
      results.push({ name: c.name, status: 0, pass: false, body: { error: String(err.message || err) } });
      console.log(`FAIL\t${c.name}\t0\t${err.message}`);
    }
  }
  const failed = results.filter((r) => !r.pass);
  console.log(`FORMS ${results.length - failed.length}/${results.length} pass`);
  process.exit(failed.length ? 1 : 0);
}

run();
