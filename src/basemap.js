import L from 'leaflet';
import { assetPath } from './paths.js';

const osmCredit = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';
const vectorCredit = '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> · <a href="https://openmaptiles.org" target="_blank" rel="noreferrer">OpenMapTiles</a> · ' + osmCredit;

// Keep Leaflet interactions and markers identical for both presentations.
// The richer renderer is loaded only for the gradient theme, with an OSM fallback.
export function mountBasemap(map, quiet, report) {
  let disposed = false;
  let layer;
  let timer;
  let fallbackStarted = false;
  let ready = false;
  const update = (status, kind) => { if (!disposed) report(status, kind); };
  function raster() {
    if (disposed || fallbackStarted) return;
    fallbackStarted = true;
    clearTimeout(timer);
    if (layer && map.hasLayer(layer)) map.removeLayer(layer);
    update('loading', quiet ? 'fallback' : 'osm');
    layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: osmCredit, maxZoom: 19,
    }).addTo(map);
    let loaded = false;
    layer.on('tileload', () => { loaded = true; clearTimeout(timer); update('ready', quiet ? 'fallback' : 'osm'); });
    layer.on('tileerror', () => { if (!loaded) update('error', quiet ? 'fallback' : 'osm'); });
    timer = setTimeout(() => { if (!loaded) update('error', quiet ? 'fallback' : 'osm'); }, 15000);
  }
  if (!quiet) raster();
  else {
    update('loading', 'vector');
    timer = setTimeout(raster, 15000);
    Promise.all([import('@maplibre/maplibre-gl-leaflet'), import('maplibre-gl/dist/maplibre-gl.css')]).then(([{ maplibreGL }]) => {
      if (disposed || fallbackStarted) return;
      try {
        layer = maplibreGL({
          style: assetPath('maps/homii.json'),
          attributionControl: { customAttribution: vectorCredit },
          interactive: false,
          fadeDuration: 0,
        });
        // A failed WebGL constructor can leave a Leaflet layer partially mounted.
        const removeVector = layer.onRemove;
        layer.onRemove = function (leafletMap) {
          if (this.getMaplibreMap()) removeVector.call(this, leafletMap);
          else this.getContainer()?.remove();
        };
        layer.addTo(map);
        const gl = layer.getMaplibreMap();
        gl.getContainer().setAttribute('aria-hidden', 'true');
        gl.getCanvas().setAttribute('tabindex', '-1');
        gl.once('idle', () => { ready = true; clearTimeout(timer); update('ready', 'vector'); });
        gl.on('error', () => { if (!ready) raster(); });
      } catch { raster(); }
    }).catch(raster);
  }
  return () => {
    disposed = true;
    clearTimeout(timer);
    if (layer && map.hasLayer(layer)) map.removeLayer(layer);
  };
}
