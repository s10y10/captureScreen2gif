let currentEl;
let startX;
let startY;
let startLeft;
let startTop;

const handleMouseDown = (e) => {
  currentEl = e.currentTarget;
  startX = e.clientX;
  startY = e.clientY;
  const rect = currentEl.getBoundingClientRect();
  startLeft = rect.x;
  startTop = rect.y;
  console.log('down', { startX, startY, startLeft, startTop });
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
};

const handleMouseMove = (e) => {
  console.log('move');
  const changedX = e.clientX - startX;
  const changedY = e.clientY - startY;
  const newX = startLeft + changedX;
  const newY = startTop + changedY;
  currentEl.style.left = `${newX}px`;
  currentEl.style.top = `${newY}px`;
};

const handleMouseUp = (e) => {
  console.log('up');
  currentEl = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
};

const move = {
  mounted(el) {
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
