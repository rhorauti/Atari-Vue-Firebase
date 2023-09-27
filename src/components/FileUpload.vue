<script setup>

import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    fileDownloadUrl: String,
    fileUploadUrlClear: String,
    btnNome: {type: String, default: 'Upload'},
    containerFileUploadClass: {type: String, default: 'column is-5 mx-2 mb-2'}
})

const emit = defineEmits(['fileUpload', 'fileUploadName', 'limparArquivo']);

const fileUpload = ref('');
const fileUploadName = ref('');
const fileUploadType = ref('');
const fileUploadUrl = ref(props.fileUploadUrlClear);

// watch(props.fileUploadClear, (newValue) => {
//     fileUploadUrl.value = newValue;
// });

function lerFileUpload(event) {
    const file = event.target.files[0];
    console.log(file)
    if(file) {
        fileUpload.value = file;
        fileUploadName.value = file.name;
        fileUploadType.value = file.type;
        let reader = new FileReader();
        reader.onload = (event) => {
            fileUploadUrl.value = event.target.result
            console.log(fileUploadUrl.value)
            
            emit('fileUpload', fileUpload.value);
            emit('fileUploadName', fileUploadName.value);
        }
        reader.readAsDataURL(file);
    }
}

function limparFileUpload() {
    fileUpload.value = '';
    fileUploadName.value = '';
    fileUploadType.value = '';
    fileUploadUrl.value = '';
    emit('limparArquivoDownload')
}

const mostrarFotoProduto = computed(() => {
    if((fileUploadUrl.value == null || fileUploadUrl.value == '')  && (props.fileDownloadUrl == '' || props.fileDownloadUrl == null)) {
        return '/img/sem-imagem.png';
    } else if((fileUploadUrl.value != null || fileUploadUrl.value != '') && fileUploadType.value == 'application/pdf') {
        return '/img/pdf.png';
    } else if((fileUploadUrl.value != null || fileUploadUrl.value != '') && (props.fileDownloadUrl == '' || props.fileDownloadUrl == null)) {
        return fileUploadUrl.value;
    } else {
        return props.fileDownloadUrl;
    }
})

</script>

<style>

.icon-delete {
    position: absolute;
    right: 0.2rem;
    cursor: pointer;
    color: red;
}

</style>

<template>

<div class="box" :class="props.containerFileUploadClass" style="position: relative;">
    <span class="icon-delete icon" @click="limparFileUpload()">
        <font-awesome-icon :icon="['fa', 'fa-trash']" />
    </span>
    <figure class="image is-128x128 is-align-items-center is-flex is-justify-content-center mb-2 mx-auto">
        <img :src="mostrarFotoProduto" alt="" style="height: 100%;">
    </figure>
    <div class="file">
        <label class="file-label" style="width: 100%;">
            <input class="file-input" type="file" name="file-upload" accept="image/jpeg, image/png, application/pdf" id="file-upload-input" @change="lerFileUpload($event)">
            <span v-show="!fileUpload" class="file-cta button is-info" style="width: 100%;">
                <span class="file-icon">
                    <font-awesome-icon :icon="['fa', 'file-arrow-up']" />
                </span>
                <span class="file-label mx-auto">{{ props.btnNome }}</span>
            </span>
        </label>
        
    </div>
    <p v-show="fileUpload" class="has-text-centered">
        <span class="icon mr-1"><font-awesome-icon :icon="['fa', 'file']" /></span>
        <span>{{ fileUploadName }}</span>
    </p>
</div>

</template>