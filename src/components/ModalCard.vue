<script setup>

import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    showCloseBtn: {type: Boolean, default: true},
    titulo: String,
    isAtivo: {type: Boolean}
})

defineEmits(['closeModalCard'])

</script>

<style scoped>

.modal-card-head {
    border-radius: 0;
}
    
</style>

<template>

    <div class="modal" :class="{'is-active' : props.isAtivo}">
        <div class="modal-background"></div>
        <div class="modal-card has-background-light">
            <header class="modal-card-head has-background-info-dark is-justify-content-space-between pl-4 py-2">
                <p class="modal-card-title is-size-5 has-text-light has-text-weight-semibold">{{ titulo }}</p>
                <button v-if="showCloseBtn" @click="$emit('closeModalCard', false)" class="has-background-danger has-text-light has-text-weight-semibold delete is-medium" aria-label="close">X</button>
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

