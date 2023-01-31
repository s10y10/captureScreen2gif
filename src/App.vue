<script setup>
import ButtonGroup from './ButtonGroup.vue';
import ClipRect from './ClipRect.vue';
import { viewWidthPx, viewHeightPx } from './consts';

const videoStyle = {
  width: viewWidthPx,
  height: viewHeightPx,
};
</script>

<template>
  <div class="app">
    <video :style="videoStyle" id="video"></video>
    <ButtonGroup></ButtonGroup>
    <ClipRect></ClipRect>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  #video {
    border: 1px solid black;
  }
}
</style>
