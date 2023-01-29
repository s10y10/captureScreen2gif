let currentEl;
let startX;
let startY;
let startLeft;
let startTop;
let maxWidth;
let maxHeight;

const handleMouseDown = (e) => {
  currentEl = e.currentTarget;
  startX = e.clientX;
  startY = e.clientY;
  startLeft = currentEl.offsetLeft;
  startTop = currentEl.offsetTop;
  // console.log('down', { startX, startY, startLeft, startTop });
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
};

const handleMouseMove = (e) => {
  // console.log('move');
  const changedX = e.clientX - startX;
  const changedY = e.clientY - startY;
  const limitWidth = maxWidth - currentEl.clientWidth;
  const limitHeght = maxHeight - currentEl.clientHeight;
  const newX = Math.min(Math.max(0, startLeft + changedX), limitWidth);
  const newY = Math.min(Math.max(0, startTop + changedY), limitHeght);
  currentEl.style.left = `${newX}px`;
  currentEl.style.top = `${newY}px`;
};

const handleMouseUp = (e) => {
  // console.log('up');
  currentEl = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
};

const move = {
  mounted(el, { value }) {
    maxWidth = value.maxWidth;
    maxHeight = value.maxHeight;
    el.addEventListener('mousedown', handleMouseDown);
  },
  beforeMount(el) {
    el.removeEventListener('mousedown', handleMouseDown);
  },
};

export default {
  name: 'move',
  ...move,
};
