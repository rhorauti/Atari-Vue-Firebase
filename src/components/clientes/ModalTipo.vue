<template>

    <div v-if="this.mostrarModalTipo" class="modal is-active">
        <div class="modal-background">
            <div class="modal-content has-background-light mt-5" style="width: 30rem !important;">
                <div class="container">
                    <div class="is-flex is-justify-content-space-between has-background-info-dark has-text-light p-1">
                        <h1 class="has-text-centered has-text-weight-bold ml-2">Cadastro de tipo de cliente</h1>
                        <button @click="FecharModalTipo()" class="delete has-background-danger"></button>
                    </div>
                    <div class="is-flex is-flex-direction-column is-justify-content-cente mx-4">
                        <div class="is-flex is-justify-content-center mb-3 mt-3">
                            <font-awesome-icon :icon="['fas', 'file-circle-plus']" class="icon is-large has-text-info" />
                        </div>
                        <div class="is-flex is-justify-content-center mt-3">
                            <label class="label">Id</label>
                            <input v-model="this.id" type="text" class="input is-small is-info has-background-white" disabled>
                        </div>
                        <div class="is-flex is-justify-content-center mt-3 mb-2">
                            <label class="label">Nome</label>
                            <input v-model="this.nome" type="text" class="input is-small is-info has-background-white">
                        </div>
                        
                        <table class="table is-bordered is-hoverable mb-4">
                            <thead>
                                <tr>
                                    <th class="has-text-centered has-background-info-dark has-text-light">Id</th>
                                    <th class="has-text-centered has-background-info-dark has-text-light">Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="tipo in this.listaTipoClientes" :key="tipo.id" @click="PreencherCamposTipo(tipo.id, tipo.nome)">
                                    <td class="has-text-centered" style="width: 8rem;">{{ tipo.id }}</td>
                                    <td class="has-text-centered" style="width: 12rem;">{{ tipo.nome }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="is-flex is-justify-content-center">
                            <button @click="AdicionarTipo()" class="button is-small is-primary mb-3 mr-2">Adicionar</button>
                            <button @click="AlterarTipo()" class="button is-small is-warning mr-2">Alterar</button>
                            <button @click="ExcluirTipo()" class="button is-small is-danger mb-3">Excluir</button>
                        </div>        
                    </div>
                </div> <!--class container-->
            </div> <!--modal-content-->
        </div> <!--modal-background-->
    </div> <!--modal-->

</template>

<script>

    import { getDocs, collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore' 
    import { db } from '@/firebase'

    const modalTipo = {
        name: 'ModalTipo',

        data() {
            return {
                listaTipoClientes: [],
                id: '',
                nome: ''
            }
        },

        mounted() {
            this.ApiTiposClientes()
        },
        
        props: {
            mostrarModalTipo: Boolean
        },

        methods: {

            AlterarTipo() {
                const docRef = doc(db, 'tipos', this.id)
                updateDoc(docRef, {
                    nome: this.nome
                }).then(() => {
                    alert('Item alterado com sucesso!')
                    this.FecharModalTipo()
                })
            },

            ExcluirTipo() {
                const docRef = doc(db, 'tipos', this.id)
                deleteDoc(docRef).then(() => {
                    alert('Item excluido com sucesso!')
                    this.FecharModalTipo()
                })

            },

            AdicionarTipo() {
                const docRef = collection(db, 'tipos');
                const addTipo = addDoc(docRef, {
                    nome: this.nome
                })
                addTipo.then(() => {
                    this.id = '',
                    this.nome = '',
                    alert('Item incluido com sucesso!')
                })
            },

            PreencherCamposTipo(id, nome) {
                this.id = id;
                this.nome = nome;
            },

            ApiTiposClientes() {
                const docRef = collection(db, 'tipos')
                const queryTiposClientes = getDocs(docRef)
                queryTiposClientes.then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const dataSnapshot = doc.data()
                        dataSnapshot.id = doc.id
                        this.listaTipoClientes.push(dataSnapshot)
                    })
                })
            },

            FecharModalTipo() {
                this.id = '';
                this.nome = '';
                this.$emit('FecharModalTipo')
            }
        }

    }

    export default modalTipo

</script>

<style scoped>

    button {
        font-size: 0.6rem;
        font-weight: 600;
        width: 100%;
    }

    td, th {
        font-size: 0.6rem;
    }

    label {
        font-size: 0.8rem;
        width: 20%;
        align-self: center;
    }

    table {
        overflow: auto;
    }

</style>