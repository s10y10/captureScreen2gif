<script setup>
import { onMounted } from 'vue';
import { videoWidth, videoHeight } from './consts';

const chunks = [];
const interval = 50;
let gif;
let video;
let canvas;
let ctx;
let timeId;
let stream;
let recorder;

onMounted(() => {
  video = document.getElementById('video');
  canvas = document.createElement('canvas');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx = canvas.getContext('2d');
});

//点击下载
const onDownload = () => {
  const a = document.createElement('a');
  a.href = video.src;
  a.download = 'video1.webm';
  a.click();
};

//停止录制屏幕
const onStopCaptureSreen = () => {
  recorder.stop();
  stream.getTracks().forEach((e) => {
    e.stop();
  });
};

const render = () => {
  gif.on('finished', function (blob) {
    const blobUrl = URL.createObjectURL(blob);
    console.log(blob, blobUrl);
    window.open(blobUrl);
  });
  gif.render();
};

const capture = () => {
  console.log(video.currentTime, video.duration);
  if (video.currentTime >= video.duration) {
    clearInterval(timeId);
    render();
    return;
  }
  console.log(captureArea);
  ctx.drawImage(
    video,
    captureArea.x,
    captureArea.y,
    captureArea.width,
    captureArea.height,
    0,
    0,
    captureArea.width,
    captureArea.height
  );
  gif.addFrame(ctx, { copy: true, delay: 10 });
};

//开始转gif
const onPlay = () => {
  gif = new GIF({
    workers: 2,
    quality: 10,
    width: videoWidth,
    height: videoHeight,
    workerScript: '/gif.worker.js',
  });
  video.play();
  timeId = setInterval(() => {
    capture();
  }, interval);
};

//开始录制屏幕
const onCaptureScreen = async () => {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  video.srcObject = stream;
  video.play();
  recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  recorder.addEventListener('dataavailable', (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener('stop', () => {
    const blob = new Blob(chunks, { type: chunks[0].type });
    video.pause();
    video.srcObject = null;
    video.src = URL.createObjectURL(blob);
  });
  recorder.start();
};
</script>

<template>
  <div class="btn-group">
    <button @click="onCaptureScreen">录制屏幕</button>
    <button @click="onStopCaptureSreen">结束屏幕录制</button>
    <button @click="onDownload">下载</button>
    <button @click="onPlay">开始转gif</button>
  </div>
</template>

<style lang="scss" scoped>
.btn-group {
  margin-top: 20px;
  display: flex;
}
</style>
