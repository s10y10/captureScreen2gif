<script setup>
import { onMounted } from 'vue';
import { showRect, viewWidth, viewHeight } from './store';

const chunks = [];
const interval = 50;
let gif;
let video;
let canvas;
let ctx;
let timeId;
let stream;
let recorder;
let clipRect;

onMounted(() => {
  video = document.getElementById('video');
  canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;left:0;top:0;';
  ctx = canvas.getContext('2d');
});

//显示隐藏选框
const onToggleRectVisible = () => {
  showRect.value = !showRect.value;
};

//点击下载
const onDownload = () => {
  if (!video.src) {
    console.warn('没有视频下载个啥');
    return;
  }
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
  ctx.drawImage(
    video,
    clipRect.x,
    clipRect.y,
    clipRect.w,
    clipRect.h,
    0,
    0,
    canvas.width,
    canvas.height
  );
  gif.addFrame(ctx, { copy: true, delay: 10 });
};

//开始转gif
const onPlay = () => {
  if (!video.duration) {
    console.warn('还没有视频呢转不了');
    return;
  }

  const { offsetLeft, offsetTop, clientWidth, clientHeight } =
    document.querySelector('.clip-rect');
  const { videoWidth, videoHeight } = video;
  const scaleX = videoWidth / viewWidth.value;
  const scaleY = videoHeight / viewHeight.value;
  clipRect = {
    x: offsetLeft * scaleX,
    y: offsetTop * scaleY,
    w: clientWidth * scaleX,
    h: clientHeight * scaleY,
  };

  console.log(clipRect);

  canvas.width = clientWidth;
  canvas.height = clientHeight;

  gif = new GIF({
    workers: 2,
    quality: 10,
    width: clientWidth,
    height: clientHeight,
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
    <button @click="onDownload">下载视频</button>
    <button @click="onToggleRectVisible">
      {{ showRect ? '隐藏选框' : '显示选框' }}
    </button>
    <button @click="onPlay">开始转gif</button>
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
