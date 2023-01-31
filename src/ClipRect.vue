<script setup>
import { showRect } from './store';
import {
  viewWidth as maxWidth,
  viewHeight as maxHeight,
  viewWidthPx,
  viewHeightPx,
} from './consts';
import vMove from './vMove';
import vChangeSize from './vChangeSize';
</script>

<template>
  <div
    class="clip-rect"
    v-show="showRect"
    v-change-size="{ maxWidth, maxHeight }"
    v-move="{ maxWidth, maxHeight }"
  >
    <div class="corner" data-index="1"></div>
    <div class="corner" data-index="2"></div>
    <div class="corner" data-index="3"></div>
    <div class="corner" data-index="4"></div>
  </div>
</template>

<style lang="scss" scoped>
.clip-rect {
  position: absolute;
  border: 1px solid red;
  left: 0px;
  top: 0px;
  width: v-bind(viewWidthPx);
  height: v-bind(viewHeightPx);
  cursor: move;
  .corner {
    width: 10px;
    height: 10px;
    border: 1px solid black;
    position: absolute;
    background-color: white;
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
