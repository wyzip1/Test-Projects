<template>
  <div :class="['img-card', stateCss[props.state]]">
    <img :src="props.src" v-if="[0, 2].includes(props.state)">
    <span v-if="props.state === 3">
      <img :src="imgSvg" />
      <div>image.png</div>
    </span>
    <span v-else-if="[1, 4].includes(props.state)">
      <div style="margin-bottom: 10px;">{{ props.state === 4 ? '上传暂停' : '文件上传中'}}</div>
      <Process :process="props.process" :disabled="props.state === 4" />
    </span>
    <div class="mask" v-if="props.state !== 1">
      <span @click="emits('look')">查看</span>
      <span @click="emits('remove')" v-if="props.state !== 2">删除</span>
    </div>
  </div>
</template>

<script setup>
import imgSvg from './image.svg'
import Process from './Process.vue'
// 0 普通 | 1 上传中 | 2 上传成功 | 3 上传失败
const props = defineProps({
  src: String,
  state: { type: Number, default: 0 },
  process: { type: Number, default: 0 }
})

const emits = defineEmits(['look', 'remove'])

const stateCss = ['normal', 'uploading', 'success', 'fail']

</script>

<style lang="scss" scoped>

.img-card.success {
  border-color: #52c41a
}

.img-card.uploading {
  background-color: #fafafa;
}

.img-card.fail {
  border-color: #ff4d4f;
  & > span {
    color: #ff4d4f;

    img {
      width: 26px;
      height: 26px;
      object-fit: contain;
    }
  }
}

.img-card {
  width: 120px;
  height: 120px;
  border-radius: 2px;
  display: inline-block;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  position: relative;

  & > .mask {
    position: absolute;
    inset: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    transition: .2s background-color;
    
    & > span {
      cursor: pointer;
      font-size: 12px;
      color: transparent;
      transition: .2s color;
      user-select: none;
    }
  }
  & > span {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: calc(120px - 18px);
    color: #000000d9;
  }
  &:hover .mask {
    background-color: rgba(0,0,0,.3);

    & > span {
      color: #FFF;
    }
  }

  & > img {
    width: calc(120px - 18px);
    height: calc(120px - 18px);
    object-fit: contain;
  }
}
</style>