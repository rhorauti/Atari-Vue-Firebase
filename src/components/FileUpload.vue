<script setup>

import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    btnNome: {type: String, default: 'Upload'},
    containerFileUploadClass: {type: String, default: 'column is-5 mx-2 mb-2'}
})

const emit = defineEmits(['fileUpload', 'fileUploadName', 'fileUploadType']);

const fileUpload = ref('');
const fileUploadName = ref('');
const fileUploadType = ref('');

function lerFileUpload(event) {
    const file = event.target.files[0];
    if(file) {
        fileUploadName.value = file.name;
        fileUploadType.value = file.type;
        const reader = new FileReader();
        reader.onload = (event) => {
            fileUpload.value = event.target.result;
            emit('fileUpload', fileUpload.value);
            emit('fileUploadName', fileUploadName.value);
            emit('fileUploadType', fileUploadType.value);
        }
        reader.readAsDataURL(file);
    }
}

function limparFileUpload() {
    fileUpload.value = null;
    fileUploadName.value = null;
    fileUploadType.value = null;
}

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
        <img v-show="fileUploadType == 'image/jpeg'|| fileUploadType == 'image/png'" :src="fileUpload" alt="" style="height: 100%;">
        <img v-show="fileUploadType == 'application/pdf'" src="../img/pdf.png" alt="" style="height: 100%;">
        <img v-show="!fileUpload" src="../img/sem-imagem.png" alt="" style="height: 100%;">
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