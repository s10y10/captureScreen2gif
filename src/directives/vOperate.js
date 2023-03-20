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

let isMoveMode = true;

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

//鼠标按下,记录初始状态和模式
const handleMouseDown = (e) => {
  isMoveMode = !e.target.classList.contains('corner');

  currentEl = e.currentTarget;
  cornerIndex = e.target.dataset.index;

  startX = e.clientX;
  startY = e.clientY;
  startLeft = currentEl.offsetLeft;
  startTop = currentEl.offsetTop;
  startWidth = currentEl.clientWidth;
  startHeight = currentEl.clientHeight;

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
};

//处理移动模式的计算
const _handleMoveMode = (e) => {
  const changedX = e.clientX - startX;
  const changedY = e.clientY - startY;

  const limitWidth = maxWidth - currentEl.clientWidth;
  const limitHeght = maxHeight - currentEl.clientHeight;
  const newX = Math.min(Math.max(0, startLeft + changedX), limitWidth);
  const newY = Math.min(Math.max(0, startTop + changedY), limitHeght);
  currentEl.style.left = `${newX}px`;
  currentEl.style.top = `${newY}px`;
};

//处理改变大小模式的计算
const _handleChangeSizeMode = (e) => {
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

//鼠标移动,分发事件
const handleMouseMove = (e) => {
  if (!currentEl) return;
  if (isMoveMode) {
    _handleMoveMode(e);
  } else {
    _handleChangeSizeMode(e);
  }
};

//鼠标抬起,移除事件监听
const handleMouseUp = (e) => {
  currentEl = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
};

export default {
  name: 'operate',
  mounted(el, { value }) {
    maxWidth = value.maxWidth;
    maxHeight = value.maxHeight;
    el.addEventListener('mousedown', handleMouseDown);
  },
  beforeMount(el) {
    el.removeEventListener('mousedown', handleMouseDown);
  },
};
