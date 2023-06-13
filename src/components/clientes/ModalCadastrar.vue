<template>

    <div v-if="this.mostrarModalCadastrar" class="modal is-active" id="modalCadastrar">
        <div class="modal-background"></div>
        <div class="modal-content 
                    has-background-light
                    ">
            <div class="is-flex has-background-info-dark has-text-light is-justify-content-space-between pl-3 py-1 mb-2">
                <h1 class="is-size-5 has-text-weight-semibold">Cadastro de Novo Cliente</h1>
                <button @click="FecharModalCadastrar()" class="has-background-danger has-text-light has-text-weight-semibold delete is-medium mr-2 mt-1" aria-label="close" id="btnFecharModalCadastrar">X</button>
            </div>
            <div class="columns is-gapless">
                <div class="column">
                    <div class="mb-1 ml-3 mr-3"> <!--Id do cliente-->
                        <label for="cliente-id-modal-cadastrar" class="label is-small">Id</label>
                        <div class="control">
                            <input :value="this.id" @input="$emit('update:id', $event.target.value)" type="text" class="input is-small is-info has-background-white" id="cliente-id-modal-cadastrar" disabled>
                        </div>
                    </div>
                    <div class="mb-1 ml-3 mr-3"> <!--Nome do cliente-->
                        <label for="cliente-nome-modal-cadastrar" class="label is-small">Nome</label>
                        <div class="control">
                            <input :value="this.nome" @input="$emit('update:nome', $event.target.value)" type="text" class="input is-info is-small" id="cliente-nome-modal-cadastrar">
                        </div>
                    </div>
                    <!--Tipo de cliente-->
                    <label for="cliente-tipo-modal-cadastrar" class="label is-small ml-3 mb-1">Tipo</label>
                    <div class="mb-2 ml-3 mr-3 "> 
                        <select :value="this.tipo" @change="$emit('update:tipo', $event.target.value)" class="select is-info is-small is-hovered" id="cliente-tipo-modal-cadastrar">
                            <option v-for="selectDataTipo in selectDatasTipo" :key="selectDataTipo.id" :value="selectDataTipo.id">{{ selectDataTipo.nome }}</option>
                        </select>
                    </div>
                    <div class="mb-1 ml-3 mr-3"> <!--CNPJ do cliente-->
                        <label for="cliente-cnpj-modal-cadastrar" class="label is-small">CNPJ</label>
                        <div class="control">
                            <input :value="this.cnpj" @input="AtualizarCnpjVmaska($event.target.value)" type="text" class="input is-info is-small" id="cliente-cnpj-modal-cadastrar" v-maska :data-maska="this.vMaskaCnpjString">
                        </div>
                    </div>
                    <div class="mb-1 ml-3 mr-3"> <!--Email do cliente-->
                        <label for="cliente-email-modal-cadastrar" class="label is-small">E-mail</label>
                        <div class="control">
                            <input :value="this.email" @input="$emit('update:email', $event.target.value)" type="email" class="input is-info is-small" id="cliente-email-modal-cadastrar" placeholder="exemple@gmail.com" >
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="mb-1 mr-3"> <!--Telefone do cliente-->
                        <label for="cliente-telefone-modal-cadastrar" class="label is-small">Telefone</label>
                        <div class="control">
                            <input :value="this.telefone" @input="$emit('update:telefone', $event.target.value)" type="tel" class="input is-info is-small" id="cliente-telefone-modal-cadastrar" placeholder="(xx) xxxxx-xxxx" v-maska data-maska="(##) #####-####">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--Endereço do cliente-->
                        <label for="cliente-endereco-modal-cadastrar" class="label is-small">Endereço</label>
                        <div class="control">
                            <input :value="this.endereco" @input="$emit('update:endereco', $event.target.value)" type="text" class="input is-info is-small" id="cliente-endereco-modal-cadastrar">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--Bairro do cliente-->
                        <label for="cliente-bairro-modal-cadastrar" class="label is-small">Bairro</label>
                        <div class="control">
                            <input :value="this.bairro" @input="$emit('update:bairro', $event.target.value)" type="text" class="input is-info is-small" id="cliente-bairro-modal-cadastrar">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--Cidade do cliente-->
                        <label for="cliente-cidade-modal-cadastrar" class="label is-small">Cidade</label>
                        <div class="control">
                            <input :value="this.cidade" @input="$emit('update:cidade', $event.target.value)" type="text" class="input is-info is-small" id="cliente-cidade-modal-cadastrar">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--UF de cliente-->
                        <label for="cliente-uf-modal-cadastrar" class="label is-small ">UF</label>
                        <select :value="this.uf" @change="$emit('update:uf', $event.target.value)" class="select is-small" id="cliente-uf-modal-editar">
                            <option v-for="selectDataUF in selectDatasUF" :key="selectDataUF.id" :value="selectDataUF.id">{{ selectDataUF.nome }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="" id="button-footer"> <!--Botão de adicionar-->
                <div class="has-text-centered mb-4">
                    <button @click="AdicionarCliente()" class="button is-small has-background-info-dark has-text-light has-text-weight-semibold">Adicionar</button>
                    <button @click="LimparModalCadastrar()" class="button is-small has-background-warning-dark has-text-light ml-2 has-text-weight-semibold">Limpar</button>
                    <button @click="FecharModalCadastrar()" class="button is-small has-background-danger-dark has-text-light ml-2 has-text-weight-semibold" id="btnVoltarModalCadastar">Voltar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { vMaska } from 'maska'

    const modalCadastrar = {
        name: 'ModalCadastrar',

        data() {
            return {
                selectDatasTipo: [],
                selectDatasUF: [],
            }
        },

        async mounted() {      
            const selectDatasTipoApi = getDocs(collection(db, 'tipos'));
                selectDatasTipoApi.then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.selectDatasTipo.push(doc.data())
                    })
                });

                const selectDatasUFApi = getDocs(collection(db, 'ufs'));
                selectDatasUFApi.then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.selectDatasUF.push(doc.data())
                    })
                })
        },   

        directives: { maska: vMaska },

        props: {
            id: String,
            nome: String,
            tipo: String,
            cnpj: String,
            email: String,
            telefone: String,
            endereco: String,
            bairro: String,
            cidade: String,
            uf: String,
            vMaskaCnpjString: String,
            mostrarModalCadastrar: Boolean
        },

        methods: {
            async AdicionarCliente() {
                this.$emit('notificationAdicionar'); 
                await addDoc(collection(db, 'clientes'), {
                    nome: this.nome,
                    tipo: this.tipo,
                    cnpj: this.cnpj,
                    email: this.email,
                    telefone: this.telefone,
                    endereco: this.endereco,
                    bairro: this.bairro, 
                    cidade: this.cidade,
                    uf: this.uf
                }).then(() => {    
                    this.FecharModalCadastrar();
                    this.LimparModalCadastrar();
                })
            },

            FecharModalCadastrar() {
                this.$emit('FecharModalCadastrar')
            },

            LimparModalCadastrar() {
                this.$emit('LimparModalCadastrar')
            },

            AtualizarCnpjVmaska(novoValor) {
                this.$emit('update:cnpj', novoValor)
                this.$emit('AplicarVmaskaCnpj', novoValor)
            }
        }
    }

    export default modalCadastrar

</script>

<style>

    select {
        width: 100%;
    }

    #button-footer button {
        width: 30%;
    }

</style>