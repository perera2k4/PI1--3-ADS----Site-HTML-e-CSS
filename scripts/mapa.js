const map = document.getElementById('map');
const container = document.getElementById('map-container');

const mapWidth = 8192;
const mapHeight = 6150;

let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let zoom = 1;
const minZoom = Math.max(container.clientWidth / mapWidth, container.clientHeight / mapHeight);
const maxZoom = 3;

zoom = minZoom;
centerMap();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function centerMap() {
  const visibleWidth = mapWidth * zoom;
  const visibleHeight = mapHeight * zoom;

  translateX = (container.clientWidth - visibleWidth) / 2;
  translateY = (container.clientHeight - visibleHeight) / 2;

  updateTransform();
}

function updateTransform() {
  const visibleWidth = mapWidth * zoom;
  const visibleHeight = mapHeight * zoom;

  const minX = container.clientWidth - visibleWidth;
  const minY = container.clientHeight - visibleHeight;
  const maxX = 0;
  const maxY = 0;

  translateX = clamp(translateX, minX, maxX);
  translateY = clamp(translateY, minY, maxY);

  map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoom})`;
}

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  container.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

container.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
  const newZoom = clamp(zoom * delta, minZoom, maxZoom);

  const rect = map.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const relX = mouseX / (mapWidth * zoom);
  const relY = mouseY / (mapHeight * zoom);

  const oldZoom = zoom;
  zoom = newZoom;

  const newVisibleWidth = mapWidth * zoom;
  const newVisibleHeight = mapHeight * zoom;

  translateX -= (newVisibleWidth - mapWidth * oldZoom) * relX;
  translateY -= (newVisibleHeight - mapHeight * oldZoom) * relY;

  updateTransform();
});

window.addEventListener('resize', () => {
  centerMap();
});
