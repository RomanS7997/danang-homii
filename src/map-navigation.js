// ResizeObserver keeps the opening animation fitted to the listings. Once the
// visitor pans or zooms, resizing must preserve their view until an explicit reset.
export function createMapNavigation(map, { bounds, fitOptions, onZoom = () => {}, animate = () => true }) {
  let exploring = false;
  let fitting = false;
  const markExploring = () => { if (!fitting) exploring = true; };
  const syncZoom = () => onZoom(map.getZoom());
  map.on('movestart zoomstart', markExploring);
  map.on('zoomend', syncZoom);

  function overview() {
    fitting = true;
    try {
      map.invalidateSize({ animate: false, pan: false });
      map.fitBounds(bounds(), { ...fitOptions(), animate: false });
      exploring = false;
      syncZoom();
    } finally { fitting = false; }
  }
  return {
    overview,
    resize() {
      if (exploring) map.invalidateSize({ animate: false, pan: true });
      else overview();
    },
    locate(coords) {
      exploring = true;
      map.setView(coords, Math.min(map.getMaxZoom(), Math.max(15, map.getZoom())), { animate: animate() });
    },
    destroy() {
      map.off('movestart zoomstart', markExploring);
      map.off('zoomend', syncZoom);
    },
  };
}
