import { onMounted } from 'vue';
import { viewWidth, viewHeight } from '@/consts';

export default () => {
  let video;
  let canvas;
  let ctx;

  const chunks = [];
  const interval = 50;
  let gif;

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

  //渲染生成gif,结束后在新窗口预览
  const render = () => {
    gif.on('finished', function (blob) {
      const blobUrl = URL.createObjectURL(blob);
      console.log(blob, blobUrl);
      window.open(blobUrl);
    });
    gif.render();
  };

  //捕获视频画面
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

  //测试截取区域用的函数
  const onTest = () => {
    onPlay(true);
  };

  //开始转gif
  const onPlay = (isTesting) => {
    if (!video.duration) {
      console.warn('还没有视频呢转不了');
      return;
    }

    const { offsetLeft, offsetTop, clientWidth, clientHeight } =
      document.querySelector('.clip-rect');
    const { videoWidth, videoHeight } = video;

    const initRate = viewWidth / viewHeight;
    const realRate = videoWidth / videoHeight;

    let whiteWidth = 0;
    let whiteHeight = 0;
    if (realRate > initRate) {
      //上下有留白
      whiteHeight = viewHeight - (viewWidth * videoHeight) / videoWidth;
    } else {
      //左右有留白
      whiteWidth = viewWidth - (viewHeight * videoWidth) / videoHeight;
    }

    const scaleX = videoWidth / (viewWidth - whiteWidth);
    const scaleY = videoHeight / (viewHeight - whiteHeight);

    clipRect = {
      x: (offsetLeft - whiteWidth / 2) * scaleX,
      y: (offsetTop - whiteHeight / 2) * scaleY,
      w: clientWidth * scaleX,
      h: clientHeight * scaleY,
    };

    console.log(clipRect);

    canvas.width = clientWidth;
    canvas.height = clientHeight;

    if (isTesting === true) {
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

      document.body.appendChild(canvas);
      return;
    }

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

  return {
    onCaptureScreen,
    onStopCaptureSreen,
    onDownload,
    onPlay,
    onTest,
  };
};
