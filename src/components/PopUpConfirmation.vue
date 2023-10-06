<script setup>

    import { defineProps } from 'vue'

    const props = defineProps({
        ispopUpConfirmationAtivo: Boolean,
        titlePopUpConfirmation: {type: String, default: null},
        popUpWidth: {type: Number}
    });

</script>

<style>

</style>

<template>

<div class="modal" :class="{'is-active': props.ispopUpConfirmationAtivo}">
        <div class="modal-background"></div>
        <div class="modal-content has-background-light" :style="`width: ${props.popUpWidth}rem !important;`">
            <div class="is-flex is-flex-direction-column is-justify-content-center is-align-content-center m-3">
                <div class="is-flex is-justify-content-center m-4">
                    <font-awesome-icon :icon="['fas', 'repeat']" class="icon is-large has-text-info" />
                </div>
                <h1 class="has-text-centered my-1">{{ props.titlePopUpConfirmation }}</h1>
                <slot name="body"></slot>                
                <footer>
                    <slot name="footer"></slot>   
                </footer>   
            </div>   
        </div>
    </div>

</template>

