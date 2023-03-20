export const useDownload = (videoRef) => {
  //点击下载
  const onDownload = () => {
    if (!videoRef.value || !videoRef.value.src) {
      console.warn('没有视频下载个啥');
      return;
    }
    const video = videoRef.value;
    const a = document.createElement('a');
    a.href = video.src;
    a.download = 'video1.webm';
    a.click();
  };

  return {
    onDownload,
  };
};
