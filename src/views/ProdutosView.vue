<script setup>

import { db } from '@/firebase';
import { storage } from '@/firebase'
import { ref as firebaseRef, uploadBytes } from 'firebase/storage'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { onMounted, ref, watch } from 'vue';
import { priceRS, formatarDataBr } from '../modules'
import ModalCard from '@/components/ModalCard.vue';
import { Block, Notify } from 'notiflix';
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

const modalProduto = ref({
    idProd: null,
    cadastro: null,
    nome: null,
    cc: null,
    ncm: null,
    unidade: null,
    preco: null,
    fileUpload: null,
    fileUploadName: null,
    // fileUploadType: null,
    comentario: null
})

const selectCentroCustoValue = ref(['CC 1', 'CC 2']);
const selectNcmValue = ref(['NCM 1', 'NCM 2']);
const selectUnidadeValue = ref(['PC', 'L'])

// function lerFileUpload(event) {
//     const file = event.target.files[0];
//     modalProduto.value.fileUploadName = file.name;
//     modalProduto.value.fileUploadType = file.type;
//     console.log(file)
//     if(file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             modalProduto.value.fileUpload = event.target.result;
//             console.log(modalProduto.value.fileUpload)
//         }
//         reader.readAsDataURL(file);
//     }
// }

// function limparFileUpload() {
//     modalProduto.value.fileUpload = null;
//     modalProduto.value.fileUploadName = null;
//     modalProduto.value.fileUploadType = null;
// }

function ReceberEmitFileUpload(fileUpload) {
    modalProduto.value.fileUpload = fileUpload;
}

function ReceberEmitFileUploadName(fileUploadName) {
    modalProduto.value.fileUploadName = fileUploadName;
    console.log(modalProduto.value.fileUploadName)
}

const filtroPesquisa = ref({
    inputNomeProduto: '',
    inputCadastroDe: '',
    inputCadastroAte: '',
    inputIdProduto: '',
    selectCentroCusto: '',
    selectNcm: ''
})

function adicionarRegistro() {
    Block.pulse();
    const nomeExiste = dadosTabelaHome.value.some((d) => {
        return modalProduto.value.nome.toLowerCase() == d.nome.toLowerCase()
    });
    if(nomeExiste) {
        Notify.failure('Nome já existente!')
        Block.remove();
        return;
    } else {
        const docIndice = doc(db, 'indices', 'produto-compra');
        getDoc(docIndice).then((d) => {
            let idProduto = d.data().ultimo;
            idProduto++;
            setDoc(docIndice, {ultimo: idProduto});
            // upload image - firebase storage
            if(modalProduto.value.fileUploadName == 'sem-imagem.png' || modalProduto.value.fileUploadName == null) {
                modalProduto.value.fileUpload = null;
            } else {
                const imageRef = firebaseRef(storage, `produtos-compras/${idProduto}`)
                uploadBytes(imageRef, modalProduto.value.fileUpload);
                modalProduto.value.fileUpload = null;
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
                Block.remove();
            })
        })
    }
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

/* .file .file-name {
    border: 1px solid black;
    text-align: center;
    color: black;
    width: 100%;
    border-radius: 0;
} */


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
                        <button class="button is-info is-fullwidth is-rounded">
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
                                                <FileUpload @file-upload="ReceberEmitFileUpload($event)" 
                                                            @file-upload-name="ReceberEmitFileUploadName($event)">
                                                </FileUpload>
                                                <!-- <div class="box column is-5 mx-2 mb-2" style="position: relative;">
                                                    <span class="icon-delete icon" @click="limparFileUpload()">
                                                        <font-awesome-icon :icon="['fa', 'fa-trash']" />
                                                    </span>
                                                    <figure class="image is-128x128 is-align-items-center is-flex is-justify-content-center mb-2 mx-auto">
                                                        <img v-show="modalProduto.fileUploadType == 'image/jpeg'|| modalProduto.fileUploadType == 'image/png'" :src="modalProduto.fileUpload" alt="" style="height: 100%;">
                                                        <img v-show="modalProduto.fileUploadType == 'application/pdf'" src="../img/pdf.png" alt="" style="height: 100%;">
                                                        <img v-show="!modalProduto.fileUpload" src="../img/sem-imagem.png" alt="" style="height: 100%;">
                                                    </figure>
                                                    <div class="file">
                                                        <label class="file-label" style="width: 100%;">
                                                            <input class="file-input" type="file" name="file-upload" accept="image/jpeg, image/png, application/pdf" id="file-upload-input" @change="lerFileUpload($event)">
                                                            <span v-show="!modalProduto.fileUpload" class="file-cta button is-info" style="width: 100%;">
                                                                <span class="file-icon">
                                                                    <font-awesome-icon :icon="['fa', 'file-arrow-up']" />
                                                                </span>
                                                                <span class="file-label mx-auto">Upload</span>
                                                            </span>
                                                        </label>
                                                        
                                                    </div>
                                                    <p v-show="modalProduto.fileUpload" class="has-text-centered">
                                                        <span class="icon mr-1"><font-awesome-icon :icon="['fa', 'file']" /></span>
                                                        <span>{{ modalProduto.fileUploadName }}</span>
                                                    </p>
                                                </div> -->
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
                                        <button class="button is-success is-rounded" @click="adicionarRegistro()">
                                            <span class="icon"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                                            <span>Adicionar</span>
                                        </button>
                                        <button class="button is-dark is-outlined is-rounded" @click="modalProduto = {}">
                                            <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                                            <span>Limpar</span> 
                                        </button>
                                        <button class="button is-danger is-rounded" @click="isModalProdutoAtivo = false">
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