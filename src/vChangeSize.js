const LimitSize = 20;
let currentEl;
let startX;
let startY;
let startLeft;
let startTop;
let startWidth;
let startHeight;
let cornerIndex;

const changeMap = {
  1: {
    x: 1,
    y: 1,
    w: -1,
    h: -1,
  },
  2: {
    x: 0,
    y: 1,
    w: 1,
    h: -1,
  },
  3: {
    x: 1,
    y: 0,
    w: -1,
    h: 1,
  },
  4: {
    x: 0,
    y: 0,
    w: 1,
    h: 1,
  },
};

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
  const changedX = e.clientX - startX;
  const changedY = e.clientY - startY;
  let newLeft;
  let newTop;
  let newWidth;
  let newHeight;

  const changeObj = changeMap[cornerIndex];
  const { x, y, w, h } = changeObj;
  newLeft = startLeft + changedX * x;
  newWidth = startWidth + changedX * w;
  newTop = startTop + changedY * y;
  newHeight = startHeight + changedY * h;

  if (newWidth < LimitSize || newHeight < LimitSize) return;

  console.log({ newLeft, newTop, newWidth, newHeight });
  currentEl.style.left = `${newLeft}px`;
  currentEl.style.top = `${newTop}px`;
  currentEl.style.width = `${newWidth}px`;
  currentEl.style.height = `${newHeight}px`;
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
