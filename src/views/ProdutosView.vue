<script setup>

import { db } from '@/firebase';
import { storage } from '@/firebase'
import { deleteObject, ref as firebaseRef, getDownloadURL, uploadBytes } from 'firebase/storage'
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { computed, onMounted, ref, watch } from 'vue';
import { priceRS, formatarDataBr } from '../modules'
import ModalCard from '@/components/ModalCard.vue';
import { Confirm, Loading, Notify } from 'notiflix';
import FileUpload from '@/components/FileUpload.vue';
import PopUpConfirmation from '@/components/PopUpConfirmation.vue';

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
    fileUploadType: '',
    fileDownloadUrl: '',
    comentario: ''
})

const colsVisibleStorageProdCompras = "R0LkbqL2WdcMf8TnL9";
// const colsVisibleStorageProdVendas = "R0LkbqL2WdcMf8TnL10";
const colsVisibleProdCompras = ref([]);
// const colsVisibleProdVendas = ref([]);
const colsVisibleSelector = ref(false);

const selectCentroCustoValue = ref(['CC 1', 'CC 2']);
const selectNcmValue = ref(['NCM 1', 'NCM 2']);
const selectUnidadeValue = ref(['PC', 'L'])

watch(colsVisibleProdCompras, (n) => {
    window.localStorage.setItem(colsVisibleStorageProdCompras, JSON.stringify(n));
});

// watch(colsVisibleProdVendas, (n) => {
//     window.localStorage.setItem(colsVisibleStorageProdVendas, JSON.stringify(n));
// });

function atualizarDadosHome() {
    dadosTabelaHome.value = [];
    // if(categoriaSelecionada.value == 'PRODUTOS_COMPRA') {
        Loading.pulse();
        getDocs(collection(db, 'produtos-compras')).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const dataResult = doc.data();
                dataResult.id = doc.id;
                dadosTabelaHome.value.push(dataResult);
            })
        }).finally(() => {
            Loading.remove();
        })
    // } else {
    //     Loading.pulse();
    //     getDocs(collection(db, 'produtos-vendas')).then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             const dataResult = doc.data();
    //             dataResult.id = doc.id;
    //             dadosTabelaHome.value.push(dataResult);
    //         })
    //     }).finally(() => {
    //         Loading.remove();
    //     })
    // }   
}

onMounted(() => {
    // if(categoriaSelecionada.value == 'PRODUTOS_COMPRA') {
        colsVisibleProdCompras.value = (window.localStorage.getItem(colsVisibleStorageProdCompras)) ? JSON.parse(window.localStorage.getItem(colsVisibleStorageProdCompras)) : cols;
    // } else {
    //     colsVisibleProdVendas.value = (window.localStorage.getItem(colsVisibleStorageProdVendas)) ? JSON.parse(window.localStorage.getItem(colsVisibleStorageProdVendas)) : cols;
    // }
    atualizarDadosHome();
});

const filtroPesquisa = ref({
    inputNomeProduto: '',
    inputCadastroDe: '',
    inputCadastroAte: '',
    inputIdProduto: '',
    selectCentroCusto: '',
    selectNcm: ''
})

function limparPesquisa() {
    filtroPesquisa.value.inputNomeProduto = '';
    filtroPesquisa.value.inputCadastroDe = '';
    filtroPesquisa.value.inputCadastroAte = '';
    filtroPesquisa.value.inputIdProduto = '';
    filtroPesquisa.value.selectCentroCusto = '';
    filtroPesquisa.value.selectNcm = '';
}

const dataInicial = computed(() => {
    if(filtroPesquisa.value.inputCadastroDe == '' || filtroPesquisa.value.inputCadastroDe == null || filtroPesquisa.value.inputCadastroDe == undefined) {
        return '2023-09-01T00:00:00';
    } else {
        return filtroPesquisa.value.inputCadastroDe + 'T00:00:00';
    }
})

const dataFinal = computed(() => {
    if(filtroPesquisa.value.inputCadastroAte == '' || filtroPesquisa.value.inputCadastroAte == null || filtroPesquisa.value.inputCadastroAte == undefined) {
        console.log(new Date().toString())
        return new Date().toString();
    } else {
        return filtroPesquisa.value.inputCadastroAte + 'T23:59:59';
    }
})


// const dataFinal = computed(() => {
//     if(filtroPesquisa.value.inputCadastroAte == '' || filtroPesquisa.value.inputCadastroAte == null || filtroPesquisa.value.inputCadastroAte == undefined) {
//         return '2023-10-05';
//     } else {
//         return filtroPesquisa.value.inputCadastroAte;
//     }
// })

const resultadoFiltroPesquisa = computed(() => {
    if (filtroPesquisa.value.inputNomeProduto == '' && filtroPesquisa.value.inputIdProduto == '' && filtroPesquisa.value.inputCadastroDe == '' && filtroPesquisa.value.inputCadastroAte == '' && filtroPesquisa.value.selectCentroCusto == '' && filtroPesquisa.value.selectNcm == '') {
        return dadosTabelaHome.value;
    } else {
        return dadosTabelaHome.value.filter((dado) => filtroPesquisa.value.inputNomeProduto.trim().replace('  ', ' ').split(' ').every((palavraChave) => (dado.nome.toLowerCase().includes(palavraChave.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()))) && filtroPesquisa.value.inputIdProduto.trim().replace('  ', ' ').split(' ').every((palavraChave) => (dado.id.includes(palavraChave))) && new Date(dataInicial.value) <= new Date(dado.cadastro) && new Date(dataFinal.value) >= new Date(dado.cadastro));
    }
})

const mostrarFiltroLateral = ref(true);
const isModalProdutoAtivo = ref(false);
const tituloFormulario = ref('');
const mostrarBtnAdicionar = ref(true);

const indexFileUpdate = ref(0)

function abrirModalProduto() {
    indexFileUpdate.value++;
    mostrarBtnAdicionar.value = true;
    modalProduto.value = {};
    tituloFormulario.value = 'Cadastrar Novo Produto';
    isModalProdutoAtivo.value = true;    
}

function ReceberEmitFileUpload(fileUpload) {
    modalProduto.value.fileUpload = fileUpload;
}

function ReceberEmitFileUploadName(fileUploadName) {
    modalProduto.value.fileUploadName = fileUploadName;
}

function ReceberEmitFileUploadType(fileUploadType) {
    modalProduto.value.fileUploadType = fileUploadType;
}

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
                const metadata = {contentType: modalProduto.value.fileUploadType, name: modalProduto.value.fileUploadName};
                uploadBytes(firebaseRef(storage, `produtos-compras/${idProduto}`), modalProduto.value.fileUpload, metadata);
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
                limparPesquisa();
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
            deleteObject(firebaseRef(storage, `produtos-compras/${produto.id}`))
            deleteDoc(doc(db, 'produtos-compras', produto.id)).then(() => {
                atualizarDadosHome();
                Notify.success("Registro excluido com sucesso!");
            }).catch(() => {
                Notify.failure('Erro ao excluir o registro!')
            }).finally(() => {
                Loading.remove();
            })
        }
    )
}

function abrirModalAlterar(produto) {
    Loading.pulse();
    indexFileUpdate.value++;
    limparFileDownload();
    getDownloadURL(firebaseRef(storage, `/produtos-compras/${String(produto.id)}`)).then((url) => {
        modalProduto.value.fileDownloadUrl = url;
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

const ispopUpConfirmationAtivo = ref(false);

function alterarRegistro() {
    Loading.pulse();
    // const metadata = {contentType: modalProduto.value.fileUploadType, name: modalProduto.value.fileUploadName};
    uploadBytes(firebaseRef(storage, `produtos-compras/${modalProduto.value.idProd}`), modalProduto.value.fileUpload);
    modalProduto.value.fileUpload = '';
    const nomeExiste = dadosTabelaHome.value.some((d) => {
    if(modalProduto.value.idProd != d.id) {
        return modalProduto.value.nome.toLowerCase() == d.nome.toLowerCase()
    }
    });
    if(nomeExiste) {
        Notify.failure('Nome já existente!')
        Loading.remove();
        return;
    } else {
        setDoc(doc(db, 'produtos-compras', modalProduto.value.idProd.toString()), {
                cadastro: String(new Date()),
                nome: modalProduto.value.nome ?? "",
                cc: modalProduto.value.cc ?? "",
                ncm: modalProduto.value.ncm ?? "",
                unidade: modalProduto.value.unidade ?? "",
                preco: modalProduto.value.preco ?? ""
            }).then(() => {
                limparPesquisa();
                atualizarDadosHome();
                isModalProdutoAtivo.value = false;
                ispopUpConfirmationAtivo.value = false;
                Notify.success("Registro alterado com sucesso!");
            }).catch(() => {
                Notify.danger("Falha ao alterar o produto")
            }).finally(() => {
                Loading.remove();
            })
        }
}



function limparFileDownload() {
    modalProduto.value.fileUpload = '';
    modalProduto.value.fileUploadName = '';
    modalProduto.value.fileDownloadUrl = '';
}

const fotoProduto = ref('');

function mostrarFotoProduto(dados) {
    fotoProduto.value = dados;
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

.td-title {
    width: 30%;
}

.td-data {
    width: 70%;
}


</style>

<template>

<div class="container-principal">
    <div class="tabs is-centered mb-1">
        <ul>
            <li :class="{'is-active': categoriaSelecionada == 'PRODUTOS_COMPRA'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'PRODUTOS_COMPRA'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Produtos comprados</span>
                </a>
            </li>
            <li :class="{'is-active': categoriaSelecionada == 'PRODUTOS_VENDA'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'PRODUTOS_VENDA'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Produtos vendidos</span>
                </a>
            </li>
        </ul>
    </div>

    <div v-if="categoriaSelecionada == 'PRODUTOS_COMPRA' || categoriaSelecionada == 'PRODUTOS_VENDA'">
        <div class="columns mt-1">
            <div v-show="mostrarFiltroLateral" class="column mt-0 is-2 has-text-centered" style="overflow-y: scroll;border: 1px solid #fff; border-radius: 0.5rem 0 0 0.5rem;">
                <!-- <div class="field mx-2">
                    <div class="control mb-3">
                        <button class="button is-info is-fullwidth is-rounded" @click="pesquisarItensTabelaHome()">
                            <span class="icon">
                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="mr-1"/>
                            </span>
                            <span>Pesquisar</span> 
                        </button>
                    </div>
                </div> -->
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
                        <button class="button is-fullwidth is-light is-outlined is-rounded" @click="limparPesquisa()">
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
                                <input class="mr-2" type="checkbox" :value="col" v-model="colsVisibleProdCompras" :disabled="col=='IdProd' || col=='Nome'"/>{{ col }}
                            </label>
                        </div>
                    </div>
                    <div class="mx-1 is-hidden-desktop mb-3">
                        <div class="box has-text-centered" v-show="colsVisibleSelector" style="width: 100%;">
                            <label class="checkbox has-text-dark has-text-left mr-3" v-for="col, colunasid in cols" :key="colunasid">
                                <input class="mr-1" type="checkbox" :value="col" v-model="colsVisibleProdCompras" :disabled="col=='IdProd' || col=='Nome'"/>{{ col }}
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
                                v-for="col, idcoluna in cols" v-show="colsVisibleProdCompras.indexOf(col) >=0" :key="idcoluna">{{ col }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="produto in resultadoFiltroPesquisa.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)" :key="produto.id"
                                class="has-text-centered is-vcentered">
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('IdProd') >= 0">{{ produto.id }}</td>
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('Cadastro') >= 0">{{ formatarDataBr(produto.cadastro) }} </td>
                                <td style="white-space: nowrap;" class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('Nome') >= 0">{{ produto.nome }}</td>
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('CC') >= 0">{{ produto.cc }}</td>
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('NCM') >= 0">{{ produto.ncm }}</td>
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('Preço') >= 0">{{ priceRS(produto.preco) }}</td>
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('Unidade') >= 0">{{ produto.unidade }}</td>
                                <td class="is-vcentered" v-show="colsVisibleProdCompras.indexOf('Ação') >= 0">
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
                            @fileUploadType="ReceberEmitFileUploadType($event)"
                            @limparArquivoDownload="limparFileDownload()"
                            @mostrarFotoProduto="mostrarFotoProduto($event)"
                            :fileDownloadUrl="modalProduto.fileDownloadUrl"
                            :key="indexFileUpdate">
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
        <button v-if="mostrarBtnAdicionar" class="button is-success is-rounded is-fullwidth" @click="adicionarRegistro()">
            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
            <span>Adicionar</span>
        </button>
        <button v-else class="button is-success is-rounded is-fullwidth" @click="ispopUpConfirmationAtivo = true">
            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
            <span>Alterar</span>
        </button>
        <button class="button is-dark is-outlined is-rounded is-fullwidth" @click="limparModal()">
            <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
            <span>Limpar</span> 
        </button>
        <button class="button is-danger is-rounded is-fullwidth" @click="cancelarModal()">
            <span class="icon"><font-awesome-icon :icon="['fa', 'ban']" /></span>
            <span>Cancelar</span>
        </button>
    </template>
</ModalCard>

<PopUpConfirmation :ispopUpConfirmationAtivo="ispopUpConfirmationAtivo" :titlePopUpConfirmation="'Deseja alterar os dados conforme abaixo?'">
    <template #body>
        <div class="box columns is-gapless mb-0 mt-3 mx-2 pb-1 pt-3">
            <figure class="column is-3 image is-128x128 is-align-items-center is-flex is-justify-content-center mb-2 mx-auto">
                <img :src="(!modalProduto.fileDownloadUrl && !fotoProduto) ? '/img/sem-imagem.png' : (modalProduto.fileDownloadUrl) ? modalProduto.fileDownloadUrl : fotoProduto" alt="" class="box mr-2" style="height: 100%;">
            </figure>
            <div class="column box mb-2">
                <textarea class="textarea has-background-white" v-model="modalProduto.comentario" :disabled="true"></textarea>
            </div>
        </div>
        <!--1a coluna da tabela-->
        <div class="columns is-gapless mt-3 mx-2">
            <div class="column">
                <table class="table is-bordered is-fullwidth">
                    <tbody class="has-text-centered">
                        <tr>
                            <td class="td-title">Id</td>
                            <td class="td-data">{{ modalProduto.idProd }}</td>
                        </tr>
                        <tr hidden>
                            <td class="td-title">Cadastro</td>
                            <td class="td-data">{{ modalProduto.cadastro }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Nome</td>
                            <td class="td-data">{{ modalProduto.nome }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">CC</td>
                            <td class="td-data">{{ modalProduto.cc }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="column">
                <table class="table is-bordered is-fullwidth">
                    <tbody class="has-text-centered">
                        <tr>
                            <td class="td-title">Ncm</td>
                            <td class="td-data">{{ modalProduto.ncm }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Preço</td>
                            <td class="td-data">{{ modalProduto.preco }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Unidade</td>
                            <td class="td-data">{{ modalProduto.unidade }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </template>
    <template #footer>
    <div class="is-flex is-justify-content-center">
        <button class="button is-success is-rounded mr-3" @click="alterarRegistro()">
            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
            <span>Salvar</span>
        </button>
        <button class="button is-danger is-rounded" @click="ispopUpConfirmationAtivo = false">
            <span class="icon"><font-awesome-icon :icon="['fa', 'ban']" /></span>
            <span>Cancelar</span>
        </button>
    </div>
    </template>
</PopUpConfirmation>

</template>