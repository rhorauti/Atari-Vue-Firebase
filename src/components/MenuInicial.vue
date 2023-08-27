<script setup>

import { useStoreUsers } from '@/stores/UserStore'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { Loading, Notify } from 'notiflix'
import { useRouter } from 'vue-router'
 
const userStore = useStoreUsers();
const router = useRouter();

function fazerLogOut() {
  Loading.pulse();
  signOut(auth).then(() => {
    userStore.user.email = "";
    userStore.userState.isLogado = false;
    router.push({name: 'Login'});
    Notify.success('Logout realizado com sucesso!');
  }).catch(() => {
    Notify.failure('Erro ao fazer o logout');
  }).finally(() => {
    Loading.remove();
  })
}

</script>

<style>

.usuario-logado {
  border: 1px solid gray;
  border-radius: 1rem;
  padding: 0.5rem;
  margin: 0.5rem 0;
}

</style>

<template>

    <section>
      <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link :to="{name: 'Home'}" class="navbar-item">
            <img src="@/img/atari.png" width="60">
          </router-link>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-atari">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" id="navbar-atari">
          <div class="navbar-start">
            <router-link :to="{name: 'ClientesView'}" class="navbar-item">Clientes</router-link>
            <router-link :to="{name: 'FornecedoresView'}" class="navbar-item">Fornecedores</router-link>
            <router-link to="" class="navbar-item">Empresa</router-link>
            <router-link to="" class="navbar-item">Pedidos de Compra</router-link>
            <router-link to="" class="navbar-item">Notas Fiscais</router-link>
            <router-link to="" class="navbar-item">Relatórios</router-link>
          </div>
          <div class="navbar-end mr-4 is-align-items-center">
            <span class="usuario-logado navbar-item">{{ userStore.user.email }}</span>
            <button v-show="userStore.userState.isLogado" @click="fazerLogOut" class="button is-small is-info navbar-item ml-4">Sign Out</button>
          </div>
        </div>
      </nav>
    </section>
    
    </template>