<template>
  <Upload v-model="fileList" :sliceSize="1024" @upload="upload"  />
</template>

<script setup>
import Upload from './components/Upload'
import { ref } from 'vue'

const fileList = ref([]);
function upload({ formData, isLast, fileUid }, next) {
  fetch('http://localhost:3000/uploadFile', {
    method: 'POST',
    body: formData,
    headers: { 
      fileuid: fileUid,
      uploadend: isLast ? 'isLast' : 'continue'
    }
  }).then(res => res.json()).then(res => {
    isLast && console.log(res);
    next();
  }).catch(err => {
    console.log('uploadSliceFile Error', err);
    next(false)
  })
}
</script>