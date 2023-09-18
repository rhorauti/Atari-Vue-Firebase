<script setup>

import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted, ref, watch } from 'vue';
import { priceRS, formatarDataBr } from '../modules'
import ModalCard from '@/components/ModalCard.vue';

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

const mostrarFiltroLateral = ref(true);

const isModalProdutoAtivo = ref(false);

function abrirModalProduto() {
    isModalProdutoAtivo.value = true;
}

</script>

<style scoped>

.container-principal {
    position: relative;
    top: 3.6rem;
    margin: 0 2rem;
}

li {
    margin: 0.4rem 0;
}

ul {
    border-bottom: none;
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

.icon-delete {
    position: absolute;
    right: 0.2rem;
    cursor: pointer;
    color: red;
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
        <div class="columns mt-1">
            <div v-show="mostrarFiltroLateral" class="column mt-0 is-2 has-text-centered" style="overflow-y: scroll;border: 1px solid #fff; border-radius: 0.5rem 0 0 0.5rem;">
                <div class="field mx-2">
                    <div class="control mb-3">
                        <button class="button is-info is-fullwidth">
                            <span class="icon">
                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="mr-1"/>
                            </span>
                            <span>Pesquisar</span> 
                        </button>
                    </div>
                </div>
                <div class="field mx-1">
                    <label class="has-text-light">IdProd: </label>
                    <div class="control mt-1">
                        <input type="text" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label class="has-text-light">Nome: </label>
                    <div class="control mt-1">
                        <input type="text" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">Cadastro de</label>
                    <div class="control mt-1">
                        <input type="date" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">Cadastro até</label>
                    <div class="control mt-1">
                        <input type="date" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">Centro de Custo</label>
                    <div class="control mt-1">
                        <select name="" id="" class="select p-2" style="font-size: 1rem; width: 100%;">
                            <option value="">Centro Custo 1</option>
                        </select>
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">NCM</label>
                    <div class="control mt-1">
                        <select name="" id="" class="select p-2" style="font-size: 1rem; width: 100%;">
                            <option value="">NCM 1</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="column mt-0" style="border: 1px solid #fff; border-radius: 0 0.5rem 0.5rem 0;">
                <div class="level mb-3">
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-light is-outlined" @click="mostrarFiltroLateral = !mostrarFiltroLateral">
                            <span class="icon">
                                <font-awesome-icon :icon="(!mostrarFiltroLateral) ? ['fas', 'eye-slash'] : ['fas', 'eye']"/>
                            </span>
                            <span>Filtros</span>
                        </button>
                    </div>
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-light is-outlined">
                            <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                            <span>Limpar</span> 
                        </button>
                    </div>
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-light is-outlined" @click="colsVisibleSelector=!colsVisibleSelector">
                            <span class="icon"><font-awesome-icon :icon="['fas', 'eye']"/></span>
                            <span>Colunas</span>
                        </button>
                        <div class="is-hidden-mobile" style="position: absolute; display: flex; flex-direction: column; top: 0.5rem; right: 31.2rem; z-index: 100; border: 1px solid #777; padding: 1.2rem; border-radius: 1rem; background-color: #fff; width: 8rem;" v-show="colsVisibleSelector">
                            <label class="checkbox has-text-dark has-text-left" v-for="col, colunasid in cols" :key="colunasid">
                                <input class="mr-2" type="checkbox" :value="col" v-model="colsVisible" :disabled="col=='IdProd' || col=='Nome'"/>{{ col }}
                            </label>
                        </div>
                    </div>
                    <div class="mx-1 is-hidden-desktop mb-3">
                        <div class="box has-text-centered" v-show="colsVisibleSelector" style="width: 100%;">
                            <label class="checkbox has-text-dark has-text-left mr-3" v-for="col, colunasid in cols" :key="colunasid">
                                <input class="mr-1" type="checkbox" :value="col" v-model="colsVisible" :disabled="col=='IdProd' || col=='Nome'"/>{{ col }}
                            </label>
                        </div>
                    </div>
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-info" @click="abrirModalProduto()">
                            <span class="icon">
                                <font-awesome-icon :icon="['fa', 'fa-floppy-disk']"/>
                            </span>
                            <span>Produto</span> 
                        </button>
                    </div>
                </div>

                <div style="overflow: scroll; height: 88vh;" class="mx-1">
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

                                <ModalCard :is-ativo="isModalProdutoAtivo" titulo="Cadastrar Novo Produto" class="has-text-left">
                                    <template #body>
                                        <div class="mt-2">
                                            <div class="columns">
                                                <div class="box column is-3 mx-2 mb-2" style="position: relative;">
                                                    <span class="icon-delete icon">
                                                        <font-awesome-icon :icon="['fa', 'fa-trash']" />
                                                    </span>
                                                    <figure class="image is-96x96 mx-auto mb-2">
                                                        <img src="../img/logo.png" alt="">
                                                    </figure>
                                                    <div class="file">
                                                        <label class="file-label" style="width: 100%;">
                                                            <input class="file-input" type="file" name="resume">
                                                            <span class="file-cta button is-info" style="width: 100%;">
                                                            <span class="file-icon">
                                                                <font-awesome-icon :icon="['fa', 'file-arrow-up']" />
                                                            </span>
                                                                <span class="file-label mx-auto">Update</span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="column box mx-2 mb-2">
                                                    <textarea class="textarea mt-2" placeholder="Comentários do produto"></textarea>
                                                </div>
                                            </div>
                                            <div class="columns">
                                                <div class="column">
                                                    <div class="field">
                                                        <label for="" class="label">IdProd</label>
                                                        <div class="control">
                                                            <input type="text" class="input">
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <label for="" class="label">Cadastro</label>
                                                        <div class="control">
                                                            <input type="text" class="input">
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <label for="" class="label">Nome</label>
                                                        <div class="control">
                                                            <input type="text" class="input">
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <label for="" class="label">Centro de custo</label>
                                                        <div class="control">
                                                            <div class="select is-fullwidth">
                                                                <select name="" id="">
                                                                    <option value="">Centro de custo 1</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="column">
                                                    <div class="field">
                                                        <label for="" class="label">Ncm</label>
                                                        <div class="control">
                                                            <div class="select is-fullwidth">
                                                                <select name="" id="">
                                                                    <option value="">NCM 1</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <label for="" class="label">Unidade</label>
                                                        <div class="control">
                                                            <div class="select is-fullwidth">
                                                                <select name="" id="">
                                                                    <option value="">PC</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <label for="" class="label">Preço</label>
                                                        <div class="control">
                                                            <input type="text" class="input">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <button class="button is-success">
                                            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                                            <span>Adicionar</span>
                                        </button>
                                        <button class="button is-dark is-outlined">
                                            <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                                            <span>Limpar</span> 
                                        </button>
                                        <button class="button is-danger" @click="isModalProdutoAtivo = false">
                                            <span class="icon"><font-awesome-icon :icon="['fa', 'ban']" /></span>
                                            <span>Cancelar</span>
                                        </button>
                                    </template>
                                </ModalCard>

                            </tr>
                        </tbody>
                    </table> 
                </div>
            </div>
        </div>
    </div>
</div>

</template>