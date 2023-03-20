<script setup>
import ButtonGroup from '@/components/ButtonGroup.vue';
import ClipRect from '@/components/ClipRect.vue';
import VideoControlBar from '@/components/VideoControlBar.vue';
import { viewWidthPx, viewHeightPx } from '@/consts';
import { videoRef } from '@/store';

const videoStyle = {
  width: viewWidthPx,
  height: viewHeightPx,
  border: '1px solid #000000',
  backgroundColor: '#000000',
  flexShrink: 0,
};
</script>

<template>
  <video :style="videoStyle" ref="videoRef"></video>
  <VideoControlBar></VideoControlBar>
  <ButtonGroup></ButtonGroup>
  <ClipRect></ClipRect>
</template>
