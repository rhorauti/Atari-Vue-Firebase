<template>

    <div v-if="this.mostrarModalAlterar" class="modal is-active" id="modalEditar">
        <div class="modal-background"></div>
        <div class="modal-content 
                    has-background-light
                    ">
            <div class="is-flex has-background-info-dark has-text-light is-justify-content-space-between pl-3 py-1 mb-2">
                <h1 class="is-size-5 has-text-weight-semibold">Alteração de Registro de Cliente</h1>
                <button @click="FecharModalEditar()" class="has-background-danger has-text-light has-text-weight-semibold delete is-medium mr-2 mt-1" aria-label="close" id="btnFecharModalEditar">X</button>
            </div>
            <div class="columns is-gapless">
                <div class="column">
                    <div class="mb-1 ml-3 mr-3"> <!--Id do cliente-->
                        <label for="cliente-id-modal-editar" class="label is-small">Id</label>
                        <div class="control">
                            <input :value="id" @input="$emit('update:id', $event.target.value)" type="text" class="input is-small is-info has-background-white" id="cliente-id-modal-editar" disabled>
                        </div>
                    </div>
                    <div class="mb-1 ml-3 mr-3"> <!--Nome do cliente-->
                        <label for="cliente-nome-modal-editar" class="label is-small">Nome</label>
                        <div class="control">
                            <input :value="nome" @input="$emit('update:nome', $event.target.value)" type="text" class="input is-info is-small" id="cliente-nome-modal-editar">
                        </div>
                    </div>
                    <!--Tipo de cliente-->
                    <label for="cliente-tipo-modal-editar" class="label is-small ml-3 mb-1">Tipo</label>
                    <div class="mb-2 ml-3 mr-3 "> 
                        <select :value="this.tipo" @change="$emit('update:tipo', $event.target.value)" class="select is-info is-small is-hovered" id="cliente-tipo-modal-editar">
                            <option v-for="selectDataTipo in selectDatasTipo" :key="selectDataTipo.id" :value="selectDataTipo.id">{{ selectDataTipo.nome }}</option>
                        </select>
                    </div>
                    <div class="mb-1 ml-3 mr-3"> <!--CNPJ do cliente-->
                        <label for="cliente-cnpj-modal-editar" class="label is-small">CNPJ</label>
                        <div class="control">
                            <input :value="cnpj" @input="AtualizarCnpjVmaska($event.target.value)" v-maska :data-maska="this.vMaskaCnpjString" type="text" class="input is-info is-small" id="cliente-cnpj-modal-editar">
                        </div>
                    </div>
                    <div class="mb-1 ml-3 mr-3"> <!--Email do cliente-->
                        <label for="cliente-email-modal-editar" class="label is-small">E-mail</label>
                        <div class="control">
                            <input :value="email" @input="$emit('update:email', $event.target.value)" type="email" class="input is-info is-small" id="cliente-email-modal-editar">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="mb-1 mr-3"> <!--Telefone do cliente-->
                        <label for="cliente-telefone-modal-editar" class="label is-small">Telefone</label>
                        <div class="control">
                            <input :value="telefone" @input="$emit('update:telefone', $event.target.value)" v-maska data-maska="(##) #####-####" type="tel" class="input is-info is-small" id="cliente-telefone-modal-editar" placeholder="(xx) xxxxx-xxxx">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--Endereço do cliente-->
                        <label for="cliente-endereco-modal-editar" class="label is-small">Endereço</label>
                        <div class="control">
                            <input :value="endereco" @input="$emit('update:endereco', $event.target.value)" type="tel" class="input is-info is-small" id="cliente-endereco-modal-editar">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--Bairro do cliente-->
                        <label for="cliente-bairro-modal-editar" class="label is-small">Bairro</label>
                        <div class="control">
                            <input :value="bairro" @input="$emit('update:bairro', $event.target.value)" type="text" class="input is-info is-small" id="cliente-bairro-modal-editar">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--Cidade do cliente-->
                        <label for="cliente-cidade-modal-editar" class="label is-small">Cidade</label>
                        <div class="control">
                            <input :value="cidade" @input="$emit('update:cidade', $event.target.value)" type="text" class="input is-info is-small" id="cliente-cidade-modal-editar">
                        </div>
                    </div>
                    <div class="mb-1 mr-3"> <!--UF de cliente-->
                        <label for="cliente-uf-modal-editar" class="label is-small ">UF</label>
                        <select :value="this.uf" @change="$emit('update:uf', $event.target.value)" class="select is-small" id="cliente-uf-modal-editar">
                            <option v-for="selectDataUF in selectDatasUF" :key="selectDataUF.id" :value="selectDataUF.id">{{ selectDataUF.nome }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="" id="button-footer"> <!--Botão de adicionar-->
                <div class="has-text-centered mb-4">
                    <button @click="AbrirPopupAlterar()" class="button is-small has-background-info-dark has-text-light has-text-weight-semibold">Alterar</button>
                    <button @click="LimparModalEditar()" class="button is-small has-background-warning-dark has-text-light ml-2 has-text-weight-semibold">Limpar</button>
                    <button @click="FecharModalEditar()" class="button is-small has-background-danger-dark has-text-light ml-2 has-text-weight-semibold" id="btnVoltarModalEditar">Voltar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    import { collection, getDocs } from 'firebase/firestore'
    import { db } from '@/firebase'
    import { vMaska } from 'maska'

    const modalEditar = {
        name: 'ModalEditar',

        data() {
            return {
                selectDatasTipo: [],
                selectDatasUF: []
            }
        },

        async mounted() {      
            const selectDatasTipoApi = getDocs(collection(db, 'tipos'));
                selectDatasTipoApi.then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.selectDatasTipo.push(doc.data())
                    })
                })

            const selectDatasUFApi = getDocs(collection(db, 'ufs'));
                selectDatasUFApi.then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.selectDatasUF.push(doc.data())
                    })
                })
        },   

        directives: { Maska: vMaska },

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
            mostrarModalAlterar: Boolean,
            vMaskaCnpjString: String
        },
        
        methods: {

            AbrirPopupAlterar() {
                this.$emit('AbrirPopupAlterar')
            },

            LimparModalEditar() {
                this.$emit('LimparModalEditar')
            },

            FecharModalEditar() {
                this.$emit('FecharModalEditar');
            },

            AtualizarCnpjVmaska(novoValor) {
                this.$emit('update:cnpj', novoValor)
                this.$emit('AplicarVmaskaCnpj', novoValor)
            }
        }
    }

    export default modalEditar

</script>

<style>

    select {
        width: 100%;
    }

    #button-footer button {
        width: 30%;
    }

</style>