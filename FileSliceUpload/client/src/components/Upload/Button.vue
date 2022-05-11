<template>
    <button :class="{'w-button': true, [type]: !!type, primary, disabled}" ref="button" @click="clickAnimation">
      <slot></slot>
    </button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  primary: Boolean,
  type: String,
  disabled: Boolean
})

const emits = defineEmits(['click'])

const button = ref();
const themeColorVar = {
  primary: 'var(--outline-color)',
  danger: 'var(--outline-error-color)'
}
function clickAnimation(e) {
  if(props.disabled) return;
  const btnNode = button.value;
  const theme = themeColorVar[props.type] || themeColorVar.primary
  btnNode.animate({
    boxShadow: [
      `0 0 0 0px ${theme}`, 
      `0 0 0 3px ${theme}`,
      '0 0 0 5px transparent',
    ]
  }, {
    duration: 500,
    easing: 'ease-in-out',
    fill: 'forwards'
  })
  emits('click', e)
}
</script>

<style scoped>
.w-button {
  border: 1px solid #d9d9d9;
  background-color: #fff;
  text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 2px #00000004;
  height: 32px;
  cursor: pointer;
  padding: 4px 15px;
  outline: none;
  color: #000000d9;
  white-space: nowrap;
  transition: .3s all;
  border-radius: 2px;

  --primary-1: #40a9ff;
  --primary-color: #1890ff;
  --primary-color-hover: #40a9ff;
  --error-color: #ff4d4f;
  --error-color-hover: #ff7875;
  --outline-color: rgba(24, 144, 255, .2);
}

.w-button:hover,
.w-button:focus {
  color: var(--primary-color-hover);
  border-color: var(--primary-color-hover);
}

.w-button.primary:hover,
.w-button.primary:focus {
  background-color: var(--primary-color-hover);
  border-color: var(--primary-color-hover);
}

.w-button.primary {
  color: #fff;
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  box-shadow: 0 2px #0000000b;
}

.w-button.danger {
  color: #fff;
  border-color: var(--error-color);
  background-color: var(--error-color);
}

.w-button.danger:hover,
.w-button.danger:focus {
  background-color: var(--error-color-hover);
  border-color: var(--error-color-hover);
}

.w-button.disabled.w-button.disabled {
  color: #00000040;
  border-color: #d9d9d9;
  background-color: #f5f5f5;
  text-shadow: none;
  box-shadow: none;
  cursor: not-allowed;
}
</style>