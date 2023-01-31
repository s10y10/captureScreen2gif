<script setup>
import { showRect } from './store';
import setupButton from './setupButton';

const { onCaptureScreen, onStopCaptureSreen, onDownload, onPlay, onTest } =
  setupButton();

//显示隐藏选框
const onToggleRectVisible = () => {
  showRect.value = !showRect.value;
};
</script>

<template>
  <div class="btn-group">
    <button @click="onCaptureScreen">录制屏幕</button>
    <button @click="onStopCaptureSreen">结束屏幕录制</button>
    <button @click="onDownload">下载视频</button>
    <button @click="onPlay">开始转gif</button>
    <button @click="onToggleRectVisible">
      {{ showRect ? '隐藏选框' : '显示选框' }}
    </button>
    <button @click="onTest">测试区域</button>
  </div>
</template>

<style lang="scss" scoped>
.btn-group {
  margin-top: 20px;
  display: flex;
  button {
    margin-right: 10px;
  }
}
</style>
