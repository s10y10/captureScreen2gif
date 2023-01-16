<script setup>
import { onMounted } from 'vue';

//初始化变量
const interval = 50;
const areaW = 654;
const areaH = 270;
let video;
let canvas;
let ctx;
let timeId;
let gif;
let stream;
let recorder;
const areaStyle = {
  position: 'absolute',
  border: '1px solid red',
  width: `${areaW}px`,
  height: `${areaH}px`,
  left: '712px',
  top: '90px',
  pointerEvents: 'none',
};
const captureArea = {
  width: areaW,
  height: areaH,
  x: 0,
  y: 0,
};
const chunks = [];

onMounted(() => {
  video = document.getElementById('video');
  canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 468;
  ctx = canvas.getContext('2d');

  const rect = video.getBoundingClientRect();
  captureArea.width = parseInt(areaStyle.width);
  captureArea.height = parseInt(areaStyle.height);
  captureArea.x = parseInt(areaStyle.left) - rect.x;
  captureArea.y = parseInt(areaStyle.top) - rect.y;

  gif = new GIF({
    workers: 2,
    quality: 10,
    width: areaW,
    height: areaH,
    workerScript: '/gif.worker.js',
  });
});

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

//停止录制屏幕
const onStopCaptureSreen = () => {
  recorder.stop();
  stream.getTracks().forEach((e) => {
    e.stop();
  });
};

//点击下载
const onDownload = () => {
  const a = document.createElement('a');
  a.href = video.src;
  a.download = 'video1.webm';
  a.click();
};

//开始转gif
const onPlay = () => {
  video.play();
  timeId = setInterval(() => {
    capture();
  }, interval);
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
</script>

<template>
  <div>
    <button @click="onCaptureScreen">录制屏幕</button>
    <button @click="onStopCaptureSreen">结束屏幕录制</button>
    <button @click="onDownload">下载</button>
    <button @click="onPlay">开始转gif</button>
    <video style="width: 960px; height: 468px" id="video" controls></video>
    <div :style="areaStyle"></div>
  </div>
</template>

<style scoped></style>
