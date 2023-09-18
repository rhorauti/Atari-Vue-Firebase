<script setup>

import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    showCloseBtn: {type: Boolean, default: false},
    titulo: String,
    isAtivo: {type: Boolean},
    modalWidth: Number
})

defineEmits(['closeModalCard'])

</script>

<style>

.modal-card-head {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
    
</style>

<template>

    <div class="modal" :class="{'is-active' : props.isAtivo}" :style="'width: ' + modalWidth + ' rem'">
        <div class="modal-background"></div>
        <div class="modal-card has-background-light">
            <header class="modal-card-head has-background-info-dark is-justify-content-space-between pl-4 py-2">
                <p class="modal-card-title is-size-4 has-text-light has-text-weight-semibold">{{ titulo }}</p>
                <button v-if="showCloseBtn" @click="$emit('closeModalCard')" class="has-background-danger has-text-light has-text-weight-semibold delete is-medium" aria-label="close">X</button>
            </header>
            <section class="modal-card-body has-background-light">
                <slot name="body"></slot>
            </section>
            <footer class="modal-card-foot is-justify-content-center"> 
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>

</template>

