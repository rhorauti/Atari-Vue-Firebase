<template>

    <div class="is-flex is-flex-direction-column mx-3">
        <div class="my-2 p-3 has-background-info-dark" id="div-cabecalho">
            <div class="is-flex is-justify-content-space-between">
                <label for="cliente" class="ml-2 has-text-light has-text-weight-semibold">Nome do cliente</label>
                <input type="text" class="input mx-3" id="input-pesquisar" v-model="dadosClientes.inputPesquisar">
                <button class="button has-text-light has-background-success-dark has-text-weight-semibold mr-3" id="btn-pesquisar">Pesquisar</button>
                <button @click="abrirModalCadastrar(); " class="button has-text-light has-background-success-dark has-text-weight-semibold" id="btn-cadastrar">Cadastrar</button>
            </div>
        </div>

        <NotificationMessage
            @FecharNotificationAdicionar="fecharNotificationAdicionar()"
            @FecharNotificationAlterar="fecharNotificationAlterar()"
            @FecharNotificationExcluir="fecharNotificationExcluir()"
            :notificationAdicionar="dadosClientes.notificationAdicionar"
            :notificationAlterar="dadosClientes.notificationAlterar"
            :notificationExcluir="dadosClientes.notificationExcluir"/>

        <table class="table is-bordered is-hoverable" id="table-data">
            <thead>
                <tr class="">
                    <th class="has-background-info-dark has-text-light has-text-centered" hidden>Id</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Nome</th>
                    <th class="has-background-info-dark has-text-light has-text-centered">Tipo
                        <font-awesome-icon @click="abrirModalTipo()" :icon="['fas', 'plus']" class="has-background-warning-dark is-clickable"/>                    
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
                <tr v-for="cliente in dadosClientes.clientes" :key="cliente.id">
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
                        <button @click="abrirModalEditar(cliente.id, cliente.nome, cliente.tipo, cliente.cnpj, cliente.email, cliente.telefone,  cliente.endereco, cliente.bairro,cliente.cidade, cliente.uf )" class="button is-warning btnEditar">Editar</button>                                                                                 
                        <button @click="abrirPopupExcluir(cliente.id, cliente.nome)" class="button is-danger btnExcluir ml-2">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table> 
    </div>

    <ModalTipo 
            :mostrarModalTipo="dadosClientes.mostrarModalTipo"
            @fecharModalTipo="fecharModalTipo()"/>

    <ModalCadastrar 
        v-model:id="dadosClientes.id"
        v-model:nome="dadosClientes.nome"
        v-model:tipo="dadosClientes.tipo"
        v-model:cnpj="dadosClientes.cnpj"
        v-model:email="dadosClientes.email"
        v-model:telefone="dadosClientes.telefone"
        v-model:endereco="dadosClientes.endereco"
        v-model:bairro="dadosClientes.bairro"
        v-model:cidade="dadosClientes.cidade"
        v-model:uf="dadosClientes.uf"
        v-model:vMaskaCnpjString="dadosClientes.vMaskaCnpj"
        @LimparModalCadastrar="limparModal()"
        @AplicarVmaskaCnpj="aplicarVmaskaCnpj()"
        @notificationAdicionar="emitirNotificationAdicionar()"
        @FecharModalCadastrar="fecharModalCadastrar()"
        :mostrarModalCadastrar="dadosClientes.mostrarModalCadastrar"/>

    <ModalEditar 
        v-model:id="dadosClientes.id"
        v-model:nome="dadosClientes.nome"
        v-model:tipo="dadosClientes.tipo"
        v-model:cnpj="dadosClientes.cnpj"
        v-model:email="dadosClientes.email"
        v-model:telefone="dadosClientes.telefone"
        v-model:endereco="dadosClientes.endereco"
        v-model:bairro="dadosClientes.bairro"
        v-model:cidade="dadosClientes.cidade"
        v-model:uf="dadosClientes.uf"
        @AplicarVmaskaCnpj="aplicarVmaskaCnpj()"
        @LimparModalEditar="limparModal()"
        @FecharModalEditar="fecharModalEditar()"
        @AbrirPopupAlterar="abrirPopupAlterar()"
        :mostrarModalAlterar="dadosClientes.mostrarModalAlterar"
        :vMaskaCnpjString="dadosClientes.vMaskaCnpj"
        />

        <PopUpAlterar
            @FecharPopupAlterar="fecharPopupAlterar()"
            @EmitirNotificationAlterar="emitirNotificationAlterar()"
            @FecharModalEditar="fecharModalEditar()"
            :mostrarPopupAlterar="dadosClientes.mostrarPopupAlterar"
            :id="dadosClientes.id"
            :nome="dadosClientes.nome"
            :tipo="dadosClientes.tipo"
            :cnpj="dadosClientes.cnpj"
            :email="dadosClientes.email"
            :telefone="dadosClientes.telefone"
            :endereco="dadosClientes.endereco"
            :bairro="dadosClientes.bairro"
            :cidade="dadosClientes.cidade"
            :uf="dadosClientes.uf"/>

        <PopUpExcluir
            :clienteSelecionadoExcluir="dadosClientes.clienteSelecionadoExcluir"
            :mostrarPopupExcluir="dadosClientes.mostrarPopupExcluir"
            :id="dadosClientes.id" 
            @FecharPopupExcluir="fecharPopupExcluir()"
            @EmitirNotificationExcluir="emitirNotificationExcluir()"/>

      

</template>

<script setup>

import ModalCadastrar from '@/components/clientes/ModalCadastrar.vue'
import ModalEditar from '@/components/clientes/ModalEditar.vue'
import ModalTipo from '@/components/clientes/ModalTipo.vue'
import PopUpExcluir from '@/components/clientes/PopUpExcluir.vue'
import PopUpAlterar from '@/components/clientes/PopUpAlterar.vue'
import NotificationMessage from '@/components/clientes/NotificationMessage.vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref, onMounted } from 'vue'

    const dadosClientes = ref({
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
    })   

    onMounted(() => {
        const query = collection(db, 'clientes');
        onSnapshot(query, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const dataResult = doc.data()
                dataResult.id = doc.id
                dadosClientes.value.clientes.push(dataResult)
            }) 
        })
    })


    const fecharModalTipo = () => {
        dadosClientes.value.mostrarModalTipo = false;
    }

    const abrirModalTipo = () => {
        dadosClientes.value.mostrarModalTipo = true
    }

    const aplicarVmaskaCnpj = () => {
        if (dadosClientes.value.cnpj.length <= 14) {
            dadosClientes.value.vMaskaCnpj = "###.###.###-##"
        } else {
            dadosClientes.value.vMaskaCnpj = "##.###.###/####-##"
        }
    }

    const limparModal = () => {
        dadosClientes.value.id = '',
        dadosClientes.value.nome = '',
        dadosClientes.value.tipo = '',
        dadosClientes.value.cnpj = '',
        dadosClientes.value.email = '',
        dadosClientes.value.telefone = '',
        dadosClientes.value.endereco = '',
        dadosClientes.value.bairro = '',
        dadosClientes.value.cidade = '',
        dadosClientes.value.uf = '',
        dadosClientes.value.inputPesquisar = ''
    }

    const abrirModalCadastrar = () => {
        limparModal();
        dadosClientes.value.mostrarModalCadastrar = true;
    }

    const fecharModalCadastrar = () => {
        dadosClientes.value.mostrarModalCadastrar = false;
    }

    const abrirModalEditar = (id, nome, tipo, cnpj, email, telefone, endereco, bairro, cidade, uf) => {
        dadosClientes.value.mostrarModalAlterar = true
        dadosClientes.value.id = id,
        dadosClientes.value.nome = nome,
        dadosClientes.value.tipo = tipo,
        dadosClientes.value.cnpj = cnpj,
        dadosClientes.value.email = email,
        dadosClientes.value.telefone = telefone,
        dadosClientes.value.endereco = endereco,
        dadosClientes.value.bairro = bairro,
        dadosClientes.value.cidade = cidade,
        dadosClientes.value.uf = uf
    }

    const fecharModalEditar = () => {
        dadosClientes.value.mostrarModalAlterar = false;
    }

    const abrirPopupAlterar = () => {
        dadosClientes.value.mostrarPopupAlterar = true
    }

    const fecharPopupAlterar = () => {
        dadosClientes.value.mostrarPopupAlterar = false;
    }

    const abrirPopupExcluir = (id, nome) => {
        dadosClientes.value.mostrarPopupExcluir = true
        dadosClientes.value.clienteSelecionadoExcluir = nome
        dadosClientes.value.id = id
    }   

    const fecharPopupExcluir = () => {
        dadosClientes.value.mostrarPopupExcluir = false
    }

    const emitirNotificationAdicionar = () => {
        dadosClientes.value.clientes = [];
        dadosClientes.value.notificationAdicionar = true
        let setTime = setTimeout(() => {
            dadosClientes.value.notificationAdicionar = false;
            clearTimeout(setTime)
        }, 4000); 
    }

    const emitirNotificationAlterar = () => {
        dadosClientes.value.clientes = [];
        dadosClientes.value.notificationAlterar = true
        let setTime = setTimeout(() => {
            dadosClientes.value.notificationAlterar = false;
            clearTimeout(setTime)
        }, 4000);
    }

    const emitirNotificationExcluir = () => {
        dadosClientes.value.clientes = [];
        dadosClientes.value.notificationExcluir = true;
        let setTime = setTimeout(() => {
            dadosClientes.value.notificationExcluir = false;
            clearTimeout(setTime)
        }, 4000);
    }

    const fecharNotificationAdicionar = () => {
        dadosClientes.value.notificationAdicionar = false
    }

    const fecharNotificationAlterar = () => {
        dadosClientes.value.notificationAlterar = false
    }

    const fecharNotificationExcluir = () => {
        dadosClientes.value.notificationExcluir = false
    }

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