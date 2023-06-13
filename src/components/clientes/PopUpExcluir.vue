<template>

    <div v-if="this.mostrarPopupExcluir" class="modal is-active" id="modal-popup-excluir">
        <div class="modal-background"></div>
        <div class="modal-content has-background-light" style="width: 25em !important;">
            <div class="is-flex is-flex-direction-column is-justify-content-center is-align-content-center m-3">
                <div class="is-flex is-justify-content-center m-4">
                    <font-awesome-icon :icon="['fas', 'trash-can']" class="icon is-large has-text-danger"/>
                </div>
                <h1 class="has-text-centered my-1">Deseja excluir mesmo o item selecionado?</h1>
                <p class="has-text-centered mb-2">Nome : <span class="has-text-weight-bold">{{ this.clienteSelecionadoExcluir }}</span></p>
                <footer class="is-flex is-justify-content-center mt-3">
                    <button @click="ExcluirCliente()" class="button is-danger is-small has-text-weight-bold mr-2" id="btn-excluir-sim">Excluir</button>
                    <button @click="FecharPopupExcluir()" class="button is-warning is-small has-text-weight-bold" id="btn-excluir-nao">Cancelar</button>
                </footer>   
            </div>   
        </div>
    </div>

</template>

<script>

    import { deleteDoc, doc } from 'firebase/firestore'
    import { db } from '@/firebase'

    const popUpExcluir = {
        name: 'PopUpExcluir',

        props: {
            clienteSelecionadoExcluir: String,
            mostrarPopupExcluir: Boolean,
            id: String
        },

        methods: {
            async ExcluirCliente() {
                this.$emit('EmitirNotificationExcluir')
                const docRef = doc(db, 'clientes', this.id)
                await deleteDoc(docRef)
                .then(this.FecharPopupExcluir())
            },
            
            FecharPopupExcluir() {
                this.$emit('FecharPopupExcluir')
            }
        }
    }

    export default popUpExcluir

</script>

<style scoped>

    button {
        width: 50%;
    }

</style>