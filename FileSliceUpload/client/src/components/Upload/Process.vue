<template>
  <div class="process" :style="`--process-width: ${props.process}%`"></div>
</template>

<script setup>
const props = defineProps({
  process: { type: Number, default: 0 }
})
</script>

<style lang="scss" scoped>
.process {
  position: relative;
  height: 2px;
  width: 100%;
  background-color: #d9d9d9;
  border-radius: 5px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: var(--process-width, 0);
    height: 100%;
    background-color: #1890ff;
    /* transition: .2s width; */
  }
}
</style>