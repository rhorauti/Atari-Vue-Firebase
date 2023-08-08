<script setup>

import ModalCard from '@/components/ModalCard.vue'
import PopUpConfirmation from '@/components/PopUpConfirmation.vue'
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref, onMounted, computed } from 'vue'
import { vMaska } from 'maska'
import { Block, Notify, Confirm } from 'notiflix';

const dadosClientes = ref({
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
});

const arrayHome = ref([]);
const inputPesquisar = ref("");
const selectDatasTipo = ref([]);
const selectDatasUF = ref([]);

function atualizarDadosHome() {
    arrayHome.value = [];
    const query = getDocs(collection(db, 'clientes'));
    query.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dataResult = doc.data();
            dataResult.id = doc.id;
            arrayHome.value.push(dataResult);
        })
    })
}

onMounted(() => {
    // Carrega os dados dos clientes na tabela Home
    atualizarDadosHome()
    // Carrega os select Tipo.
    const selectDatasTipoApi = getDocs(collection(db, 'tipos'));
        selectDatasTipoApi.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                selectDatasTipo.value.push(doc.data());
            })
        });
    // Carrega os select UF.
    const selectDatasUFApi = getDocs(collection(db, 'ufs'));
    selectDatasUFApi.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            selectDatasUF.value.push(doc.data());
        })
    })  
});

const filtroPesquisaNomeHome = computed(() => {
    if (inputPesquisar.value == "") return arrayHome.value;
    return arrayHome.value.filter(dado => dado.nome.toLowerCase().includes(inputPesquisar.value.toLowerCase()));
})

// Excluir um registro do banco de dados.
// Confirm.merge({plainText: false})
function excluirRegistro(cliente) {
    Confirm.show(
        "Confirmação de exclusão",
        `Deseja excluir o cliente <b>${cliente.nome}</b>?`,
        "Sim",
        "Cancelar",
        () => {
            const docRef = doc(db, 'clientes', cliente.id);
            deleteDoc(docRef);
            atualizarDadosHome();
            Notify.success("Registro excluido com sucesso!");
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
    dadosClientes.value.id = cliente.id,
    dadosClientes.value.nome = cliente.nome,
    dadosClientes.value.tipo = cliente.tipo,
    dadosClientes.value.cnpj = cliente.cnpj,
    dadosClientes.value.email = cliente.email,
    dadosClientes.value.telefone = cliente.telefone,
    dadosClientes.value.endereco = cliente.endereco,
    dadosClientes.value.bairro = cliente.bairro,
    dadosClientes.value.cidade = cliente.cidade,
    dadosClientes.value.uf = cliente.uf
}

const ispopUpConfirmationAtivo = ref(false)

// Envia os dados de alteração para o firebase
function alterarRegistro() {
    Block.pulse(".tabelaHome");
    const docRef = doc(db, 'clientes', dadosClientes.value.id)
    updateDoc(docRef, {
        nome: dadosClientes.value.nome?? null,
        tipo: dadosClientes.value.tipo?? null,
        cnpj: dadosClientes.value.cnpj?? null,
        email: dadosClientes.value.email?? null,
        telefone: dadosClientes.value.telefone?? null,
        endereco: dadosClientes.value.endereco?? null,
        bairro: dadosClientes.value.bairro?? null, 
        cidade: dadosClientes.value.cidade?? null,
        uf: dadosClientes.value.uf?? null
    })
    .then(() => {
        dadosClientes.value = {};
        atualizarDadosHome();
        Block.remove(".tabelaHome");
        ispopUpConfirmationAtivo.value = false;
        isModalCadastrarEditarAtivo.value = false;
        Notify.success("Registro alterado com sucesso!")
    })
}

// Abre o formulário Cadastrar ao clicar no botão Cadastrar do Home
function abrirModalCadastrar() {
    dadosClientes.value = {};
    tituloFormulario.value = "Cadastro de novo cliente"
    mostrarBtnFormulario.value = true
    isModalCadastrarEditarAtivo.value = true;
}

// Faz a validação do campo nome do formulário
const isNomeValido = computed(() => {
    if (dadosClientes.value.nome == null || dadosClientes.value.nome == 0) return false
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

// Adiciona um novo registro no firebase.
function adicionarRegistro() {
    Block.pulse(".tabelaHome");
    const docIndice = doc(db, 'indices', 'cliente');
    getDoc(docIndice).then((d) => {
        let idCliente = d.data().ultimo;
        idCliente++;
        setDoc(docIndice, {ultimo: idCliente});
        setDoc(doc(db, 'clientes', idCliente.toString()), {
            nome: dadosClientes.value.nome ?? "",
            tipo: dadosClientes.value.tipo ?? "",
            cnpj: dadosClientes.value.cnpj ?? "",
            email: dadosClientes.value.email ?? "",
            telefone: dadosClientes.value.telefone ?? "",
            endereco: dadosClientes.value.endereco ?? "",
            bairro: dadosClientes.value.bairro ?? "", 
            cidade: dadosClientes.value.cidade ?? "",
            uf: dadosClientes.value.uf ?? ""
        }).then(() => {
            dadosClientes.value = {};
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

// Fecha o formulário ao clicar no botão cancelar.
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

// Limpar os campos do formulário ao clicar no botão limpar
function limparRegistro() {
    Confirm.show(
        "Limpar os dados?",
        "Deseja limpar os campos?",
        "Sim",
        "Cancelar",
        () => {
            dadosClientes.value = {};
        }
    )
}

const isModalTipoAtivo = ref(false);

function abrirModalTipo() {
    isModalTipoAtivo.value = true;
}

function cancelarRegistroTipo() {
    isModalTipoAtivo.value = false;
}

</script>


<style>

@import 'bulma/css/bulma.min.css';
@import 'bulma-extensions/dist/css/bulma-extensions.min.css';

body {
    font-size: 0.7rem;
}

td, th {
    text-align: center;
}   

</style>

<template>
<!--Home área de filtro + tabela-->
<div class="mx-4 my-2 is-flex-grow-1">
    <!--Campo de filtro da tabela + botão cadastrar-->
    <div class="field is-grouped box p-2">
        <label class="label is-small mx-3 is-align-self-center">Nome do cliente</label>
        <div class="control mr-3 is-expanded">
            <input type="text" class="input is-small" v-model="inputPesquisar">
        </div>
        <div class="control">
            <button @click="abrirModalCadastrar" class="button is-small is-info has-text-weight-bold is-fullwidth">
                <font-awesome-icon :icon="['fas', 'plus']" class="mr-1"/>
                <span>Cadastrar</span> 
            </button>
        </div>
    </div>
    <!--Tabela home de clientes-->
    <div class="table-container box p-0 tabelaHome">
        <table class="table is-narrow is-bordered is-hoverable is-fullwidth">
            <thead>
                <tr class="has-background-dark has-text-light">
                    <th class="has-text-centered has-text-light">Id</th>
                    <th class="has-text-centered has-text-light">Nome</th>
                    <th class="has-text-centered has-text-light">Tipo
                        <font-awesome-icon @click="abrirModalTipo()" :icon="['fas', 'plus']" class="has-background-warning-dark is-clickable"/>                    
                    </th>
                    <th class="has-text-centered has-text-light">CNPJ</th>
                    <th class="has-text-centered has-text-light">Email</th>
                    <th class="has-text-centered has-text-light">Telefone</th>
                    <th class="has-text-centered has-text-light" hidden>Endereço</th>
                    <th class="has-text-centered has-text-light" hidden>Bairro</th>
                    <th class="has-text-centered has-text-light">Cidade</th>
                    <th class="has-text-centered has-text-light">UF
                        <font-awesome-icon :icon="['fas', 'plus']" class="has-background-warning-dark is-clickable"/> 
                    </th>
                    <th class="has-text-centered has-text-light">Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cliente in filtroPesquisaNomeHome" :key="cliente.id"
                    class="has-text-centered is-vcentered">
                    <td class="is-vcentered">{{ cliente.id }}</td>
                    <td class="is-vcentered">{{ cliente.nome }}</td>
                    <td class="is-vcentered">{{ cliente.tipo }}</td>
                    <td class="is-vcentered">{{ cliente.cnpj }}</td>
                    <td class="is-vcentered">{{ cliente.email }}</td>
                    <td class="is-vcentered">{{ cliente.telefone }}</td>
                    <td class="is-vcentered" hidden>{{ cliente.endereco }}</td>
                    <td class="is-vcentered" hidden>{{ cliente.bairro }}</td>
                    <td class="is-vcentered">{{ cliente.cidade }}</td>
                    <td class="is-vcentered">{{ cliente.uf }}</td>
                    <td class="is-vcentered">
                        <div class="flex">
                            <button @click="abrirModalAlterar(cliente)" class="button is-small is-warning">
                                <font-awesome-icon :icon="['fas', 'pen']"/>
                            </button>                                                                                 
                            <button @click="excluirRegistro(cliente)" class="button is-small is-danger ml-2">
                                <font-awesome-icon :icon="['fas', 'trash']"/>
                            </button>
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
                    <!--Id do cliente-->
                <div class="field">
                    <label class="label is-small">Id</label>
                    <div class="control">
                        <input v-model="dadosClientes.id" type="text" class="input is-small is-info has-background-white" disabled>
                    </div>
                </div>
                    <!--Nome do cliente-->
                <div class="field">
                    <label class="label is-small">Nome</label>
                    <div class="control">
                        <input v-model="dadosClientes.nome" type="text" :class="{'is-danger': !isNomeValido}" class="input is-info is-small">
                    </div>
                    <p v-show="!isNomeValido" class="help is-danger">Campo obrigatório : Insira um nome</p>
                </div>
                <!--Tipo de cliente-->
                <div class="field">
                    <label class="label is-small">Tipo</label>
                    <div class="control select is-small select is-info is-small is-hovered is-fullwidth"> 
                        <select v-model="dadosClientes.tipo">
                            <option disabled>Selecione um tipo</option>
                            <option v-for="selectDataTipo in selectDatasTipo" :key="selectDataTipo.id">{{ selectDataTipo.nome }}</option>
                        </select>
                    </div>
                </div>
                <!--CNPJ do cliente-->
                <div class="field">
                    <label class="label is-small">CPF / CNPJ</label>
                    <div class="control">
                        <input v-model="dadosClientes.cnpj" @input="atualizarCnpjVmaska($event.target.value)" type="text" class="input is-info is-small" v-maska :data-maska="vMaskaCnpj">
                    </div>
                </div>
                <!--Email do cliente-->
                <div class="field">
                    <label class="label is-small">E-mail</label>
                    <div class="control">
                        <input v-model="dadosClientes.email" type="email" class="input is-info is-small" placeholder="exemple@gmail.com" >
                    </div>
                </div>
            </div>
            <!--2a coluna do formulário-->
            <div class="column">
                <!--Telefone do cliente-->
                <div class="field"> 
                    <label class="label is-small">Telefone</label>
                    <div class="control">
                        <input v-model="dadosClientes.telefone" type="tel" class="input is-info is-small" placeholder="(xx) xxxxx-xxxx" v-maska data-maska="(##) #####-####">
                    </div>
                </div>
                <!--Endereço do cliente-->
                <div class="field"> 
                    <label class="label is-small">Endereço</label>
                    <div class="control">
                        <input v-model="dadosClientes.endereco" type="text" class="input is-info is-small">
                    </div>
                </div>
                <!--Bairro do cliente-->
                <div class="field"> 
                    <label class="label is-small">Bairro</label>
                    <div class="control">
                        <input v-model="dadosClientes.bairro" type="text" class="input is-info is-small">
                    </div>
                </div>
                <!--Cidade do cliente-->
                <div class="field"> 
                    <label class="label is-small">Cidade</label>
                    <div class="control">
                        <input v-model="dadosClientes.cidade" type="text" class="input is-info is-small">
                    </div>
                </div>
                <!--UF de cliente-->
                <div class="field"> 
                    <label class="label is-small ">UF</label>
                    <div class="select is-info is-small is-fullwidth">
                        <select v-model="dadosClientes.uf">
                            <option disabled value="">Selecione uma UF</option>
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

<ModalCard :is-ativo="isModalTipoAtivo" titulo="Tipo de Cliente" @closeModalCard = "cancelarRegistroTipo()">
    <template #body>
        <div class="field">
            <label for="" class="label is-small">Id</label>
            <div class="control">
                <input type="text" class="input is-small is-info has-background-white" disabled>
            </div>
        </div>
        <div class="field">
            <label for="" class="label is-small">Tipo</label>
            <div class="control">
                <input type="text" class="input is-small is-info">
            </div>
        </div>
        <table class="table is-bordered is-fullwidth">
            <thead>
                <tr>
                    <th class="has-text-centered">Id</th>
                    <th class="has-text-centered">Tipo</th>
                    <th class="has-text-centered">Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr class="has-text-centered">
                    <td class="is-vcentered">1</td>
                    <td class="is-vcentered">Pessoa Física</td>
                    <td class="is-vcentered">
                        <button class="button is-small is-warning">
                            <font-awesome-icon :icon="['fas', 'pen']"/>
                        </button>                                                                                 
                        <button class="button is-small is-danger ml-2">
                            <font-awesome-icon :icon="['fas', 'trash']"/>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </template>
    <template #footer>
        <button class="button is-success">Adicionar</button>
        <button class="button is-warning ml-2">Limpar</button>
        <button @click="cancelarRegistroTipo()" class="button is-danger">Cancelar</button>
    </template>
</ModalCard>

<!--Pop up confirmação de alteração de dados-->
<PopUpConfirmation :ispopUpConfirmationAtivo="ispopUpConfirmationAtivo" :titlePopUpConfirmation="'Deseja alterar os dados conforme abaixo?'">
    <template #body>
        <div class="columns is-vcentered is-gapless">
            <!--1a coluna da tabela-->
            <div class="column">
                <table class="table is-bordered mt-3">
                    <tbody>
                        <tr>
                            <td class="td-title">Id</td>
                            <td class="td-data">{{ dadosClientes.id }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Nome</td>
                            <td class="td-data">{{ dadosClientes.nome }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Tipo</td>
                            <td class="td-data">{{ dadosClientes.tipo }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">CNPJ</td>
                            <td class="td-data">{{ dadosClientes.cnpj }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">E-mail</td>
                            <td class="td-data">{{ dadosClientes.email }}</td>
                        </tr>
                    </tbody>
                </table>
            </div> 
            <!--2a coluna da tabela-->
            <div class="column">
                <table class="table is-bordered mt-3">
                    <tbody>
                        <tr>
                            <td class="td-title">Telefone</td>
                            <td class="td-data">{{ dadosClientes.telefone }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Endereço</td>
                            <td class="td-data">{{ dadosClientes.endereco }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Bairro</td>
                            <td class="td-data">{{ dadosClientes.bairro }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">Cidade</td>
                            <td class="td-data">{{ dadosClientes.cidade }}</td>
                        </tr>
                        <tr>
                            <td class="td-title">UF</td>
                            <td class="td-data">{{ dadosClientes.uf }}</td>
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

</template>

