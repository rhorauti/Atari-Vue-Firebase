<script setup>

import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted, ref, watch } from 'vue';
import { priceRS, formatarDataBr } from '../modules'

const categoriaSelecionada = ref('');

const dadosTabelaHome = ref([]);

const cols = [
    "IdProd", 
    "Cadastro",
    "Nome", 
    "CC", 
    "NCM", 
    "Preço", 
    "Unidade", 
    "Ação"
];

const colsVisibleStorage = "R0LkbqL2WdcMf8TnL9";
const colsVisible = ref([]);
const colsVisibleSelector = ref(false);

watch(colsVisible, (n) => {
    window.localStorage.setItem(colsVisibleStorage, JSON.stringify(n));
});

function atualizarDadosHome() {
    dadosTabelaHome.value = [];
    const query = getDocs(collection(db, 'produtos-compras'));
    query.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dataResult = doc.data();
            dataResult.id = doc.id;
            dadosTabelaHome.value.push(dataResult);
        })
    })
}

onMounted(() => {
    // Carrega os dados dos clientes na tabela Home
    atualizarDadosHome();
    colsVisible.value = (window.localStorage.getItem(colsVisibleStorage)) ? JSON.parse(window.localStorage.getItem(colsVisibleStorage)) : cols;
});

</script>

<style scoped>

.container-principal {
    position: relative;
    top: 3.6rem;
    margin: 0 2rem;
    height: 100vh;
}

li {
    margin: 0.4rem 0;
}

li.is-active {
    color: #fff;
    border: 1px solid #fff;
    border-left: 4px solid #fff;
    border-radius: 0.5rem;
    font-weight: 500;
    margin: 0.4rem 0;
}

.tabs a {
    border-bottom-style: none;
}

.field.is-grouped {
    justify-content: center;
}

fieldset {
    border: 1px solid #fff;
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

legend {
    color: white;
    padding: 0.5rem;
}


</style>

<template>

<div class="container-principal">
    <div class="tabs is-centered mb-1">
        <ul>
            <li :class="{'is-active': categoriaSelecionada == 'PRODUTOS_COMPRA'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'PRODUTOS_COMPRA'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Cadastro de produtos comprados</span>
                </a>
            </li>
            <li :class="{'is-active': categoriaSelecionada == 'PRODUTOS_VENDA'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'PRODUTOS_VENDA'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Cadastro de produtos vendidos</span>
                </a>
            </li>
        </ul>
    </div>

    <div v-if="categoriaSelecionada == 'PRODUTOS_COMPRA'">
        <div class="mb-4">
            <div class="level">
                <div class="level-item has-text-centered">
                    <fieldset style="width: 100%; padding: 1.1rem; margin-right: 0.5rem;">
                        <legend>Filtros de pesquisa</legend>
                        <div class="level-item" style="position: relative; top: -0.8rem;">
                            <div class="level">
                                <div class="level-item mr-1">
                                    <div class="field">
                                        <label class="label has-text-light">Nome: </label>
                                        <div class="control">
                                            <input type="text" class="input">
                                        </div>
                                    </div>
                                </div>
                                <div class="level-item mx-1">
                                    <div class="field">
                                        <label for="" class="label has-text-light is-fullwidth">Cadastro de</label>
                                        <div class="control">
                                            <input type="date" class="input">
                                        </div>
                                    </div>
                                </div>
                                <div class="level-item mx-1">
                                    <div class="field">
                                        <label for="" class="label has-text-light">Cadastro até</label>
                                        <div class="control">
                                            <input type="date" class="input">
                                        </div>
                                    </div>
                                </div>
                                <div class="level-item mx-1">
                                    <div class="field">
                                        <label for="" class="label has-text-light">Centro de Custo</label>
                                        <div class="control">
                                            <select name="" id="" class="select p-2" style="font-size: 1rem; width: 100%;">
                                                <option value="">Centro Custo 1</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="level-item mx-1 is-align-self-flex-end">
                                    <div class="field">
                                        <div class="control">
                                            <button class="button is-info has-text-weight-bold">
                                                <span class="icon">
                                                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="mr-1"/>
                                                </span>
                                                <span>Pesquisar</span> 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="level-item ml-1 is-align-self-flex-end">
                                    <div class="field">
                                        <div class="control">
                                            <button class="button is-light is-outlined">
                                                <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                                                <span>Limpar</span> 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="level-item has-text-centered">
                    <fieldset style="width: 100%;">
                        <legend>Tabela</legend>
                        <div class="field">
                            <div class="control">
                                <button class="button is-light is-outlined" @click="colsVisibleSelector=!colsVisibleSelector">
                                    <span class="icon"><font-awesome-icon :icon="['fas', 'eye']"/></span>
                                    <span>Colunas</span>
                                </button>
                                <div class="is-hidden-mobile" style="position: absolute; display: flex; flex-direction: column; top: -4rem; z-index: 100; border: 1px solid #777; padding: 1.2rem; border-radius: 1rem; background-color: #fff; right: 8.2rem; width: 8rem;" v-show="colsVisibleSelector">
                                    <label class="checkbox has-text-dark has-text-left" v-for="col, colunasid in cols" :key="colunasid">
                                        <input class="mr-2" type="checkbox" :value="col" v-model="colsVisible" :disabled="col=='IdProd' || col=='Nome'"/>{{ col }}
                                    </label>
                                </div>
                                <div class="is-hidden-desktop" style="position: absolute; display: flex; flex-direction: column; top: -4rem; z-index: 100; border: 1px solid #777; padding: 1.2rem; border-radius: 1rem; background-color: #fff; right: 12.2rem; width: 8rem;" v-show="colsVisibleSelector">
                                    <label class="checkbox has-text-dark has-text-left" v-for="col, colunasid in cols" :key="colunasid">
                                        <input class="mr-2" type="checkbox" :value="col" v-model="colsVisible" :disabled="col=='IdProd' || col=='Nome'"/>{{ col }}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-info has-text-weight-bold">
                                    <span class="icon">
                                        <font-awesome-icon :icon="['fa', 'fa-floppy-disk']" class="mr-1"/>
                                    </span>
                                    <span>Produto</span> 
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>  
        </div>

        <div style="max-height: calc(100vh - 10rem); overflow: scroll;">
            <table class="table is-narrow is-bordered is-hoverable is-fullwidth">
                <thead style="position: sticky; top: 0; z-index: 2;">
                    <tr>
                        <th class="has-text-centered has-background-dark has-text-light"
                        v-for="col, idcoluna in cols" v-show="colsVisible.indexOf(col) >=0" :key="idcoluna">{{ col }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="produto in dadosTabelaHome.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)" :key="produto.id"
                        class="has-text-centered is-vcentered">
                        <td class="is-vcentered" v-show="colsVisible.indexOf('IdProd') >= 0">{{ produto.id }}</td>
                        <td class="is-vcentered" v-show="colsVisible.indexOf('Cadastro') >= 0">{{ formatarDataBr(produto.cadastro) }} </td>
                        <td style="white-space: nowrap;" class="is-vcentered" v-show="colsVisible.indexOf('Nome') >= 0">{{ produto.nome }}</td>
                        <td class="is-vcentered" v-show="colsVisible.indexOf('CC') >= 0">{{ produto.cc }}</td>
                        <td class="is-vcentered" v-show="colsVisible.indexOf('NCM') >= 0">{{ produto.ncm }}</td>
                        <td class="is-vcentered" v-show="colsVisible.indexOf('Preço') >= 0">{{ priceRS(produto.preco) }}</td>
                        <td class="is-vcentered" v-show="colsVisible.indexOf('Unidade') >= 0">{{ produto.unidade }}</td>
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
        </div>
    </div>
</div>

</template>