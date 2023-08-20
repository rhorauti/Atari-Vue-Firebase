<script setup>

import ModalCard from '@/components/ModalCard.vue'
import PopUpConfirmation from '@/components/PopUpConfirmation.vue'
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref, onMounted, computed } from 'vue'
import { vMaska } from 'maska'
import { Block, Notify, Confirm, Loading } from 'notiflix';

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

const tableHeadersTipo = ['Id', 'Tipo', 'Ação']
const tableHeadersUF = ['Id', 'UF', 'Ação']

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
    arrayHome.value.sort((a, b) => (a.id > b.id) ? 1 : -1)
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
    // Carrega os select Tipo.
    atualizarDadosTipo();
    // Carrega os select UF.
    atualizarDadosUF();
});

const filtroPesquisaNomeHome = computed(() => {
    if (inputPesquisar.value == "" && arrayHome.value.length > 1) return arrayHome.value;
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
    const nomeExiste = arrayHome.value.some((d) => {
        return dadosClientes.value.nome.toLowerCase() == d.nome.toLowerCase()
    });
    if(nomeExiste) {
        Notify.failure('Nome já existente!')
        Block.remove(".tabelaHome");
        return;
    } else {
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
    const nomeExiste = arrayHome.value.some((d) => {
        return dadosClientes.value.nome.toLowerCase() == d.nome.toLowerCase()
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
            dadosClientes.value = {};
        }
    )
}

const isModalTipoAtivo = ref(false);

// Abre o modal de tipo de cliente 
function abrirModalTipo() {
    isModalTipoAtivo.value = true;
}

// Cancela e volta para o home da tela de clientes
function cancelarRegistroTipo() {
    isModalTipoAtivo.value = false;
}

const inputPesquisaTipo = ref('');

// Filtro do pesquisa do tipo de cliente
const filtroPesquisaTipo = computed(() => {
    if (inputPesquisaTipo.value == "") return selectDatasTipo.value;
    return selectDatasTipo.value.filter(dado => dado.nome.toLowerCase().includes(inputPesquisaTipo.value.toLowerCase()));
})

// Abre o modal de novo cadastro de tipo de cliente
function abrirModalCadastrarTipo() {
    Confirm.prompt(
        'Cadastrar novo tipo de cliente',
        'Digite o nome do novo registro',
        'Cliente',
        'Adicionar',
        'Cancelar',
        (nomeCadastrarTipo) => {
            adicionarTipo(nomeCadastrarTipo)
        }
    )
}

// Adiciona o tipo de cliente ao clicar no botão Adicionar
function adicionarTipo(nomeCadastrarTipo) {
    Loading.pulse();
    const nomeTipoExiste = selectDatasTipo.value.some((d) => {
        return nomeCadastrarTipo.toLowerCase() == d.nome.toLowerCase()
    });
    if(nomeTipoExiste) {
        Notify.failure('Nome já existente!')
        Loading.remove();
        return;
    } else {
        const docIndice = doc(db, 'indices', 'tipoCliente');
        getDoc(docIndice).then((d) => {
            let idTipo = d.data().ultimo;
            idTipo++;
            setDoc(docIndice, {ultimo: idTipo});
            setDoc(doc(db, 'tipos', idTipo.toString()), {
                nome: nomeCadastrarTipo ?? "",
            }).then(() => {
                inputPesquisaTipo.value = "";
                atualizarDadosTipo();
                Notify.success("Registro inserido com sucesso!");
            }).catch(() => {
                Notify.failure("Falha ao registrar o tipo de cliente")
            }).finally(() => {
                Loading.remove();
            })
        })
    }    
}

// Abre o modal de alterar cadastro de tipo de cliente
function abrirModalEditarTipo(tipo) {
    Confirm.prompt(
        'Editar Registro Tipo Cliente',
        'Insira o nome do tipo de cliente',
        tipo.nome,
        'Alterar',
        'Cancelar',
        (respostaModalEditarTipo) => {
            alterarTipo(respostaModalEditarTipo, tipo);
        }
    )
}

// Adiciona o tipo de cliente ao clicar no botão Editar
function alterarTipo(respostaModalEditarTipo, tipo) {
    Loading.pulse();
    const nomeTipoExiste = selectDatasTipo.value.some((d) => {
        return respostaModalEditarTipo.toLowerCase() == d.nome.toLowerCase()
    });
    if(nomeTipoExiste) {
        Notify.failure('Nome já existente!')
        Loading.remove();
        return;
    } else {
        const docRef = doc(db, 'tipos', tipo.id)
        updateDoc(docRef, {
            nome: respostaModalEditarTipo?? null,
        })
        .then(() => {
            atualizarDadosTipo();
            Notify.success("Registro alterado com sucesso!")
        })
        .catch(() => {
            Notify.failure('Falha ao alterar o tipo de cliente')
        }).finally(() => {
            Loading.remove();
        })
    }
}

// Excluir o tipo de cliente ao clicar no botão Excluir do home tipo
function excluirTipo(tipo) {
    Confirm.show(
        "Confirmação de exclusão",
        `Deseja excluir o tipo <b>${tipo.nome}</b>?`,
        "Sim",
        "Cancelar",
        () => {
            const docRef = doc(db, 'tipos', tipo.id);
            deleteDoc(docRef);
            atualizarDadosTipo();
            Notify.success("Registro excluido com sucesso!");
        }
    )
}

const isModalUFAtivo = ref(false);

// Abre o modal de UF 
function abrirModalUF() {
    isModalUFAtivo.value = true;
}

// Cancela e volta para o home da UF
function cancelarRegistroUF() {
    isModalUFAtivo.value = false;
}

const inputPesquisaUF = ref('');

// Filtro do pesquisa da UF
const filtroPesquisaUF = computed(() => {
    if (inputPesquisaUF.value == "") return selectDatasUF.value;
    return selectDatasUF.value.filter(dado => dado.nome.toLowerCase().includes(inputPesquisaUF.value.toLowerCase()));
})

// Abre o modal de novo cadastro de UF
function abrirModalCadastrarUF() {
    Confirm.prompt(
        'Cadastrar novo UF',
        'Digite o nome do novo registro',
        'UF',
        'Adicionar',
        'Cancelar',
        (nomeCadastrarUF) => {
            adicionarUF(nomeCadastrarUF)
        }
    )
}

// Adiciona a UF ao clicar no botão Adicionar
function adicionarUF(nomeCadastrarUF) {
    Loading.pulse();
    const isNomeUFExiste = selectDatasUF.value.some((d) => {
        return nomeCadastrarUF.toLowerCase() == d.nome.toLowerCase();
    });
    if(isNomeUFExiste) {
        Notify.failure('Nome já existente!');
        Loading.remove();
        return;
    } else {
        const docIndice = doc(db, 'indices', 'uf');
        getDoc(docIndice).then((d) => {
            let idUF = d.data().ultimo;
            idUF++;
            setDoc(docIndice, {ultimo: idUF});
            setDoc(doc(db, 'ufs', idUF.toString()), {
                nome: nomeCadastrarUF ?? "",
            }).then(() => {
                inputPesquisaUF.value = "";
                atualizarDadosUF();
                Notify.success("Registro inserido com sucesso!");
            }).catch(() => {
                Notify.failure("Falha ao registrar a UF")
            }).finally(() => {
                Loading.remove();
            })
        })
    }   
}

// Abre o modal de alterar cadastro de UF de cliente
function abrirModalEditarUF(uf) {
    Confirm.prompt(
        'Editar Registro Tipo Cliente',
        'Insira o nome do tipo de cliente',
        uf.nome,
        'Alterar',
        'Cancelar',
        (respostaModalEditarUF) => {
            const isUFExiste = selectDatasUF.value.some((d) => {
                return d.nome.toLowerCase() == respostaModalEditarUF.toLowerCase();
            })
            if(isUFExiste) {
                Notify.failure('UF já existente!');
                return;
            } else {
                alterarUF(respostaModalEditarUF, uf);
            }
        }
    )
}

// Adiciona o tipo de cliente ao clicar no botão Editar
function alterarUF(respostaModalEditarUF, uf) {
    Loading.pulse();
    const isNomeUFExiste = selectDatasUF.value.some((d) => {
        return respostaModalEditarUF.toLowerCase() == d.nome.toLowerCase();
    });
    if(isNomeUFExiste) {
        Notify.failure('Nome já existente!');
        Loading.remove();
        return;
    } else {
        const docRef = doc(db, 'ufs', uf.id)
        updateDoc(docRef, {
            nome: respostaModalEditarUF?? null,
        })
        .then(() => {
            atualizarDadosUF();
            Notify.success("Registro alterado com sucesso!")
        })
        .catch(() => {
            Notify.failure('Falha ao alterar a UF')
        }).finally(() => {
            Loading.remove();
        })
    }
}

// Excluir o tipo de cliente ao clicar no botão Excluir do home tipo
function excluirUF(uf) {
    Confirm.show(
        "Confirmação de exclusão",
        `Deseja excluir a UF <b>${uf.nome}</b>?`,
        "Sim",
        "Cancelar",
        () => {
            const docRef = doc(db, 'ufs', uf.id);
            deleteDoc(docRef);
            atualizarDadosUF();
            Notify.success("Registro excluido com sucesso!");
        }
    )
}

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

.btn-tabela-home {
    margin-right: 0;
}

.field.is-grouped {
    justify-content: center;
}

</style>

<template>
<!--Home área de filtro + tabela clientes-->
<div class="mx-4 my-2 is-flex-grow-1">
    <!--Campo de filtro da tabela + botão cadastrar-->
    <div class="field is-grouped">
        <label class="label is-small mx-3 is-align-self-center">Nome do cliente</label>
        <p class="control is-expanded">
            <input type="text" class="input is-small" v-model="inputPesquisar">
        </p>
        <p class="control">
            <button @click="abrirModalCadastrar" class="button is-small is-info has-text-weight-bold is-fullwidth">
                <font-awesome-icon :icon="['fas', 'plus']" class="mr-1"/>
                <span>Cadastrar</span> 
            </button>
        </p>
    </div>
    <!--Tabela home de clientes-->
    <div class="table-container p-0 tabelaHome">
        <table class="table is-narrow is-bordered is-hoverable is-fullwidth">
            <thead>
                <tr class="has-background-dark has-text-light">
                    <th class="has-text-centered has-text-light">Id</th>
                    <th class="has-text-centered has-text-light">Cadastro</th>
                    <th class="has-text-centered has-text-light coluna-nome">Nome</th>
                    <th class="has-text-centered has-text-light">Tipo
                        <font-awesome-icon @click="abrirModalTipo()" :icon="['fas', 'plus']" class="has-background-info is-clickable"/>                    
                    </th>
                    <th class="has-text-centered has-text-light">CNPJ</th>
                    <th class="has-text-centered has-text-light">Email</th>
                    <th class="has-text-centered has-text-light">Telefone</th>
                    <th class="has-text-centered has-text-light" hidden>Endereço</th>
                    <th class="has-text-centered has-text-light" hidden>Bairro</th>
                    <th class="has-text-centered has-text-light">Cidade</th>
                    <th class="has-text-centered has-text-light">UF
                        <font-awesome-icon @click="abrirModalUF()" :icon="['fas', 'plus']" class="has-background-info is-clickable"/> 
                    </th>
                    <th class="has-text-centered has-text-light">Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cliente in filtroPesquisaNomeHome" :key="cliente.id"
                    class="has-text-centered is-vcentered">
                    <td class="is-vcentered">{{ cliente.id }}</td>
                    <td class="is-vcentered">{{ formatarDataBr(cliente.cadastro) }} </td>
                    <td class="is-vcentered coluna-nome">{{ cliente.nome }}</td>
                    <td class="is-vcentered">{{ cliente.tipo }}</td>
                    <td class="is-vcentered">{{ cliente.cnpj }}</td>
                    <td class="is-vcentered">{{ cliente.email }}</td>
                    <td class="is-vcentered">{{ cliente.telefone }}</td>
                    <td class="is-vcentered" hidden>{{ cliente.endereco }}</td>
                    <td class="is-vcentered" hidden>{{ cliente.bairro }}</td>
                    <td class="is-vcentered">{{ cliente.cidade }}</td>
                    <td class="is-vcentered">{{ cliente.uf }}</td>
                    <td class="is-vcentered">
                        <div class="field is-grouped">
                            <p class="control btn-tabela-home">
                                <button @click="abrirModalAlterar(cliente)" class="button is-small is-warning">
                                    <font-awesome-icon :icon="['fas', 'pen']"/>
                                </button>                                                                                 
                            </p>
                            <p class="control btn-tabela-home">
                                <button @click="excluirRegistro(cliente)" class="button is-small is-danger">
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
                    <label class="label is-small">Id</label>
                    <div class="control">
                        <input v-model="dadosClientes.id" type="text" class="input is-small is-info has-background-white" disabled>
                    </div>
                </div>
                <!--Nome-->
                <div class="field">
                    <label class="label is-small">Nome</label>
                    <div class="control">
                        <input v-model="dadosClientes.nome" type="text" :class="{'is-danger': !isNomeValido}" class="input is-info is-small">
                    </div>
                    <p v-show="!isNomeValido" class="help is-danger">Campo obrigatório : Insira um nome</p>
                </div>
                <!--Tipo-->
                <div class="field">
                    <label class="label is-small">Tipo</label>
                    <div class="control select is-small select is-info is-small is-hovered is-fullwidth"> 
                        <select v-model="dadosClientes.tipo">
                            <option v-for="selectDataTipo in selectDatasTipo" :key="selectDataTipo.id">{{ selectDataTipo.nome }}</option>
                        </select>
                    </div>
                </div>
                <!--CNPJ-->
                <div class="field">
                    <label class="label is-small">CPF / CNPJ</label>
                    <div class="control">
                        <input v-model="dadosClientes.cnpj" @input="atualizarCnpjVmaska($event.target.value)" type="text" class="input is-info is-small" v-maska :data-maska="vMaskaCnpj">
                    </div>
                </div>
                <!--Email-->
                <div class="field">
                    <label class="label is-small">E-mail</label>
                    <div class="control">
                        <input v-model="dadosClientes.email" type="email" class="input is-info is-small" placeholder="exemple@gmail.com" >
                    </div>
                </div>
            </div>
            <!--2a coluna do formulário-->
            <div class="column">
                <!--Telefone-->
                <div class="field"> 
                    <label class="label is-small">Telefone</label>
                    <div class="control">
                        <input v-model="dadosClientes.telefone" @input="atualizarTelefoneVmaska($event.target.value)" type="tel" class="input is-info is-small" placeholder="(xx) xxxxx-xxxx" v-maska :data-maska="vMaskaTelefone">
                    </div>
                </div>
                <!--Endereço-->
                <div class="field"> 
                    <label class="label is-small">Endereço</label>
                    <div class="control">
                        <input v-model="dadosClientes.endereco" type="text" class="input is-info is-small">
                    </div>
                </div>
                <!--Bairro-->
                <div class="field"> 
                    <label class="label is-small">Bairro</label>
                    <div class="control">
                        <input v-model="dadosClientes.bairro" type="text" class="input is-info is-small">
                    </div>
                </div>
                <!--Cidade-->
                <div class="field"> 
                    <label class="label is-small">Cidade</label>
                    <div class="control">
                        <input v-model="dadosClientes.cidade" type="text" class="input is-info is-small">
                    </div>
                </div>
                <!--UF-->
                <div class="field"> 
                    <label class="label is-small ">UF</label>
                    <div class="select is-info is-small is-fullwidth">
                        <select v-model="dadosClientes.uf">
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
                <table class="table is-bordered mt-3 is-fullwidth">
                    <tbody class="has-text-centered">
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

<!--Modal Cadastrar Tipo-->
<ModalCard :is-ativo="isModalTipoAtivo" titulo="Tipo de Cliente" @closeModalCard = "cancelarRegistroTipo()">
    <template #body>
        <div class="control" hidden>
            <input type="text" class="input is-small is-info" disabled>
        </div>
        <label for="" class="label is-small">Tipo</label>
        <div class="field is-grouped">
            <p class="control is-expanded">
                <input type="text" v-model="inputPesquisaTipo" class="input is-small is-info">
            </p>
            <p class="control">
                <button @click="abrirModalCadastrarTipo()" class="button is-small is-info">
                    <font-awesome-icon :icon="['fas', 'plus']" class="mr-1"/>
                    <span>Cadastrar</span> 
                </button>
            </p>
        </div>
        <table class="table is-bordered is-fullwidth" id="tabela-tipo-cliente">
            <thead>
                <tr>
                    <th v-for="tableHeader, index in tableHeadersTipo" :key="index" 
                        class="has-text-centered">
                        {{ tableHeader }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tipo in filtroPesquisaTipo" :key="tipo.id" class="has-text-centered">
                    <td class="is-vcentered" >{{ tipo.id }}</td>
                    <td class="is-vcentered">{{ tipo.nome }}</td>
                    <td class="is-vcentered">
                        <div class="field is-grouped">
                            <p class="control">
                                <button @click="abrirModalEditarTipo(tipo)" class="button is-small is-warning">
                                    <font-awesome-icon :icon="['fas', 'pen']"/>
                                </button>                                                                                 
                            </p>
                            <p class="control">
                                <button @click="excluirTipo(tipo)" class="button is-small is-danger ml-2">
                                    <font-awesome-icon :icon="['fas', 'trash']"/>
                                </button>
                            </p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </template>
    <template #footer>
        <button @click="inputPesquisaTipo = '' " class="button is-warning ml-2">Limpar</button>
        <button @click="cancelarRegistroTipo()" class="button is-danger">Cancelar</button>
    </template>
</ModalCard>

<!--Modal Cadastrar UF-->
<ModalCard :is-ativo="isModalUFAtivo" titulo="UF" @closeModalCard = "cancelarRegistroUF()">
    <template #body>
        <div class="control" hidden>
            <input type="text" class="input is-small is-info" disabled>
        </div>
        <label for="" class="label is-small">UF</label>
        <div class="field is-grouped">
            <p class="control is-expanded">
                <input type="text" v-model="inputPesquisaUF" class="input is-small is-info">
            </p>
            <p class="control">
                <button @click="abrirModalCadastrarUF()" class="button is-small is-info">
                    <font-awesome-icon :icon="['fas', 'plus']" class="mr-1"/>
                    <span>Cadastrar</span> 
                </button>
            </p>
        </div>
        <table class="table is-bordered is-fullwidth" id="tabela-tipo-cliente">
            <thead>
                <tr>
                    <th v-for="tableHeader, index in tableHeadersUF" :key="index" 
                        class="has-text-centered">
                        {{ tableHeader }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="uf in filtroPesquisaUF" :key="uf.id" class="has-text-centered">
                    <td class="is-vcentered" >{{ uf.id }}</td>
                    <td class="is-vcentered">{{ uf.nome }}</td>
                    <td class="is-vcentered">
                        <div class="field is-grouped">
                            <p class="control">
                                <button @click="abrirModalEditarUF(uf)" class="button is-small is-warning">
                                    <font-awesome-icon :icon="['fas', 'pen']"/>
                                </button>                                                                                 
                            </p>
                            <p class="control">
                                <button @click="excluirUF(uf)" class="button is-small is-danger">
                                    <font-awesome-icon :icon="['fas', 'trash']"/>
                                </button>
                            </p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </template>
    <template #footer>
        <button @click="inputPesquisaUF = '' " class="button is-warning ml-2">Limpar</button>
        <button @click="cancelarRegistroUF()" class="button is-danger">Cancelar</button>
    </template>
</ModalCard>

</template>

