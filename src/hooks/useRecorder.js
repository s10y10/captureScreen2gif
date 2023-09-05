import { hasVideo, videoRef } from '@/store';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const useRecorder = () => {
  const chunks = [];
  let stream;
  let recorder;

  //停止录制屏幕
  const onStopCaptureSreen = () => {
    recorder.stop();
    stream.getTracks().forEach((e) => {
      e.stop();
    });
  };

  //开始录制屏幕
  const onCaptureScreen = async () => {
    hasVideo.value = false;
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    const video = videoRef.value;
    video.srcObject = stream;
    video.play();
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.addEventListener('dataavailable', (e) => {
      chunks.push(e.data);
    });
    recorder.addEventListener('stop', async () => {
      const blob = new Blob(chunks, { type: chunks[0].type });
      video.pause();
      video.srcObject = null;
      video.src = URL.createObjectURL(blob);
      hasVideo.value = true;
      video.play();

      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm';
      const ffmpeg = new FFmpeg();
      const coreURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        'text/javascript'
      );
      const wasmURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'applicaiton/wasm'
      );
      const workerURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        'text/javascript'
      );
      await ffmpeg
        .load({
          coreURL,
          wasmURL,
          workerURL,
        })
        .catch((e) => {
          console.log(e);
        });

      let reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = async function () {
        let arrayBuffer = reader.result;
        let uint8Array = new Uint8Array(arrayBuffer);
        await ffmpeg.writeFile('test.webm', uint8Array);
        await ffmpeg
          .exec([
            '-i',
            'test.webm',
            '-vf',
            'crop=500:500:0:0',
            '-f',
            'gif',
            'test.gif',
          ])
          .catch((e) => {
            console.log(e);
          });
        const data = await ffmpeg.readFile('test.gif').catch((e) => {
          console.log(e);
        });
        const blobUrl = URL.createObjectURL(
          new Blob([data.buffer], { type: 'image/gif' })
        );
        const img = new Image();
        img.src = blobUrl;
        document.body.appendChild(img);
      };
    });
    recorder.start();
  };

  return { onCaptureScreen, onStopCaptureSreen };
};
