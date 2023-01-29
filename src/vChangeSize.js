const LimitSize = 20;
let currentEl;
let startX;
let startY;
let startLeft;
let startTop;
let startWidth;
let startHeight;
let cornerIndex;
let maxWidth;
let maxHeight;

const changeDirMap = {
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
  startLeft = currentEl.offsetLeft;
  startTop = currentEl.offsetTop;
  startWidth = currentEl.clientWidth;
  startHeight = currentEl.clientHeight;
  // console.log('down', {
  //   startX,
  //   startY,
  //   startLeft,
  //   startTop,
  //   startWidth,
  //   startHeight,
  // });
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
};

const handleMouseMove = (e) => {
  // console.log('move');
  const changedX = e.clientX - startX;
  const changedY = e.clientY - startY;
  let newLeft;
  let newTop;
  let newWidth;
  let newHeight;

  const changeObj = changeDirMap[cornerIndex];
  const { x, y, w, h } = changeObj;

  const tempLeft = startLeft + changedX * x;
  const tempTop = startTop + changedY * y;
  newLeft = Math.max(0, tempLeft);
  newTop = Math.max(0, tempTop);
  const tempWidth = startWidth + changedX * w + (tempLeft - newLeft);
  const tempHeight = startHeight + changedY * h + (tempTop - newTop);
  newWidth = Math.max(LimitSize, tempWidth);
  newHeight = Math.max(LimitSize, tempHeight);
  newLeft =
    cornerIndex == 2 || cornerIndex == 4
      ? newLeft
      : newLeft + (tempWidth - newWidth);
  newTop =
    cornerIndex == 3 || cornerIndex == 4
      ? newTop
      : newTop + (tempHeight - newHeight);

  // console.log({ newLeft, newTop, newWidth, newHeight });

  if (newLeft + newWidth > maxWidth) {
    newWidth = maxWidth - newLeft;
  }
  if (newTop + newHeight > maxHeight) {
    newHeight = maxHeight - newTop;
  }

  currentEl.style.left = `${newLeft}px`;
  currentEl.style.top = `${newTop}px`;
  currentEl.style.width = `${newWidth}px`;
  currentEl.style.height = `${newHeight}px`;
};

const handleMouseUp = (e) => {
  // console.log('up');
  currentEl = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
};

const changeSize = {
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
  name: 'changeSize',
  ...changeSize,
};
