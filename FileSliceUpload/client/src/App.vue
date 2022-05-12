<template>
  <Upload v-model="fileList" :sliceSize="1024 * 100" @upload="upload"  />
</template>

<script setup>
import Upload from './components/Upload'
import { ref } from 'vue'

const fileList = ref([]);
function upload({ index, formData, isLast, fileUid, signal }, next) {
  fetch('http://localhost:3000/uploadFile', {
    method: 'POST',
    body: formData,
    headers: { 
      ['file-uid']: fileUid,
      ['upload-end']: isLast ? 'isLast' : 'continue',
      ['file-index']: index
    },
    signal
  }).then(res => res.json()).then(res => {
    isLast && open(res.url)
    next();
  }).catch(err => {
    console.log('uploadSliceFile Error', err);
    if(err.code === 20) return next('pause')
    next(false)
  })
}
</script>