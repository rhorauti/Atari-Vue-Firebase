<script setup>

import { db } from '@/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Confirm, Loading, Notify } from 'notiflix';
import { computed, onMounted, ref, defineProps, defineEmits } from 'vue';
import ModalCard from '@/components/ModalCard.vue';

const tableHeadersTipo = ['Id', 'Tipo', 'Ação']
const selectDatasTipo = ref([]);

const props = defineProps({
    isModalTipoAtivo: Boolean
})

defineEmits(['closeModalCardTipo']);

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
    selectDatasTipo.value.sort((a, b) => (a.id > b.id) ? 1 : -1)
}

onMounted(() => {
    atualizarDadosTipo();
});

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
            Loading.pulse();
            const docRef = doc(db, 'tipos', tipo.id);
            deleteDoc(docRef).then(() => {
                atualizarDadosTipo();
                Notify.success("Registro excluido com sucesso!");
            }).catch(() => {
                Notify.failure('Erro ao excluir o tipo!');
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

<ModalCard :is-ativo="props.isModalTipoAtivo" titulo="Tipo de Cliente" @closeModalCard="closeModalCardTipo">
    <template #body>
        <div class="control" hidden>
            <input type="text" class="input is-info" disabled>
        </div>
        <!-- <label for="" class="label">Tipo</label> -->
        <div class="field is-grouped">
            <p class="control is-expanded">
                <input type="text" v-model="inputPesquisaTipo" class="input is-info">
            </p>
            <p class="control">
                <button @click="abrirModalCadastrarTipo()" class="button is-info">
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
                <tr v-for="tipo in filtroPesquisaTipo.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)" :key="tipo.id" class="has-text-centered">
                    <td class="is-vcentered" >{{ tipo.id }}</td>
                    <td class="is-vcentered">{{ tipo.nome }}</td>
                    <td class="is-vcentered">
                        <div class="field is-grouped is-justify-content-center">
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
        <button @click="$emit('closeModalCardTipo')" class="button is-danger">Cancelar</button>
    </template>
</ModalCard>

</template>
