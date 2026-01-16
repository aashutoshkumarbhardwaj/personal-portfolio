const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env file from repo root
const envPath = path.resolve(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('.env not found at', envPath);
  process.exit(1);
}

const env = fs
  .readFileSync(envPath, 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean)
  .reduce((acc, line) => {
    if (line.startsWith('#')) return acc;
    const idx = line.indexOf('=');
    if (idx === -1) return acc;
    const key = line.slice(0, idx);
    const val = line.slice(idx + 1);
    acc[key] = val;
    return acc;
  }, {});

const url = env.REACT_APP_SUPABASE_URL;
const anon = env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY missing in .env');
  process.exit(1);
}

const supabase = createClient(url, anon);

(async () => {
  try {
    const { data, error, status } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase error:', error, 'status:', status);
      process.exit(1);
    }

    console.log('Fetched rows:', Array.isArray(data) ? data.length : 0);
    console.log('Sample:', JSON.stringify(data && data[0], null, 2));
  } catch (e) {
    console.error('Unexpected error:', e.message);
    process.exit(1);
  }
})();
