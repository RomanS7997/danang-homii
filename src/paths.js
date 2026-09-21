// Vite injects BASE_URL at build time. A project on GitHub Pages lives under
// /repository/, whereas local development and the Sites worker use /.
export const basePath = import.meta.env?.BASE_URL || '/';

export function sitePath(path = '', base = basePath) {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Strip only a complete prefix: /demo-two/ must not match the base /demo/.
export function appPath(pathname, base = basePath) {
  const prefix = base.replace(/\/$/, '');
  if (pathname === prefix) return '/';
  return prefix && pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}

export const assetPath = path => sitePath(`assets/${path.replace(/^\/?assets\//, '')}`);
