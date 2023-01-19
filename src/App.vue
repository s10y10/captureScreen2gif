<script setup>
import ButtonGroup from './ButtonGroup.vue';
import ClipRect from './ClipRect.vue';
import { videoStyle } from './consts';
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
  position: relative;
  #video {
    border: 1px solid black;
  }
}
</style>
