let currentEl;
let startX;
let startY;
let startLeft;
let startTop;
let startWidth;
let startHeight;
let cornerIndex;

const handleMouseDown = (e) => {
  if (!e.target.classList.contains('corner')) return;
  e.stopImmediatePropagation();
  currentEl = e.currentTarget;
  cornerIndex = e.target.dataset.index;
  startX = e.clientX;
  startY = e.clientY;
  const rect = currentEl.getBoundingClientRect();
  startLeft = rect.x;
  startTop = rect.y;
  startWidth = rect.width;
  startHeight = rect.height;
  console.log('down', {
    startX,
    startY,
    startLeft,
    startTop,
    startWidth,
    startHeight,
  });
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
};

const handleMouseMove = (e) => {
  console.log('move');
  const changedX = startLeft + e.clientX - startX;
  const changedY = startTop + e.clientY - startY;
  currentEl.style.left = `${changedX}px`;
  currentEl.style.top = `${changedY}px`;
};

const handleMouseUp = (e) => {
  console.log('up');
  currentEl = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
};

const changeSize = {
  mounted(el) {
    el.addEventListener('mousedown', handleMouseDown);
  },
  beforeMount(el) {
    el.removeEventListener('mousedown', handleMouseDown);
  },
};

export default {
  name: 'changeSize',
  ...changeSize,
};
