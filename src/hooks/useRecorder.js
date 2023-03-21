import { videoRef, hasVideo } from '@/store';

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
      audio: true,
    });
    const video = videoRef.value;
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
      hasVideo.value = true;
      video.play();
    });
    recorder.start();
  };

  return { onCaptureScreen, onStopCaptureSreen };
};
