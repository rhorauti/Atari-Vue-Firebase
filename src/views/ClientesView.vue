<template>

    <div class="is-flex is-flex-direction-column mx-3">
        <div class="my-2 p-3 has-background-info-dark" id="div-cabecalho">
            <div class="is-flex is-justify-content-space-between">
                <label for="cliente" class="ml-2 has-text-light has-text-weight-semibold">Nome do cliente</label>
                <input type="text" class="input mx-3" id="input-pesquisar" v-model="inputPesquisar">
                <button class="button has-text-light has-background-success-dark has-text-weight-semibold mr-3" id="btn-pesquisar">Pesquisar</button>
                <button @click="AbrirModalCadastrar(); " class="button has-text-light has-background-success-dark has-text-weight-semibold" id="btn-cadastrar">Cadastrar</button>
            </div>
        </div>

        <notificationMessage
            @FecharNotificationAdicionar="FecharNotificationAdicionar()"
            @FecharNotificationAlterar="FecharNotificationAlterar()"
            @FecharNotificationExcluir="FecharNotificationExcluir()"
            :notificationAdicionar="this.notificationAdicionar"
            :notificationAlterar="this.notificationAlterar"
            :notificationExcluir="this.notificationExcluir"/>

        <table class="table is-bordered is-hoverable" id="table-data">
            <thead>
                <tr class="">
                    <th class="has-background-info-dark has-text-light has-text-centered" hidden>Id</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Nome</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Tipo
                        <font-awesome-icon @click="AbrirModalTipo()" :icon="['fas', 'plus']" class="has-background-warning-dark is-clickable"/>                    
                    </th>
                    <th class="has-background-info-dark has-text-light has-text-centered">CNPJ</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Email</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Telefone</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Endereço</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Bairro</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Cidade</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">UF
                        <font-awesome-icon :icon="['fas', 'plus']" class="has-background-warning-dark is-clickable"/> 
                    </th>
                        
                    <th class="has-background-info-dark has-text-light has-text-centered">Ação</th>
                </tr>
            </thead>
            <tbody class="">
                <tr v-for="cliente in clientes" :key="cliente.id">
                    <td class="has-text-centered" hidden>{{ cliente.id }}</td>
                    <td class="has-text-centered">{{ cliente.nome }}</td>
                    <td class="has-text-centered">{{ cliente.tipo }}</td>
                    <td class="has-text-centered">{{ cliente.cnpj }}</td>
                    <td class="has-text-centered">{{ cliente.email }}</td>
                    <td class="has-text-centered">{{ cliente.telefone }}</td>
                    <td class="has-text-centered">{{ cliente.endereco }}</td>
                    <td class="has-text-centered">{{ cliente.bairro }}</td>
                    <td class="has-text-centered">{{ cliente.cidade }}</td>
                    <td class="has-text-centered">{{ cliente.uf }}</td>
                    <td class="" style="width: 7.1rem; height: 1.0rem;">
                        <button @click="AbrirModalEditar(cliente.id, cliente.nome, cliente.tipo, cliente.cnpj, cliente.email, cliente.telefone,  cliente.endereco, cliente.bairro,cliente.cidade, cliente.uf )" class="button is-warning btnEditar">Editar</button>                                                                                 
                        <button @click="AbrirPopupExcluir(cliente.id, cliente.nome)" class="button is-danger btnExcluir ml-2">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table> 
    </div>

    <modalTipo 
            :mostrarModalTipo="this.mostrarModalTipo"
            @FecharModalTipo="FecharModalTipo()"/>

    <modalCadastrar 
        v-model:id="this.id"
        v-model:nome="this.nome"
        v-model:tipo="this.tipo"
        v-model:cnpj="this.cnpj"
        v-model:email="this.email"
        v-model:telefone="this.telefone"
        v-model:endereco="this.endereco"
        v-model:bairro="this.bairro"
        v-model:cidade="this.cidade"
        v-model:uf="this.uf"
        v-model:vMaskaCnpjString="this.vMaskaCnpj"
        @LimparModalCadastrar="LimparModal()"
        @AplicarVmaskaCnpj="AplicarVmaskaCnpj()"
        @notificationAdicionar="EmitirNotificationAdicionar()"
        @FecharModalCadastrar="FecharModalCadastrar()"
        :mostrarModalCadastrar="this.mostrarModalCadastrar"/>

    <modalEditar 
        v-model:id="this.id"
        v-model:nome="this.nome"
        v-model:tipo="this.tipo"
        v-model:cnpj="this.cnpj"
        v-model:email="this.email"
        v-model:telefone="this.telefone"
        v-model:endereco="this.endereco"
        v-model:bairro="this.bairro"
        v-model:cidade="this.cidade"
        v-model:uf="this.uf"
        @AplicarVmaskaCnpj="AplicarVmaskaCnpj()"
        @LimparModalEditar="LimparModal()"
        @FecharModalEditar="FecharModalEditar()"
        @AbrirPopupAlterar="AbrirPopupAlterar()"
        :mostrarModalAlterar="this.mostrarModalAlterar"
        :vMaskaCnpjString="this.vMaskaCnpj"
        />

        <popUpAlterar
            @FecharPopupAlterar="FecharPopupAlterar()"
            @EmitirNotificationAlterar="EmitirNotificationAlterar()"
            @FecharModalEditar="FecharModalEditar()"
            :mostrarPopupAlterar="this.mostrarPopupAlterar"
            :id="this.id"
            :nome="this.nome"
            :tipo="this.tipo"
            :cnpj="this.cnpj"
            :email="this.email"
            :telefone="this.telefone"
            :endereco="this.endereco"
            :bairro="this.bairro"
            :cidade="this.cidade"
            :uf="this.uf"/>

        <popUpExcluir
            :clienteSelecionadoExcluir="this.clienteSelecionadoExcluir"
            :mostrarPopupExcluir="this.mostrarPopupExcluir"
            :id="this.id" 
            @FecharPopupExcluir="FecharPopupExcluir()"
            @EmitirNotificationExcluir="EmitirNotificationExcluir()"/>

      

</template>

<script>

import modalCadastrar from '@/components/clientes/ModalCadastrar.vue'
import modalEditar from '@/components/clientes/ModalEditar.vue'
import modalTipo from '@/components/clientes/ModalTipo.vue'
import popUpExcluir from '@/components/clientes/PopUpExcluir.vue'
import popUpAlterar from '@/components/clientes/PopUpAlterar.vue'
import notificationMessage from '@/components/clientes/NotificationMessage.vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

const clientes = {
        name: 'ClientesView',
        data() {
            return {
                clientes: [],
                id: '',
                nome: '',
                tipo: '',
                cnpj: '',
                email: '',
                telefone: '',
                endereco: '',
                bairro: '',
                cidade: '',
                uf: '',
                vMaskaCnpj: '',
                clienteSelecionadoExcluir: '',
                notificationExcluir: false,
                notificationAlterar: false,
                notificationAdicionar: false,
                mostrarModalCadastrar: false,
                mostrarPopupExcluir: false,
                mostrarModalAlterar: false,
                mostrarPopupAlterar: false,
                mostrarModalTipo: false,
                inputPesquisar: ''
            }
        },

         mounted() {
            const query = collection(db, 'clientes');
            onSnapshot(query, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const dataResult = doc.data()
                    dataResult.id = doc.id
                    this.clientes.push(dataResult)
                }) 
            })
        },

        components: {
            modalCadastrar,
            modalEditar,
            popUpExcluir,
            notificationMessage,
            popUpAlterar,
            modalTipo
        },  

        methods: {

            FecharModalTipo() {
                this.mostrarModalTipo = false;
            },

            AbrirModalTipo() {
                this.mostrarModalTipo = true
            },

            AplicarVmaskaCnpj() {
                if (this.cnpj.length <= 14) {
                    this.vMaskaCnpj = "###.###.###-##"
                } else {
                    this.vMaskaCnpj = "##.###.###/####-##"
                }
            },

            LimparModal() {
                this.id = '',
                this.nome = '',
                this.tipo = '',
                this.cnpj = '',
                this.email = '',
                this.telefone = '',
                this.endereco = '',
                this.bairro = '',
                this.cidade = '',
                this.uf = '',
                this.inputPesquisar = ''
            },

            AbrirModalCadastrar() {
                this.LimparModal();
                this.mostrarModalCadastrar = true;
            },

            FecharModalCadastrar() {
                this.mostrarModalCadastrar = false;
            },

            AbrirModalEditar(id, nome, tipo, cnpj, email, telefone, endereco, bairro, cidade, uf) {
                this.mostrarModalAlterar = true
                this.id = id,
                this.nome = nome,
                this.tipo = tipo,
                this.cnpj = cnpj,
                this.email = email,
                this.telefone = telefone,
                this.endereco = endereco,
                this.bairro = bairro,
                this.cidade = cidade,
                this.uf = uf
            },

            FecharModalEditar() {
                this.mostrarModalAlterar = false;
            },

            AbrirPopupAlterar() {
                this.mostrarPopupAlterar = true
            },

            FecharPopupAlterar() {
                this.mostrarPopupAlterar = false;
            },

            AbrirPopupExcluir(id, nome) {
                this.mostrarPopupExcluir = true
                this.clienteSelecionadoExcluir = nome
                this.id = id
            },    

            FecharPopupExcluir() {
                this.mostrarPopupExcluir = false
            },

            EmitirNotificationAdicionar() {
                this.clientes = [];
                this.notificationAdicionar = true
                let setTime = setTimeout(() => {
                    this.notificationAdicionar = false;
                    clearTimeout(setTime)
               }, 4000); 
            },

            EmitirNotificationAlterar() {
                this.clientes = [];
                this.notificationAlterar = true
                let setTime = setTimeout(() => {
                    this.notificationAlterar = false;
                    clearTimeout(setTime)
               }, 4000);
            },

            EmitirNotificationExcluir() {
                this.clientes = [];
                this.notificationExcluir = true;
                let setTime = setTimeout(() => {
                    this.notificationExcluir = false;
                    clearTimeout(setTime)
                }, 4000);
            },

            FecharNotificationAdicionar() {
                this.notificationAdicionar = false
            },

            FecharNotificationAlterar() {
                this.notificationAlterar = false
            },

            FecharNotificationExcluir() {
                this.notificationExcluir = false
            }
        }
    }

    export default clientes

</script>


<style>

    :root {
        --font-size-cabecalho: 0.60rem;
        --font-size-table: 0.56rem;
    }

    div label {
        width: 6.8rem;
        align-self: center;
        font-size: var(--font-size-cabecalho);
    }

    #btn-cadastrar, #btn-pesquisar, #input-pesquisar {
        font-size: var(--font-size-cabecalho);
    }

    #div-cabecalho {
        border-radius: 0.5rem;
    }

    td, th {
        text-align: center;
        font-size: var(--font-size-table);
    }

    select {
        font-size: var(--font-size-table);
        text-align: left;
        vertical-align: -webkit-baseline-middle;
    }

    .btnEditar, .btnExcluir {
        font-size: var(--font-size-table);
        font-weight: 600;
    }

</style>