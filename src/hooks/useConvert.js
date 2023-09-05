import { onMounted } from 'vue';
import { viewWidth, viewHeight, workerCode } from '@/consts';
import { videoRef, videoSlice } from '@/store';

export const useConvert = () => {
  const interval = 1000 / 30;
  let canvas;
  let ctx;
  let gif;
  let timeId;
  let clipRect;

  onMounted(() => {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;left:0;top:0;';
    ctx = canvas.getContext('2d');
  });

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
    const video = videoRef.value;
    console.log(video.currentTime, videoSlice.value);
    if (video.currentTime >= videoSlice.value[1]) {
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
    onConvert(true);
  };

  //开始转gif
  const onConvert = (isTesting) => {
    const video = videoRef.value;
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
      workerScript: URL.createObjectURL(
        new Blob([workerCode], { type: 'application/javascript' })
      ),
    });

    video.pause();
    video.currentTime = videoSlice.value[0];
    video.play();
    timeId = setInterval(() => {
      capture();
    }, interval);
  };

  return {
    onConvert,
    onTest,
  };
};
