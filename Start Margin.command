#!/bin/zsh
set -e
cd -- "${0:A:h}"
if [[ -z "$MONGODB_URI" ]]; then
  echo 'Paste the same Atlas connection string used for the movie exercise.'
  echo 'The entry is hidden. Press Return after pasting.'
  read -rs MONGODB_URI
  echo
  export MONGODB_URI
fi
NODE='/Users/amandatang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
if [[ ! -x "$NODE" ]]; then NODE="$(command -v node)"; fi
"$NODE" --input-type=module - <<'JS'
import mongoose from 'mongoose';
try {
  await mongoose.connect(process.env.MONGODB_URI, {dbName:'margin',serverSelectionTimeoutMS:8000});
  await mongoose.connection.db.admin().ping();
  console.log('Atlas verified. Open http://127.0.0.1:5051');
  await mongoose.disconnect();
} catch { console.log('Could not connect to Atlas. Check the connection string.'); process.exit(1); }
JS
exec "$NODE" --watch server.js
