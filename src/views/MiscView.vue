<script setup>

import { ref } from 'vue'
import EmpresaView from './EmpresaView.vue';
import TipoEmpresa from './TipoEmpresa.vue'

const categoriaSelecionada = ref('');

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

</style>

<template>

<div class="container-principal">
    <div class="tabs is-centered mb-4">
        <ul>
            <li :class="{'is-active': categoriaSelecionada == 'CADASTRO_ATARI'}">
                <router-link class="has-text-light" to="/misc/empresas" @click="categoriaSelecionada = 'CADASTRO_ATARI'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Atari</span>
                </router-link>
            </li>
            <li :class="{'is-active': categoriaSelecionada == 'CADASTROS_TIPOS_EMPRESA'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'CADASTROS_TIPOS_EMPRESA'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Tipos de empresa</span>
                </a>
            </li>
            <li :class="{'is-active': categoriaSelecionada == 'CADASTROS_CC'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'CADASTROS_CC'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>Centro de custo</span>
                </a>
            </li>
            <li :class="{'is-active': categoriaSelecionada == 'CADASTROS_NCM'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'CADASTROS_NCM'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-floppy-disk']" /></span>
                    <span>NCM</span>
                </a>
            </li>
            <li :class="{'is-active': categoriaSelecionada == 'NOTIFICACOES'}">
                <a class="has-text-light" @click="categoriaSelecionada = 'NOTIFICACOES'">
                    <span class="icon is-small"><font-awesome-icon :icon="['fa', 'fa-exclamation-triangle']" /></span>
                    <span>Notificações</span>
                </a>
            </li>
        </ul>
    </div>


        <div v-show="categoriaSelecionada == 'CADASTRO_ATARI'">
            <EmpresaView></EmpresaView>
        </div>
        <div v-show="categoriaSelecionada == 'CADASTROS_TIPOS_EMPRESA'" style="width: 70%; margin: 0 auto;">
            <TipoEmpresa></TipoEmpresa>
        </div>
        <div v-show="categoriaSelecionada == 'CADASTROS_CC'" style="width: 70%; margin: 0 auto;">
            Centro de custos
        </div>
        <div v-show="categoriaSelecionada == 'CADASTROS_NCM'" style="width: 70%; margin: 0 auto;">
            NCM
        </div>
        <div v-show="categoriaSelecionada == 'NOTIFICACOES'">
            <p class="has-text-light">NOTIFICAÇÕES</p>
        </div>


</div>

</template>