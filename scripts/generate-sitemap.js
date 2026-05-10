import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const recipes = JSON.parse(readFileSync(join(__dirname, '../src/data/recipes.json'), 'utf8'));

const BASE = 'https://charlie-beard.github.io/fastmeals';
const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: BASE, priority: '1.0' },
  ...recipes.map(r => ({ loc: `${BASE}/recipe/${r.id}`, priority: '0.8' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const out = join(__dirname, '../public/sitemap.xml');
writeFileSync(out, xml);
console.log(`Sitemap written: ${urls.length} URLs → ${out}`);
