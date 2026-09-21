import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { appPath, sitePath, assetPath } from '../src/paths.js';

test('Routing preserves language, query and anchor under a repository prefix', () => {
  assert.equal(sitePath('vi/apartments/river?beds=2#details', '/danang-homii/'), '/danang-homii/vi/apartments/river?beds=2#details');
  assert.equal(appPath('/danang-homii/en/apartments/river/', '/danang-homii/'), '/en/apartments/river/');
  assert.equal(appPath('/danang-homii', '/danang-homii/'), '/');
  assert.equal(appPath('/danang-homii-other/en', '/danang-homii/'), '/danang-homii-other/en');
  assert.equal(appPath('/ru/apartments', '/'), '/ru/apartments');
  assert.equal(sitePath('ru/apartments', '/'), '/ru/apartments');
  assert.equal(assetPath('maps/homii.json'), '/assets/maps/homii.json');
});

const output = resolve('dist/client');
test('All 42 localized routes have a reload-safe HTML entry point', async () => {
  const manifest = JSON.parse(await readFile(resolve(output, 'pages-manifest.json'), 'utf8'));
  assert.equal(manifest.routes.length, 42);
  assert.equal(new Set(manifest.routes).size, 42);
  for (const route of manifest.routes) {
    const html = await readFile(resolve(output, route, 'index.html'), 'utf8');
    assert.ok(html.includes(`<html lang="${route.split('/')[0]}">`), route);
    assert.ok(html.includes(`src="${manifest.basePath}assets/`), route);
    assert.ok(!html.includes('src="/assets/'), route);
  }
  await access(resolve(output, '404.html'));
  await access(resolve(output, '.nojekyll'));
});

test('Built HTML/CSS reference existing assets under the Pages prefix', async () => {
  const { basePath } = JSON.parse(await readFile(resolve(output, 'pages-manifest.json'), 'utf8'));
  const html = await readFile(resolve(output, 'index.html'), 'utf8');
  const paths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  for (const path of paths) {
    assert.ok(path.startsWith(basePath), path);
    await access(resolve(output, path.slice(basePath.length)));
  }
  for (const path of paths.filter(path => path.endsWith('.css'))) {
    const css = await readFile(resolve(output, path.slice(basePath.length)), 'utf8');
    for (const match of css.matchAll(/url\(["']?(\/[^\s)'";]+)["']?\)/g)) {
      assert.ok(match[1].startsWith(basePath), match[1]);
      await access(resolve(output, match[1].slice(basePath.length)));
    }
  }
  await access(resolve(output, 'assets/maps/homii.json'));
});
