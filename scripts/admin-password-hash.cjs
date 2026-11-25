/**
 * Make the ADMIN_PASSWORD_HASH value for the /admin login.
 * Usage: node scripts/admin-password-hash.cjs "<password>"
 * Put the printed value in the ADMIN_PASSWORD_HASH environment variable; never store
 * the plain password. Also set ADMIN_SESSION_SECRET to a long random string
 * (e.g. node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))").
 */
const crypto = require('crypto');

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Use a password of at least 12 characters.');
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
console.log('scrypt$' + salt.toString('base64') + '$' + hash.toString('base64'));
