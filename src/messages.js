import { core } from './translations-core.js';
import { landing } from './translations-landing.js';
import { pages } from './translations-pages.js';
import { enrichment } from './enrichment-content.js';
// Keep source keys stable; values contain complete, local translations (no network service).
export const messages = Object.fromEntries([...core, ...landing, ...pages, ...enrichment].map(([ru,en,vi]) => [ru,{en,vi}]));
