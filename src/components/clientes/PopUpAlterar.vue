<template>

<div v-if="props.mostrarPopupAlterar" class="modal is-active" id="modal-popup-alterar">
        <div class="modal-background"></div>
        <div class="modal-content has-background-light" style="width: 40rem !important;">
            <div class="is-flex is-flex-direction-column is-justify-content-center is-align-content-center m-3">
                <div class="is-flex is-justify-content-center m-4">
                    <font-awesome-icon :icon="['fas', 'repeat']" class="icon is-large has-text-danger" />
                </div>
                <h1 class="has-text-centered my-1">Deseja alterar conforme dados abaixo?</h1>
                <table class="table is-bordered mt-3">
                    <div class="columns is-gapless is-vcentered">
                        <div class="column is-half">
                            <tr>
                                <td class="td-title">Id</td>
                                <td class="td-data">{{ this.id }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">Nome</td>
                                <td class="td-data">{{ this.nome }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">Tipo</td>
                                <td class="td-data">{{ this.tipo }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">CNPJ</td>
                                <td class="td-data">{{ this.cnpj }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">E-mail</td>
                                <td class="td-data">{{ this.email }}</td>
                            </tr>
                        </div>
                        <div class="column is-half">
                            <tr>
                                <td class="td-title">Telefone</td>
                                <td class="td-data">{{ this.telefone }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">Endereço</td>
                                <td class="td-data">{{ this.endereco }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">Bairro</td>
                                <td class="td-data">{{ this.bairro }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">Cidade</td>
                                <td class="td-data">{{ this.cidade }}</td>
                            </tr>
                            <tr>
                                <td class="td-title">UF</td>
                                <td class="td-data">{{ this.uf }}</td>
                            </tr>
                        </div>
                    </div> 
                </table>
                
        
                <footer class="is-flex is-justify-content-center mt-3">
                    <button @click="alterarRegistro()" class="button is-danger is-small has-text-weight-bold mr-2" id="btn-Alterar-sim">Alterar</button>
                    <button @click="fecharPopupAlterar()" class="button is-warning is-small has-text-weight-bold" id="btn-Alterar-nao">Cancelar</button>
                </footer>   
            </div>   
        </div>
    </div>

</template>

<script setup>

    import { updateDoc, doc } from 'firebase/firestore'
    import { db } from '@/firebase'
    import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
        mostrarPopupAlterar: Boolean,
        id: String,
        nome: String,
        tipo: String,
        cnpj: String,
        email: String,
        telefone: String,
        endereco: String,
        bairro: String,
        cidade: String,
        uf: String
    });

    const emit = defineEmits(['emitirNotificationAlterar', 'fecharModalEditar', 'fecharPopupAlterar'])

    const alterarRegistro = async () => {
            emit('emitirNotificationAlterar')
            const docRef = doc(db, 'clientes',props.id)
            await updateDoc(docRef, {
                nome: props.nome,
                tipo: props.tipo,
                cnpj: props.cnpj,
                email: props.email,
                telefone: props.telefone,
                endereco: props.endereco,
                bairro: props.bairro, 
                cidade: props.cidade,
                uf: props.uf
            })
            .then(fecharPopupAlterar())
            .then(emit('fecharModalEditar'))
        };
            
    const fecharPopupAlterar = () => {
        emit('fecharPopupAlterar')
    };

</script>

<style scoped>

    tr {
        text-align: center;
    }

    .td-title {
        font-size: 0.8rem;
        text-align: center;
        width: 5rem;
    }

    .td-data {
        font-size: 0.8rem;
        text-align: center;
        font-weight: 700;
        width: 20rem;
    }

    button {
        width: 50%;
    }

</style>