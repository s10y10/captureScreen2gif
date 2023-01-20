<script setup>
import { videoWidth, videoHeight } from './consts';
import vMove from './vMove';
import vChangeSize from './vChangeSize';

const rectStyle = {
  width: `${videoWidth}px`,
  height: `${videoHeight}px`,
  left: '0px',
  top: '0px',
};

defineExpose({
  clipRect: rectStyle,
});
</script>

<template>
  <div class="clip-rect" v-change-size v-move :style="rectStyle">
    <div class="corner" data-index="1"></div>
    <div class="corner" data-index="2"></div>
    <div class="corner" data-index="3"></div>
    <div class="corner" data-index="4"></div>
  </div>
</template>

<style lang="scss" scoped>
.clip-rect {
  position: fixed;
  border: 1px solid red;
  cursor: move;
  .corner {
    width: 10px;
    height: 10px;
    border: 1px solid black;
    position: absolute;
  }
  .corner:nth-child(1) {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }
  .corner:nth-child(2) {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }
  .corner:nth-child(3) {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }
  .corner:nth-child(4) {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
}
</style>
