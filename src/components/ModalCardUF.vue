<script setup>

import { db } from '@/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Confirm, Loading, Notify } from 'notiflix';
import { computed, onMounted, ref, defineProps, defineEmits } from 'vue';
import ModalCard from './ModalCard.vue';

const props = defineProps({
    isModalUFAtivo: Boolean
});

defineEmits(['closeModalCardUF']);

const selectDatasUF = ref([]);

const tableHeadersUF = ['Id', 'UF', 'Ação']

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
    atualizarDadosUF() 
})

// Cancela e volta para o home da UF
// function cancelarRegistroUF() {
//     $emit('closeModalUF');
// }

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
            Loading.pulse();
            const docRef = doc(db, 'ufs', uf.id);
            deleteDoc(docRef).then(() => {
                atualizarDadosUF();
                Notify.success("Registro excluido com sucesso!");
            }).catch(() => {
                Notify.failure('Erro ao excluir a uf!')
            }).finally(() => {
                Loading.remove();
            });
        }
    )
}

</script>

<style>

</style>

<template>

<ModalCard :is-ativo="props.isModalUFAtivo" titulo="UF" @closeModalCard="closeModalCardUF">
    <template #body>
        <div class="control" hidden>
            <input type="text" class="input is-info" disabled>
        </div>
        <!-- <label for="" class="label is-small">UF</label> -->
        <div class="field is-grouped">
            <p class="control is-expanded">
                <input type="text" v-model="inputPesquisaUF" class="input is-info">
            </p>
            <p class="control">
                <button @click="abrirModalCadastrarUF()" class="button is-info">
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
                <tr v-for="uf in filtroPesquisaUF.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)" :key="uf.id" class="has-text-centered">
                    <td class="is-vcentered" >{{ uf.id }}</td>
                    <td class="is-vcentered">{{ uf.nome }}</td>
                    <td class="is-vcentered">
                        <div class="field is-grouped is-justify-content-center">
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
        <button @click="$emit('closeModalCardUF')" class="button is-danger">Cancelar</button>
    </template>
</ModalCard>

</template>

