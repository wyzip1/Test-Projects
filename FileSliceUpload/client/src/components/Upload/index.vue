<template>
  <section>
    <div class="img-list">
      <img-card 
        v-for="img in imgFileList" 
        :state="img.uploadState" 
        :process="uploadIndex / uploadTotal * 100" 
        :key="img.uid" 
        :src="img.thumbnail"
        @remove="fileListRemove(img)"
      />
      <div class="upload" @click="inputFile.click()">
        <input type="file" ref="inputFile" class="input-select" @change="changeFile">
        <div class="tip-section">
          <span class="icon">+</span>
          <span class="tip">上传文件</span>
        </div>
      </div>
    </div>
    <div class="file-list">
      <div :class="{ file: true, fail: file.success === false, success: file.success }" v-for="file in fileList" :key="file.uid">
        <a :href="file.href" target="_blank">{{ file.name }}</a>
        <div class="right" @click="fileListRemove(file)" v-if="!file.success">删除</div>
        <Process class="absolute-left-bottom" v-if="file === uploadFile" :process="uploadIndex / uploadTotal * 100" />
      </div>
    </div>
    <Button class="upload-btn" :disabled="props.modelValue.length < 1" @click="dispatchUpload">上传</Button>
  </section>
</template>

<script setup>
import Button from './Button.vue'
import ImgCard from './img-card.vue'
import Process from './Process.vue'
import { ref, watch, getCurrentInstance } from 'vue'
import { sliceFile } from './utils'

let { ctx } = getCurrentInstance()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  sliceSize: { type: Number, default: 1024 * 10 }
})

const emits = defineEmits(['upload', 'update:modelValue'])

const fileList = ref([])
const imgFileList = ref([])
const inputFile = ref();

const uploadIndex = ref(0)
const uploadFile = ref()
const uploadTotal = ref(1)

watch(props, ({ modelValue }) => {
  imgFileList.value = modelValue.filter(file => file.fileType === 'image')
  fileList.value = modelValue.filter(file => file.fileType !== 'image')
})

function changeFile(e) {
  const file = e.target.files[0]
  file.uid = guid()
  file.href = URL.createObjectURL(file);
  const imgTypeReg = /\.(jpe?g|png|gif|webp)$/i
  if (!imgTypeReg.test(file.name)) return emits('update:modelValue', [...props.modelValue, file])
  file.fileType = 'image'
  const reader = new FileReader();
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    file.thumbnail = e.target.result
    emits('update:modelValue', [...props.modelValue, file])
  }
}

function fileListRemove(file) {
  const list = [...props.modelValue]
  const fileIndex = list.findIndex(v => v === file)
  if (fileIndex === -1) return
  const lastIndex = list.length - 1
  fileIndex === lastIndex && (inputFile.value.value = null)
  list.splice(fileIndex, 1)
  emits('update:modelValue', list)
}

function dispatchUpload() {
  uploadHandle([...imgFileList.value, ...fileList.value])
}

function uploadHandle(fileList, fileIndex = 0) {
  if (fileIndex === fileList.length) return uploadFile.value = null;
  const file = fileList[fileIndex]
  const fileUid = guid()
  uploadFile.value = file;
  uploadIndex.value = file.uploadIndex || 0
  uploadTotal.value = Math.ceil(file.size / props.sliceSize);
  file.uploadState = 1;
  doUpload(file, uploadIndex.value, fileUid, (isSuccess = true) => {
    file.success = isSuccess
    ctx.$forceUpdate()
    file.uploadState = isSuccess ? 2 : 3
    file.uploadIndex = uploadIndex.value
    ctx.$forceUpdate()
    uploadIndex.value = 0;
    uploadTotal.value = 0
    uploadHandle(fileList, fileIndex + 1)
  })
}

function doUpload(file, startIndex = 0, fileUid, next) {
  const { blobFile, isLast } = sliceFile(file, startIndex, props.sliceSize)
  const formData = new FormData()
  formData.append('file', blobFile)
  emits('upload', { formData, isLast, fileUid }, (isSuccess) => {
    uploadIndex.value = startIndex + 1;
    if (isLast || isSuccess === false) return next(isSuccess)
    doUpload(file, startIndex + 1, fileUid, next)
  })
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

</script>

<style lang="scss" scoped>
.img-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 8px;
  row-gap: 8px;
}
.upload:hover {
  border-color: #1890ff;
}

.upload {
  cursor: pointer;
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  background-color: #fafafa;
  position: relative;
  transition: .2s border-color;
  display: inline-block;
  box-sizing: border-box;

  &>.input-select {
    position: absolute;
    inset: 0;
    cursor: pointer;
    opacity: 0;
    z-index: -1;
  }

  &>.tip-section {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 10px;
    color: #000000d9;
    font-size: 14px;
  }
}

.file-list {
  &>.file:hover {
    background-color: #f5f5f5;
  }

  &>.file:hover .right {
    color: #8b8b8b;
  }

  &>.file {
    margin-top: 8px;
    font-size: 14px;
    height: 22px;
    transition: .2s background-color;
    box-sizing: border-box;
    padding-right: 5px;
    line-height: 22px;
    position: relative;

    &.fail>a,
    &.fail>.right,
    &.fail>.right:hover {
      color: #ff4d4f;
    }

    &.success>a,
    &.success>.right,
    &.success>.right:hover {
      color: #52c41a;
    }

    &>a {
      color: #1890ff;
      text-decoration: none;
      transition: .2s color;
    }

    &>.right:hover {
      color: #242424;
    }

    &>.right {
      float: right;
      color: transparent;
      transition: .2s color;
      font-size: 12px;
      cursor: pointer;
    }
  }
}

.upload-btn {
  margin-top: 10px;
}

.absolute-left-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>