<template>

    <div v-if="props.mostrarPopupExcluir" class="modal is-active" id="modal-popup-excluir">
        <div class="modal-background"></div>
        <div class="modal-content has-background-light" style="width: 25em !important;">
            <div class="is-flex is-flex-direction-column is-justify-content-center is-align-content-center m-3">
                <div class="is-flex is-justify-content-center m-4">
                    <font-awesome-icon :icon="['fas', 'trash-can']" class="icon is-large has-text-danger"/>
                </div>
                <h1 class="has-text-centered my-1">Deseja excluir mesmo o item selecionado?</h1>
                <p class="has-text-centered mb-2">Nome : <span class="has-text-weight-bold">{{ props.clienteSelecionadoExcluir }}</span></p>
                <footer class="is-flex is-justify-content-center mt-3">
                    <button @click="excluirCliente()" class="button is-danger is-small has-text-weight-bold mr-2" id="btn-excluir-sim">Excluir</button>
                    <button @click="fecharPopupExcluir()" class="button is-warning is-small has-text-weight-bold" id="btn-excluir-nao">Cancelar</button>
                </footer>   
            </div>   
        </div>
    </div>

</template>

<script setup>

    import { deleteDoc, doc } from 'firebase/firestore'
    import { db } from '@/firebase'
    import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
        clienteSelecionadoExcluir: String,
        mostrarPopupExcluir: Boolean,
        id: String
    });

    const emit = defineEmits(['emitirNotificationExcluir', 'fecharPopupExcluir'])

    const excluirCliente = async() => {
        emit('emitirNotificationExcluir')
        const docRef = doc(db, 'clientes', props.id)
        await deleteDoc(docRef)
        .then(fecharPopupExcluir())
    };
    
    const fecharPopupExcluir = () => {
        emit('fecharPopupExcluir')
    };

</script>

<style scoped>

    button {
        width: 50%;
    }

</style>