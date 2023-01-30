import { ref, computed } from 'vue';

export const viewWidth = ref(960);
export const viewHeight = ref(520);

export const videoStyle = computed(() => {
  return {
    width: `${viewWidth.value}px`,
    height: `${viewHeight.value}px`,
  };
});

export const showRect = ref(true);
