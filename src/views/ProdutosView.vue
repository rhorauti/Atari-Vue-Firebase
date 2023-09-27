<script setup>

import { db } from '@/firebase';
import { storage } from '@/firebase'
import { ref as firebaseRef, getDownloadURL, uploadBytes } from 'firebase/storage'
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { onMounted, ref, watch } from 'vue';
import { priceRS, formatarDataBr } from '../modules'
import ModalCard from '@/components/ModalCard.vue';
import { Confirm, Loading, Notify } from 'notiflix';
import FileUpload from '@/components/FileUpload.vue';

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

const modalProduto = ref({
    idProd: '',
    cadastro: '',
    nome: '',
    cc: '',
    ncm: '',
    unidade: '',
    preco: '',
    fileUpload: '',
    fileUploadName: '',
    fileDownloadUrl: '',
    comentario: ''
})

const fileUploadUrlClear = ref('');

const selectCentroCustoValue = ref(['CC 1', 'CC 2']);
const selectNcmValue = ref(['NCM 1', 'NCM 2']);
const selectUnidadeValue = ref(['PC', 'L'])

watch(colsVisible, (n) => {
    window.localStorage.setItem(colsVisibleStorage, JSON.stringify(n));
});

function atualizarDadosHome() {
    Loading.pulse();
    dadosTabelaHome.value = [];
    getDocs(collection(db, 'produtos-compras')).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dataResult = doc.data();
            dataResult.id = doc.id;
            dadosTabelaHome.value.push(dataResult);
        })
    }).finally(() => {
        Loading.remove();
    })
}

onMounted(() => {
    colsVisible.value = (window.localStorage.getItem(colsVisibleStorage)) ? JSON.parse(window.localStorage.getItem(colsVisibleStorage)) : cols;
    atualizarDadosHome();
});

function pesquisarItensTabelaHome() {
    atualizarDadosHome();
}

const mostrarFiltroLateral = ref(true);
const isModalProdutoAtivo = ref(false);
const tituloFormulario = ref('');
const mostrarBtnAdicionar = ref(true);

function abrirModalProduto() {
    modalProduto.value = {};
    fileUploadUrlClear.value = '/img/sem-imagem.png';
    tituloFormulario.value = 'Cadastrar Novo Produto';
    isModalProdutoAtivo.value = true;    
}

function ReceberEmitFileUpload(fileUpload) {
    modalProduto.value.fileUpload = fileUpload;
}

function ReceberEmitFileUploadName(fileUploadName) {
    modalProduto.value.fileUploadName = fileUploadName;
}

const filtroPesquisa = ref({
    inputNomeProduto: '',
    inputCadastroDe: '',
    inputCadastroAte: '',
    inputIdProduto: '',
    selectCentroCusto: '',
    selectNcm: ''
})

function limparModal() {
    modalProduto.value = {};
}

function cancelarModal() {
    isModalProdutoAtivo.value = false;
}

function adicionarRegistro() {
    Loading.pulse();
    const nomeExiste = dadosTabelaHome.value.some((d) => {
        return modalProduto.value.nome.toLowerCase() == d.nome.toLowerCase()
    });
    if(nomeExiste) {
        Notify.failure('Nome já existente!')
        Loading.remove();
        return;
    } else {
        const docIndice = doc(db, 'indices', 'produto-compra');
        getDoc(docIndice).then((d) => {
            let idProduto = d.data().ultimo;
            idProduto++;
            setDoc(docIndice, {ultimo: idProduto});
              // upload image - firebase storage
            if(modalProduto.value.fileUploadName == 'sem-imagem.png' || modalProduto.value.fileUploadName == '') {
                modalProduto.value.fileUpload = '';
            } else {
                const imageRef = firebaseRef(storage, `produtos-compras/${idProduto}`)
                uploadBytes(imageRef, modalProduto.value.fileUpload);
                modalProduto.value.fileUpload = '';
            }
            // adicionar registros no firestore
            setDoc(doc(db, 'produtos-compras', idProduto.toString()), {
                cadastro: String(new Date()),
                nome: modalProduto.value.nome ?? "",
                cc: modalProduto.value.cc ?? "",
                ncm: modalProduto.value.ncm ?? "",
                unidade: modalProduto.value.unidade ?? "",
                preco: modalProduto.value.preco ?? ""
            }).then(() => {
                dadosTabelaHome.value = {};
                filtroPesquisa.value = {};
                atualizarDadosHome();
                isModalProdutoAtivo.value = false;
                Notify.success("Registro inserido com sucesso!");
            }).catch(() => {
                Notify.danger("Falha ao registrar o produto")
            }).finally(() => {
                Loading.remove();
            })
        })
    }
}

function excluirRegistro(produto) {
    Confirm.show(
        "Confirmação de exclusão",
        `Deseja excluir o produto <b>${produto.nome}</b>?`,
        "Sim",
        "Cancelar",
        () => {
            Loading.pulse();
            const docRef = doc(db, 'produtos-compras', produto.id);
            deleteDoc(docRef).then(() => {
                atualizarDadosHome();
                Loading.remove();
                Notify.success("Registro excluido com sucesso!");
            }).catch(() => {
                Notify.failure('Erro ao excluir o registro!')
            }).finally(() => {
                Loading.remove();
            });
        }
    )
}

function abrirModalAlterar(produto) {
    Loading.pulse();
    limparFileDownload();
    getDownloadURL(firebaseRef(storage, `/produtos-compras/${String(produto.id)}`)).then((url) => {
            modalProduto.value.fileDownloadUrl = url;
            console.log(modalProduto.value.fileDownloadUrl)
    }).finally(() => {
        tituloFormulario.value = "Alterar Dados do Produto";
        mostrarBtnAdicionar.value = false
        modalProduto.value.idProd = produto.id;
        modalProduto.value.nome = produto.nome;
        modalProduto.value.cadastro = produto.cadastro;
        modalProduto.value.cc = produto.cc;
        modalProduto.value.ncm = produto.ncm;
        modalProduto.value.unidade = produto.unidade;
        modalProduto.value.preco = produto.preco;
        modalProduto.value.comentario = produto.comentario;
        isModalProdutoAtivo.value = true;
        Loading.remove();
    })
}

function limparFileDownload() {
    modalProduto.value.fileUpload = '';
    modalProduto.value.fileUploadName = '';
    modalProduto.value.fileDownloadUrl = '';
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

.tabs ul {
    border-bottom-width: 0px;
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
                        <button class="button is-info is-fullwidth is-rounded" @click="pesquisarItensTabelaHome()">
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
                        <input type="text" v-model="filtroPesquisa.inputIdProduto" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label class="has-text-light">Nome: </label>
                    <div class="control mt-1">
                        <input type="text" v-model="filtroPesquisa.inputNomeProduto" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">Cadastro de</label>
                    <div class="control mt-1">
                        <input type="date" v-model="filtroPesquisa.inputCadastroDe" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">Cadastro até</label>
                    <div class="control mt-1">
                        <input type="date" v-model="filtroPesquisa.inputCadastroAte" class="input">
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">Centro de Custo</label>
                    <div class="control mt-1">
                        <select name="" id="" v-model="filtroPesquisa.selectCentroCusto" class="select p-2" style="font-size: 1rem; width: 100%;">
                            <option value="">Centro Custo 1</option>
                        </select>
                    </div>
                </div>
                <div class="field mx-1">
                    <label for="" class="has-text-light">NCM</label>
                    <div class="control mt-1">
                        <select name="" id="" v-model="filtroPesquisa.selectNcm" class="select p-2" style="font-size: 1rem; width: 100%;">
                            <option value="">NCM 1</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="column mt-0" style="border: 1px solid #fff; border-radius: 0 0.5rem 0.5rem 0;">
                <div class="level mb-3">
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-light is-outlined is-rounded" @click="mostrarFiltroLateral = !mostrarFiltroLateral">
                            <span class="icon">
                                <font-awesome-icon :icon="(!mostrarFiltroLateral) ? ['fas', 'eye-slash'] : ['fas', 'eye']"/>
                            </span>
                            <span>Filtros</span>
                        </button>
                    </div>
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-light is-outlined is-rounded" @click="filtroPesquisa = {}">
                            <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                            <span>Limpar</span> 
                        </button>
                    </div>
                    <div class="level-item mx-1">
                        <button class="button is-fullwidth is-light is-outlined is-rounded" @click="colsVisibleSelector=!colsVisibleSelector">
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
                        <button class="button is-fullwidth is-info is-rounded" @click="abrirModalProduto()">
                            <span class="icon">
                                <font-awesome-icon :icon="['fa', 'fa-floppy-disk']"/>
                            </span>
                            <span>Produto</span> 
                        </button>
                    </div>
                </div>

                <div style="overflow: scroll; height: 88vh;" class="mx-1">
                    <table class="table is-narrow is-bordered is-hoverable is-fullwidth">
                        <thead style="position: sticky; top: -0.5px; z-index: 2;">
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
                                            <button class="button is-warning btn-tabela" @click="abrirModalAlterar(produto)">
                                                <font-awesome-icon :icon="['fas', 'pen']"/>
                                            </button>                                                                                 
                                        </p>
                                        <p class="control">
                                            <button class="button is-danger btn-tabela" @click="excluirRegistro(produto)">
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
    </div>
</div>

<ModalCard :is-ativo="isModalProdutoAtivo" :titulo="tituloFormulario" class="has-text-left">
    <template #body>
        <div class="mt-2">
            <div class="columns">
                <FileUpload @fileUpload="ReceberEmitFileUpload($event)" 
                            @fileUploadName="ReceberEmitFileUploadName($event)"
                            @limparArquivoDownload="limparFileDownload()"
                            :fileDownloadUrl="modalProduto.fileDownloadUrl"
                            :fileUploadUrlClear="fileUploadUrlClear">
                </FileUpload>
                <div class="column box mx-2 mb-2">
                    <textarea class="textarea" placeholder="Comentários do produto" v-model="modalProduto.comentario" style="height: 100%; margin-top: 0;"></textarea>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <div class="field">
                        <label for="" class="label">IdProd</label>
                        <div class="control">
                            <input type="text" v-model="modalProduto.idProd" class="input has-background-white" :disabled="true">
                        </div>
                    </div>
                    <div class="field" hidden>
                        <label for="" class="label">Cadastro</label>
                        <div class="control">
                            <input type="text" v-model="modalProduto.cadastro" class="input">
                        </div>
                    </div>
                    <div class="field">
                        <label for="" class="label">Nome</label>
                        <div class="control">
                            <input type="text" v-model="modalProduto.nome" class="input">
                        </div>
                    </div>
                    <div class="field">
                        <label for="" class="label">Centro de custo</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select name="" id="" v-model="modalProduto.cc">
                                    <option v-for="cc, indexCc in selectCentroCustoValue" :key="indexCc">{{ cc }}</option>
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
                                <select name="" id="" v-model="modalProduto.ncm">
                                    <option v-for="ncm, indexNcm in selectNcmValue" :key="indexNcm">{{ ncm }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="" class="label">Unidade</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select name="" id="" v-model="modalProduto.unidade">
                                    <option v-for="unidade, indexUnidade in selectUnidadeValue" :key="indexUnidade">{{ unidade }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="" class="label">Preço</label>
                        <div class="control">
                            <input type="text" class="input" v-model="modalProduto.preco">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template #footer>
        <button v-if="mostrarBtnAdicionar" class="button is-success is-rounded" @click="adicionarRegistro()">
            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
            <span>Adicionar</span>
        </button>
        <button v-else class="button is-success is-rounded">
            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
            <span>Editar</span>
        </button>
        <button class="button is-dark is-outlined is-rounded" @click="limparModal()">
            <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
            <span>Limpar</span> 
        </button>
        <button class="button is-danger is-rounded" @click="cancelarModal()">
            <span class="icon"><font-awesome-icon :icon="['fa', 'ban']" /></span>
            <span>Cancelar</span>
        </button>
    </template>
</ModalCard>

</template>