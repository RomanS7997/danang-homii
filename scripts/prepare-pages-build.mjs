import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Pages has no SPA rewrite server. Real index files give every known route a
// successful HTTP response on a direct visit, refresh or shared deep link.
export const pageRoutes = [
  '', 'apartments', 'districts', 'how-to-rent', 'guides', 'about', 'owners',
  ...['seaside', 'studio', 'river', 'family'].map(id => `apartments/${id}`),
  ...['choose-your-neighbourhood', 'viewing-checklist', 'moving-in'].map(id => `guides/${id}`),
];
const output = resolve('dist/client');
const html = await readFile(resolve(output, 'index.html'), 'utf8');
const routes = [];
for (const lang of ['ru', 'en', 'vi']) {
  for (const page of pageRoutes) {
    const route = `${lang}${page ? `/${page}` : ''}`;
    const directory = resolve(output, route);
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), html.replace('<html lang="ru">', `<html lang="${lang}">`));
    routes.push(route);
  }
}
// Unknown URLs retain an actual 404 status and render the application's 404 UI.
await writeFile(resolve(output, '404.html'), html);
await writeFile(resolve(output, '.nojekyll'), '');
await writeFile(resolve(output, 'pages-manifest.json'), JSON.stringify({
  basePath: process.env.PAGES_BASE_PATH || '/danang-homii/', routes,
}, null, 2));
console.log(`Prepared ${routes.length} localized route entry points for GitHub Pages.`);
