/**
 * Generate secure random secrets for JWT and CSRF
 * Run: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 Generating secure secrets...\n');
console.log('Copy these to your .env file:\n');
console.log('='.repeat(60));
console.log(`JWT_SECRET=${generateSecret(64)}`);
console.log(`JWT_REFRESH_SECRET=${generateSecret(64)}`);
console.log(`CSRF_SECRET=${generateSecret(64)}`);
console.log('='.repeat(60));
console.log('\n⚠️  Keep these secrets secure and never commit them to git!');
console.log('💡 For production, set these in your hosting platform (Vercel, etc.)');

