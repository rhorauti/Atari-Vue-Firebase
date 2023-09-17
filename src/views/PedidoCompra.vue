<script setup>

// import ModalCard from '@/components/ModalCard.vue'
// import PopUpConfirmation from '@/components/PopUpConfirmation.vue'
// import { db } from '@/firebase'
// import { ref, watch } from 'vue'
// import { vMaska } from 'maska'
// import { Block, Notify, Confirm, Loading } from 'notiflix';

// const modalPedido = ref({
//     idPedido: null,
//     nome: null,
//     tipo: null,
//     cnpj: null,
//     email: null,
//     telefone: null,
//     endereco: null,
//     bairro: null,
//     cidade: null,
//     uf: null,
// })

// const cols = [
//     "IdPed", 
//     "Rev",
//     "Data",
//     "IdForn", 
//     "Forn", 
//     "CC", 
//     "Total pedido", 
//     "Aterado por", 
//     "Ação"
// ];
// const colsVisibleStorage = "R0LkbqL2WdcMf8TnL8";
// const colsVisible = ref([]);
// const colsVisibleSelector = ref(false);

// watch(colsVisible, (n) => {
//     window.localStorage.setItem(colsVisibleStorage, JSON.stringify(n));
// });

// const dadosTabelaHome = ref([]);

// function atualizarDadosHome() {
//     dadosTabelaHome.value = [];
//     const query = getDocs(collection(db, 'pedidos-compra'));
//     query.then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             const dataResult = doc.data();
//             dataResult.id = doc.id;
//             dadosTabelaHome.value.push(dataResult);
//         })
//     })
// }

</script>


<style scoped>

@import 'bulma/css/bulma.min.css';
@import 'bulma-extensions/dist/css/bulma-extensions.min.css';


.container-principal-clientes {
    height: 100vh;
    font-size: 0.9rem;
}

td, th {
    text-align: center;
    /* white-space: nowrap; */
} 

.field.is-grouped {
    justify-content: center;
}

div span {
    font-size: 0.9rem;
}

.btn-tabela {
    font-size: 0.9rem;
}

.area-pesquisa {
    position: relative;
    top: 1.9rem;
    left: 0;
    width: 100%;
    padding: 1.2rem;
    margin-bottom: 2rem;
    align-items: center;
}

</style>

<template>
<!--Home área de filtro + tabela clientes-->
<div class="mx-4 my-4 container-principal-clientes">
    <!--Campo de filtro da tabela + botão cadastrar-->
    <!-- <div class="field is-grouped area-pesquisa">
        <label class="label mr-3 has-text-light">Fornecedor: </label>
        <p class="control is-expanded">
            <input type="text" class="input" v-model="inputPesquisar">
        </p>
        <div class="field is-grouped">
            <p class="control">
                <button class="button is-light is-outlined">
                    <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                    <span>Limpar</span> 
                </button>
            </p>
            <div class="control">
                <button class="button is-light is-outlined" @click="colsVisibleSelector=!colsVisibleSelector">
                    <span class="icon"><font-awesome-icon :icon="['fas', 'eye']"/></span>
                    <span>Colunas</span>
                </button>
                <div style="position: absolute; display: flex; flex-direction: column; top: 0rem; z-index: 100; border: 1px solid #777; padding: 1.2rem; border-radius: 1rem; background-color: #fff; right: 7.2rem; width: 10rem;" v-show="colsVisibleSelector">
                    <label class="checkbox has-text-dark" v-for="col, colunasid in cols" :key="colunasid">
                        <input class="mr-2" type="checkbox" :value="col" v-model="colsVisible" :disabled="col=='Id' || col=='Nome'"/>{{ col }}
                    </label>
                </div>
            </div>
            <p class="control">
                <button @click="abrirModalCadastrar" class="button is-info has-text-weight-bold is-fullwidth">
                    <font-awesome-icon :icon="['fa', 'fa-floppy-disk']" class="mr-1"/>
                    <span>Pedido</span> 
                </button>
            </p>
        </div>
    </div> -->
    <!--Tabela home de clientes-->
    <!-- <div style="max-height: calc(100vh - 9rem); overflow: scroll;">
        <table class="table is-narrow is-bordered is-hoverable is-fullwidth">
            <thead style="position: sticky; top: 0; z-index: 2;">
                <tr>
                    <th class="has-text-centered has-background-dark has-text-light"
                    v-for="col, idcoluna in cols" v-show="colsVisible.indexOf(col) >=0" :key="idcoluna">{{ col }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pedido in atualizarDadosHome.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)" :key="pedido.id"
                    class="has-text-centered is-vcentered">
                    <td class="is-vcentered" v-show="colsVisible.indexOf('IdPed') >= 0">{{ pedido.idPedido }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Rev') >= 0">{{ formatarDataBr(pedido.cadastro) }} </td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Data') >= 0">{{ pedido.cnpj }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('IdForn') >= 0">{{ pedido.email }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Forn') >= 0">{{ pedido.telefone }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('CC') >= 0">{{ pedido.endereco }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Total pedido') >= 0">{{ pedido.cidade }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Alterado por') >= 0">{{ pedido.uf }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Ação') >= 0">
                        <div class="field is-grouped">
                            <p class="control">
                                <button class="button is-warning btn-tabela">
                                    <font-awesome-icon :icon="['fas', 'pen']"/>
                                </button>                                                                                 
                            </p>
                            <p class="control">
                                <button class="button is-danger btn-tabela">
                                    <font-awesome-icon :icon="['fas', 'trash']"/>
                                </button>
                            </p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table> 
    </div> -->
</div>

<!--Modal Cadastrar e Editar-->
<!-- <ModalCard @closeModalCard="cancelarRegistro" :isAtivo="isModalCadastrarEditarAtivo" :titulo="tituloFormulario">
    <template #body>
        <div class="columns">
            <div class="column">
            </div>
            <div class="column">
            </div>
        </div>
    </template>
    <template #footer>

    </template>
</ModalCard> -->

<!-- <PopUpConfirmation :ispopUpConfirmationAtivo="ispopUpConfirmationAtivo" :titlePopUpConfirmation="'Deseja alterar os dados conforme abaixo?'">
    <template #body>
        <div class="columns is-vcentered is-gapless">
            <div class="column">
                <table class="table is-bordered mt-3 is-fullwidth">
                    <tbody class="has-text-centered">
                        <tr>
                            <td class="td-title">Id</td>
                            <td class="td-data">{{ modalPedido.idPedido }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Nome</td>
                            <td class="td-data">{{ modalPedido.nome }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Tipo</td>
                            <td class="td-data">{{ modalPedido.tipo }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">CNPJ</td>
                            <td class="td-data">{{ modalPedido.cnpj }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">E-mail</td>
                            <td class="td-data">{{ modalPedido.email }}</td>
                        </tr>
                    </tbody>
                </table>
            </div> 
            <div class="column">
                <table class="table is-bordered mt-3 is-fullwidth">
                    <tbody class="has-text-centered">
                        <tr>
                            <td class="td-title">Telefone</td>
                            <td class="td-data">{{ modalPedido.telefone }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Endereço</td>
                            <td class="td-data">{{ modalPedido.endereco }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Bairro</td>
                            <td class="td-data">{{ modalPedido.bairro }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Cidade</td>
                            <td class="td-data">{{ modalPedido.cidade }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">UF</td>
                            <td class="td-data">{{ modalPedido.uf }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </template>
    <template #footer>
        <div class="is-flex is-justify-content-center">
            <div class="control">
                <button @click="alterarRegistro" class="button has-background-success-dark has-text-light mr-3">Alterar</button>
            </div>
            <div class="control">
                <button @click="ispopUpConfirmationAtivo = false" class="button is-warning">Cancelar</button>
            </div>
        </div>
    </template>
</PopUpConfirmation> -->

</template>

