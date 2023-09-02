<script setup>

import ModalCard from '@/components/ModalCard.vue'
import ModalCardUF from '@/components/ModalCardUF.vue'
import PopUpConfirmation from '@/components/PopUpConfirmation.vue'
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref, onMounted, computed, watch } from 'vue'
import { vMaska } from 'maska'
import { Block, Notify, Confirm, Loading } from 'notiflix';
import ModalCardTipo from '@/components/ModalCardTipo.vue'

const modalClientes = ref({
    id: null,
    nome: null,
    tipo: null,
    cnpj: null,
    email: null,
    telefone: null,
    endereco: null,
    bairro: null,
    cidade: null,
    uf: null,
})

// const tableHomeHeaders = ['Id', 'Cadastro', 'Nome', 'Tipo', 'CNPJ', 'Email', 'Telefone', 'Endereço', 'Bairro', 'Cidade', 'UF', 'Ação'];

const dadosTabelaHome = ref([]);
const inputPesquisar = ref("");
const selectDatasTipo = ref([]);
const selectDatasUF = ref([]);

const cols = [
    "Id", 
    "Cadastro",
    "Nome", 
    "Tipo", 
    "CNPJ", 
    "E-mail", 
    "Telefone", 
    "Endereço", 
    "Bairro", 
    "Cidade", 
    "UF",
    "Ação"
];
const colsVisibleStorage = "R0LkbqL2WdcMf8TnL4";
const colsVisible = ref([]);
const colsVisibleSelector = ref(false);

watch(colsVisible, (n) => {
    window.localStorage.setItem(colsVisibleStorage, JSON.stringify(n));
});

function atualizarDadosHome() {
    dadosTabelaHome.value = [];
    const query = getDocs(collection(db, 'clientes'));
    query.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dataResult = doc.data();
            dataResult.id = doc.id;
            dadosTabelaHome.value.push(dataResult);
        })
    })
}

function atualizarDadosTipo() {
    selectDatasTipo.value = [];
    const query = getDocs(collection(db, 'tipos'));
    query.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dataResult = doc.data();
            dataResult.id = doc.id;
            selectDatasTipo.value.push(dataResult);
        })
    })
}

function atualizarDadosUF() {
    selectDatasUF.value = [];
    const query = getDocs(collection(db, 'ufs'));
    query.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dataResult = doc.data();
            dataResult.id = doc.id;
            selectDatasUF.value.push(dataResult);
        })
    })
    selectDatasUF.value.sort((a, b) => (a.id > b.id) ? 1 : -1)
}

onMounted(() => {
    // Carrega os dados dos clientes na tabela Home
    atualizarDadosHome();
    atualizarDadosTipo();
    atualizarDadosUF();
    colsVisible.value = (window.localStorage.getItem(colsVisibleStorage)) ? JSON.parse(window.localStorage.getItem(colsVisibleStorage)) : cols;
});

const filtroPesquisaNomeHome = computed(() => {
    if (inputPesquisar.value == "" && dadosTabelaHome.value.length > 1) return dadosTabelaHome.value;
    return dadosTabelaHome.value.filter(dado => dado.nome.toLowerCase().includes(inputPesquisar.value.toLowerCase()));
})

function formatarDataBr(data) {
    if(!data) return;
    const partes = data.split(' ');
    const dia = parseInt(partes[2]);
    const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mes = parseInt(meses.indexOf(partes[1])) + 1;
    const ano = parseInt(partes[3]);
    const dataFormatada = new Date(ano, mes, dia);
    if(meses.indexOf(partes[1] >= 0 && partes[1] < 9)) {
        return dataFormatada.getDate() + '/0' + dataFormatada.getMonth() + '/' + dataFormatada.getFullYear();
    } else {
        return dataFormatada.getDate() + '/' + dataFormatada.getMonth() + '/' + dataFormatada.getFullYear();
    }
}

// Excluir um registro do banco de dados.
// Confirm.merge({plainText: false})
function excluirRegistro(cliente) {
    Confirm.show(
        "Confirmação de exclusão",
        `Deseja excluir o cliente <b>${cliente.nome}</b>?`,
        "Sim",
        "Cancelar",
        () => {
            Loading.pulse();
            const docRef = doc(db, 'clientes', cliente.id);
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

const isModalCadastrarEditarAtivo = ref(false);
const tituloFormulario = ref("");
const mostrarBtnFormulario = ref(false)

// Abre o modal aterar ao clicar no botão editar do Home
function abrirModalAlterar(cliente) {
    isModalCadastrarEditarAtivo.value = true
    tituloFormulario.value = "Alteração dos dados do cliente"
    mostrarBtnFormulario.value = false
    modalClientes.value.id = cliente.id,
    modalClientes.value.nome = cliente.nome,
    modalClientes.value.tipo = cliente.tipo,
    modalClientes.value.cnpj = cliente.cnpj,
    modalClientes.value.email = cliente.email,
    modalClientes.value.telefone = cliente.telefone,
    modalClientes.value.endereco = cliente.endereco,
    modalClientes.value.bairro = cliente.bairro,
    modalClientes.value.cidade = cliente.cidade,
    modalClientes.value.uf = cliente.uf
}

const ispopUpConfirmationAtivo = ref(false)

// Envia os dados de alteração para o firebase
function alterarRegistro() {
    Block.pulse(".tabelaHome");
    const nomeExiste = dadosTabelaHome.value.some((d) => {
        if(modalClientes.value.id != d.id) {
            return modalClientes.value.nome.toLowerCase() == d.nome.toLowerCase()
        }
    });
    if(nomeExiste) {
        Notify.failure('Nome já existente!')
        Block.remove(".tabelaHome");
        return;
    } else {
        const docRef = doc(db, 'clientes', modalClientes.value.id)
        updateDoc(docRef, {
            nome: modalClientes.value.nome?? null,
            tipo: modalClientes.value.tipo?? null,
            cnpj: modalClientes.value.cnpj?? null,
            email: modalClientes.value.email?? null,
            telefone: modalClientes.value.telefone?? null,
            endereco: modalClientes.value.endereco?? null,
            bairro: modalClientes.value.bairro?? null, 
            cidade: modalClientes.value.cidade?? null,
            uf: modalClientes.value.uf?? null
        })
        .then(() => {
            dadosTabelaHome.value = {};
            atualizarDadosHome();
            Block.remove(".tabelaHome");
            ispopUpConfirmationAtivo.value = false;
            isModalCadastrarEditarAtivo.value = false;
            Notify.success("Registro alterado com sucesso!")
        })
    }
}

function limparInputPesquisa() {
    inputPesquisar.value = '';
}

// Abre o formulário Cadastrar ao clicar no botão Cadastrar do Home
function abrirModalCadastrar() {
    modalClientes.value = {};
    tituloFormulario.value = "Cadastro de novo cliente"
    mostrarBtnFormulario.value = true
    isModalCadastrarEditarAtivo.value = true;
}

// Faz a validação do campo nome do formulário
const isNomeValido = computed(() => {
    if (modalClientes.value.nome == null || modalClientes.value.nome == 0) return false
    return true 
}) 

const vMaskaCnpj = ref('');

// Altera o formato do CPF / CNPJ dependendo do número de caracteres. 
function atualizarCnpjVmaska(novoValor) {
    if (novoValor.length <= 14) {
        vMaskaCnpj.value = "###.###.###-##";
    } else {
        vMaskaCnpj.value = "##.###.###/####-##";
    }
}

const vMaskaTelefone = ref('');

function atualizarTelefoneVmaska(novoValor) {
    if(novoValor.length <= 14) {
        vMaskaTelefone.value = '(##) ####-####'
    } else {
        vMaskaTelefone.value = '(##) #####-####'
    }
}

// Adiciona um novo registro no firebase.
function adicionarRegistro() {
    Block.pulse(".tabelaHome");
    const nomeExiste = dadosTabelaHome.value.some((d) => {
        return modalClientes.value.nome.toLowerCase() == d.nome.toLowerCase()
    });
    if(nomeExiste) {
        Notify.failure('Nome já existente!')
        Block.remove(".tabelaHome");
        return;
    } else {
        const docIndice = doc(db, 'indices', 'cliente');
        getDoc(docIndice).then((d) => {
            let idCliente = d.data().ultimo;
            idCliente++;
            setDoc(docIndice, {ultimo: idCliente});
            setDoc(doc(db, 'clientes', idCliente.toString()), {
                cadastro: String(new Date()),
                nome: modalClientes.value.nome ?? "",
                tipo: modalClientes.value.tipo ?? "",
                cnpj: modalClientes.value.cnpj ?? "",
                email: modalClientes.value.email ?? "",
                telefone: modalClientes.value.telefone ?? "",
                endereco: modalClientes.value.endereco ?? "",
                bairro: modalClientes.value.bairro ?? "", 
                cidade: modalClientes.value.cidade ?? "",
                uf: modalClientes.value.uf ?? ""
            }).then(() => {
                dadosTabelaHome.value = {};
                inputPesquisar.value = "";
                atualizarDadosHome();
                isModalCadastrarEditarAtivo.value = false;
                Notify.success("Registro inserido com sucesso!");
            }).catch(() => {
                Notify.danger("Falha ao registrar o cliente")
            }).finally(() => {
                Block.remove(".tabelaHome");
            })
        })
    }
}

// Fecha o formulário do Home ao clicar no botão cancelar.
function cancelarRegistro() {
    Confirm.show(
        "Cancelar formulário?",
        "Deseja sair do formulário? Os dados serão perdidos!",
        "Sim",
        "Cancelar",
        () => {
            inputPesquisar.value = "";
            isModalCadastrarEditarAtivo.value = false;
        }
    )
}

// Limpar os campos do formulário do Home ao clicar no botão limpar
function limparRegistro() {
    Confirm.show(
        "Limpar os dados?",
        "Deseja limpar os campos?",
        "Sim",
        "Cancelar",
        () => {
            dadosTabelaHome.value = {};
        }
    )
}

const isModalTipoAtivo = ref(false);

// Abre o modal de tipo de cliente 
function abrirModalTipo() {
    isModalTipoAtivo.value = true;
}

const isModalUFAtivo = ref(false);

function abrirModalUF() {
    isModalUFAtivo.value = true;
}

</script>


<style scoped>

@import 'bulma/css/bulma.min.css';
@import 'bulma-extensions/dist/css/bulma-extensions.min.css';


td, th {
    text-align: center;
    /* white-space: nowrap; */
} 

.field.is-grouped {
    justify-content: center;
}

.btn-tabela {
    font-size: 0.9rem;
}

.area-pesquisa {
    position: relative;
    top: 2.2rem;
    left: 0;
    width: 100%;
    padding: 1.2rem;
    margin-bottom: 2rem;
    align-items: center;
    background-color: linear-gradient( #100d33, #5c5b69);
}

</style>

<template>
<!--Home área de filtro + tabela clientes-->
<div class="mx-4 my-4">
    <!--Campo de filtro da tabela + botão cadastrar-->
    <div class="field is-grouped area-pesquisa">
        <label class="label mr-3 has-text-light">Nome: </label>
        <p class="control is-expanded">
            <input type="text" class="input" v-model="inputPesquisar">
        </p>
        <div class="field is-grouped">
            <p class="control">
                <button @click="limparInputPesquisa()" class="button is-light is-outlined">
                    <span class="icon"><font-awesome-icon :icon="['fas', 'rotate-right']" /></span>
                    <span>Limpar</span> 
                </button>
            </p>
            <div class="control">
                <button class="button is-light is-outlined" @click="colsVisibleSelector=!colsVisibleSelector">
                    <span class="icon"><font-awesome-icon :icon="['fas', 'eye']"/></span>
                    <span>Colunas</span>
                </button>
                <div style="position: absolute; display: flex; flex-direction: column; top: 0rem; z-index: 100; border: 1px solid #777; padding: 1.2rem; border-radius: 1rem; background-color: #fff; right: 7.2rem; width: 8rem;" v-show="colsVisibleSelector">
                    <label class="checkbox" v-for="col, colunasid in cols" :key="colunasid">
                        <input type="checkbox" :value="col" v-model="colsVisible" :disabled="col=='Id' || col=='Nome'"/>{{ col }}
                    </label>
                </div>
            </div>
            <p class="control">
                <button @click="abrirModalTipo()" class="button is-info has-text-weight-bold is-fullwidth">
                    <span class="icon"><font-awesome-icon :icon="['fas', 'plus']"/></span>
                    <span>Tipo</span> 
                </button>
            </p>
            <p class="control">
                <button @click="abrirModalUF()" class="button is-info has-text-weight-bold is-fullwidth">
                    <span class="icon"><font-awesome-icon :icon="['fas', 'plus']"/></span>
                    <span>UF</span> 
                </button>
            </p>
            <p class="control">
                <button @click="abrirModalCadastrar" class="button is-info has-text-weight-bold is-fullwidth">
                    <font-awesome-icon :icon="['fas', 'plus']" class="mr-1"/>
                    <span>Cliente</span> 
                </button>
            </p>
        </div>
    </div>
    <!--Tabela home de clientes-->
    <div style="max-height: calc(100vh - 9rem); overflow: scroll;">
        <table class="table is-narrow is-bordered is-hoverable is-fullwidth">
            <thead style="position: sticky; top: 0; z-index: 2;">
                <tr>
                    <th class="has-text-centered has-background-dark has-text-light"
                    v-for="col, idcoluna in cols" v-show="colsVisible.indexOf(col) >=0" :key="idcoluna">{{ col }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cliente in filtroPesquisaNomeHome.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)" :key="cliente.id"
                    class="has-text-centered is-vcentered">
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Id') >= 0">{{ cliente.id }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Cadastro') >= 0">{{ formatarDataBr(cliente.cadastro) }} </td>
                    <td style="white-space: nowrap;" class="is-vcentered" v-show="colsVisible.indexOf('Nome') >= 0">{{ cliente.nome }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Tipo') >= 0">{{ cliente.tipo }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('CNPJ') >= 0">{{ cliente.cnpj }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('E-mail') >= 0">{{ cliente.email }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Telefone') >= 0">{{ cliente.telefone }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Endereço') >= 0">{{ cliente.endereco }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Bairro') >= 0">{{ cliente.bairro }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Cidade') >= 0">{{ cliente.cidade }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('UF') >= 0">{{ cliente.uf }}</td>
                    <td class="is-vcentered" v-show="colsVisible.indexOf('Ação') >= 0">
                        <div class="field is-grouped">
                            <p class="control">
                                <button @click="abrirModalAlterar(cliente)" class="button is-warning btn-tabela">
                                    <font-awesome-icon :icon="['fas', 'pen']"/>
                                </button>                                                                                 
                            </p>
                            <p class="control">
                                <button @click="excluirRegistro(cliente)" class="button is-danger btn-tabela">
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

<!--Modal Cadastrar e Editar-->
<ModalCard @closeModalCard="cancelarRegistro" :isAtivo="isModalCadastrarEditarAtivo" :titulo="tituloFormulario">
    <template #body>
        <div class="columns">
            <!--1a coluna do formulário-->
            <div class="column">
                <!--Id-->
                <div class="field">
                    <label class="label ">Id</label>
                    <div class="control">
                        <input v-model="modalClientes.id" type="text" class="input  is-info has-background-white" disabled>
                    </div>
                </div>
                <!--Nome-->
                <div class="field">
                    <label class="label ">Nome</label>
                    <div class="control">
                        <input v-model="modalClientes.nome" type="text" :class="{'is-danger': !isNomeValido}" class="input is-info ">
                    </div>
                    <p v-show="!isNomeValido" class="help is-danger">Campo obrigatório : Insira um nome</p>
                </div>
                <!--Tipo-->
                <div class="field">
                    <label class="label ">Tipo</label>
                    <div class="control select  select is-info  is-hovered is-fullwidth"> 
                        <select v-model="modalClientes.tipo">
                            <option v-for="selectDataTipo in selectDatasTipo" :key="selectDataTipo.id">{{ selectDataTipo.nome }}</option>
                        </select>
                    </div>
                </div>
                <!--CNPJ-->
                <div class="field">
                    <label class="label ">CPF / CNPJ</label>
                    <div class="control">
                        <input v-model="modalClientes.cnpj" @input="atualizarCnpjVmaska($event.target.value)" type="text" class="input is-info " v-maska :data-maska="vMaskaCnpj">
                    </div>
                </div>
                <!--Email-->
                <div class="field">
                    <label class="label ">E-mail</label>
                    <div class="control">
                        <input v-model="modalClientes.email" type="email" class="input is-info " placeholder="exemple@gmail.com" >
                    </div>
                </div>
            </div>
            <!--2a coluna do formulário-->
            <div class="column">
                <!--Telefone-->
                <div class="field"> 
                    <label class="label ">Telefone</label>
                    <div class="control">
                        <input v-model="modalClientes.telefone" @input="atualizarTelefoneVmaska($event.target.value)" type="tel" class="input is-info " placeholder="(xx) xxxxx-xxxx" v-maska :data-maska="vMaskaTelefone">
                    </div>
                </div>
                <!--Endereço-->
                <div class="field"> 
                    <label class="label ">Endereço</label>
                    <div class="control">
                        <input v-model="modalClientes.endereco" type="text" class="input is-info ">
                    </div>
                </div>
                <!--Bairro-->
                <div class="field"> 
                    <label class="label ">Bairro</label>
                    <div class="control">
                        <input v-model="modalClientes.bairro" type="text" class="input is-info ">
                    </div>
                </div>
                <!--Cidade-->
                <div class="field"> 
                    <label class="label ">Cidade</label>
                    <div class="control">
                        <input v-model="modalClientes.cidade" type="text" class="input is-info ">
                    </div>
                </div>
                <!--UF-->
                <div class="field"> 
                    <label class="label  ">UF</label>
                    <div class="select is-info  is-fullwidth">
                        <select v-model="modalClientes.uf">
                            <option v-for="selectDataUF in selectDatasUF" :key="selectDataUF.id">{{ selectDataUF.nome }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template #footer>
        <button v-if="mostrarBtnFormulario" @click="adicionarRegistro" :disabled="!isNomeValido" class="button is-success">Adicionar</button>
        <button v-else @click="ispopUpConfirmationAtivo = true" :disabled="!isNomeValido" class="button is-success">Alterar</button>
        <button @click="limparRegistro" class="button is-warning ml-2">Limpar</button>
        <button @click="cancelarRegistro" class="button is-danger">Cancelar</button>
    </template>
</ModalCard>

<!--Pop up confirmação de alteração de dados-->
<PopUpConfirmation :ispopUpConfirmationAtivo="ispopUpConfirmationAtivo" :titlePopUpConfirmation="'Deseja alterar os dados conforme abaixo?'">
    <template #body>
        <div class="columns is-vcentered is-gapless">
            <!--1a coluna da tabela-->
            <div class="column">
                <table class="table is-bordered mt-3 is-fullwidth">
                    <tbody class="has-text-centered">
                        <tr>
                            <td class="td-title">Id</td>
                            <td class="td-data">{{ modalClientes.id }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Nome</td>
                            <td class="td-data">{{ modalClientes.nome }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Tipo</td>
                            <td class="td-data">{{ modalClientes.tipo }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">CNPJ</td>
                            <td class="td-data">{{ modalClientes.cnpj }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">E-mail</td>
                            <td class="td-data">{{ modalClientes.email }}</td>
                        </tr>
                    </tbody>
                </table>
            </div> 
            <!--2a coluna da tabela-->
            <div class="column">
                <table class="table is-bordered mt-3 is-fullwidth">
                    <tbody class="has-text-centered">
                        <tr>
                            <td class="td-title">Telefone</td>
                            <td class="td-data">{{ modalClientes.telefone }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Endereço</td>
                            <td class="td-data">{{ modalClientes.endereco }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Bairro</td>
                            <td class="td-data">{{ modalClientes.bairro }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Cidade</td>
                            <td class="td-data">{{ modalClientes.cidade }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">UF</td>
                            <td class="td-data">{{ modalClientes.uf }}</td>
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
</PopUpConfirmation>

<ModalCardTipo :isModalTipoAtivo="isModalTipoAtivo" @closeModalCardTipo="isModalTipoAtivo = false"></ModalCardTipo>

<ModalCardUF :isModalUFAtivo="isModalUFAtivo" @closeModalCardUF="isModalUFAtivo = false"></ModalCardUF>

</template>

