<template>
 
    <div v-if="props.notificationAdicionar" class="notification has-background-primary is-flex " style="padding: 0.2rem !important; margin-bottom: 0.4rem !important;">
        <div class="is flex mb-1">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="has-text-light mt-2 ml-3"/>
            <span class="has-text-light ml-3">Item adicionado com sucesso!</span>
        </div>
        <button class="delete" @click="fecharNotificationAdicionar()"></button>
    </div>

    <div v-if="props.notificationAlterar" class="notification has-background-primary is-flex " style="padding: 0.2rem !important; margin-bottom: 0.4rem !important;">
        <div class="is flex mb-1">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="has-text-light mt-2 ml-3"/>
            <span class="has-text-light ml-3">Item alterado com sucesso!</span>
        </div>
        <button class="delete" @click="fecharNotificationAlterar()"></button>
    </div>

    <div v-if="props.notificationExcluir" class="notification has-background-primary is-flex " style="padding: 0.2rem !important; margin-bottom: 0.4rem !important;">
        <div class="is flex mb-1">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="has-text-light mt-2 ml-3"/>
            <span class="has-text-light ml-3">Item excluido com sucesso!</span>
        </div>
        <button class="delete" @click="fecharNotificationExcluir()"></button>
    </div>

</template>

<script setup>

    import { defineProps, defineEmits } from 'vue'    

    const props = defineProps({
        notificationExcluir: Boolean,
        notificationAlterar: Boolean,
        notificationAdicionar: Boolean
    }) 

    const emit = defineEmits(['fecharNotificationAdicionar', 'fecharNotificationAdicionar', 'fecharNotificationExcluir'])

    const fecharNotificationAdicionar = () => {
            emit('fecharNotificationAdicionar')
    };

    const fecharNotificationAlterar = () => {
        emit('fecharNotificationAlterar')
    };

    const fecharNotificationExcluir = () => {
            emit('fecharNotificationExcluir')
    };

</script>

<style>

</style>


  