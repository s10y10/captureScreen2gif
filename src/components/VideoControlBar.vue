<script setup>
import { NSlider, NInputNumber } from 'naive-ui';
import { ref } from 'vue';
import { videoRef, videoSlice } from '@/store';

let startTime;

const videoEl = videoRef.value;
videoEl.addEventListener('durationchange', function () {
  console.log('duration change');
  const duration = videoEl.duration;
  if (duration !== Infinity) {
    videoSlice.value = [0, duration];
    maxValue.value = duration;
    startTime = 0;
  }
});

const maxValue = ref(0);

const handleSlice = () => {
  videoEl.pause();
  startTime = videoSlice.value[0];
  videoEl.currentTime = startTime;
  videoEl.play();
};
</script>

<template>
  <div class="controlbar">
    <button class="button" @click="handleSlice">裁剪</button>
    <div class="timebar">
      <div>截取时间：</div>
      <div class="naive-custom-bar">
        <NSlider
          :max="maxValue"
          v-model:value="videoSlice"
          range
          :step="0.1"
          placement="bottom"
        />
        <NInputNumber v-model:value="videoSlice[0]" size="small" />
        <NInputNumber v-model:value="videoSlice[1]" size="small" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controlbar {
  display: flex;
  margin-top: 10px;
  align-items: center;
  .timebar {
    display: flex;
    color: #ffffff;
    .naive-custom-bar {
      display: flex;
      align-items: center;
      .n-input-number {
        margin-left: 10px;
      }
    }
  }
}
</style>
