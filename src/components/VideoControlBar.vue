<script setup>
import { NSlider, NInputNumber } from 'naive-ui';
import { ref } from 'vue';

const value = ref([0, 50]);
const maxValue = ref(200);

const onFormatTooltip = (value) => {
  return value;
};
</script>

<template>
  <div class="controlbar">
    <button class="button">播放</button>
    <button class="button">暂停</button>
    <div class="timebar">
      <div>截取时间：</div>
      <div class="naive-custom-bar">
        <NSlider
          :max="maxValue"
          v-model:value="value"
          :format-tooltip="onFormatTooltip"
          range
          :step="1"
          placement="bottom"
        />
        <NInputNumber v-model:value="value[0]" size="small" />
        <NInputNumber v-model:value="value[1]" size="small" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controlbar {
  display: flex;
  margin-top: 10px;
  align-items: center;
  .timebar {
    display: flex;
    color: #ffffff;
    .naive-custom-bar {
      display: flex;
      align-items: center;
      .n-input-number {
        margin-left: 10px;
      }
    }
  }
}
</style>
