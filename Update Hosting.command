#!/bin/zsh
set -e
cd -- "${0:A:h}"
export PATH='/Users/amandatang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/amandatang/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:'"$PATH"
NODE="$(command -v node)"
PNPM="$(command -v pnpm)"
echo 'Paste the saved Atlas connection string. It can still contain the old password.'
echo 'The entry is hidden. Press Return after pasting.'
read -rs ATLAS_URI
echo
export ATLAS_URI
echo 'Enter the NEW database user password. The entry is hidden.'
read -rs DB_PASSWORD
echo
export DB_PASSWORD
MONGODB_URI="$("$NODE" --input-type=module - <<'JS'
try {
  const uri=new URL(process.env.ATLAS_URI);
  if (!['mongodb:','mongodb+srv:'].includes(uri.protocol)) throw new Error();
  if (!process.env.DB_PASSWORD) throw new Error();
  uri.password=encodeURIComponent(process.env.DB_PASSWORD);
  process.stdout.write(uri.toString());
} catch { console.error('The connection string format is invalid.');process.exit(1); }
JS
)"
export MONGODB_URI
unset DB_PASSWORD ATLAS_URI
"$NODE" --input-type=module - <<'JS'
import mongoose from 'mongoose';
try {
  await mongoose.connect(process.env.MONGODB_URI,{dbName:'margin',serverSelectionTimeoutMS:8000});
  await mongoose.connection.db.admin().ping();
  console.log('New Atlas credentials verified.');
  await mongoose.disconnect();
} catch { console.log('Connection failed. Check the new database password and saved connection string.');process.exit(1); }
JS
printf '%s' "$MONGODB_URI" | "$PNPM" dlx vercel@latest env add MONGODB_URI --environment production --force --sensitive --yes --scope dash-lab
unset MONGODB_URI
"$PNPM" dlx vercel@latest deploy --prod --yes --scope dash-lab
echo 'Hosting updated. You can close this window.'
