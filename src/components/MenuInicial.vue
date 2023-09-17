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

<style scoped>

.menu-navbar {
  position: fixed;
  top: 0; 
  width: 100%;
  z-index: 2;
}

.usuario-logado {
  border: 1px solid gray;
  border-radius: 1rem;
  padding: 0.5rem;
  margin: 0.3rem 0;
  font-size: 0.8rem;
}

.router-link-active {
  color: #fff;
  border: 1px solid #fff;
  border-left: 4px solid #fff;
  border-radius: 0.5rem;
  font-weight: 500;
  margin: 0.4rem 0;
}

.navbar-item {
  font-size: 0.9rem;
}

</style>

<template>

<section class="menu-navbar">
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link :to="{name: 'Home'}" class="navbar-item">
        <img src="@/img/logo.png" width="30">
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
        <router-link :to="{name: 'ProdutosView'}" class="navbar-item">Produtos</router-link>
        <router-link :to="{name: 'PedidoCompra'}" class="navbar-item">Compras</router-link>
        <!-- <router-link to="" class="navbar-item">Vendas</router-link>
        <router-link to="" class="navbar-item">Movimentações</router-link>
        <router-link to="" class="navbar-item">Relatórios</router-link> -->
        <router-link :to="{name: 'MiscView'}" class="navbar-item">Misc</router-link>
      </div>
      <div class="navbar-end mr-4 is-align-items-center">
        <span class="usuario-logado navbar-item mt-1">{{ userStore.user.email }}</span>
        <button v-show="userStore.userState.isLogado" @click="fazerLogOut" class="button is-info is-rounded navbar-item ml-4 p-4">
            <span class="icon"><font-awesome-icon :icon="['fas', 'right-from-bracket']" /></span>
            <span>Sign Out</span>
        </button>
      </div>
    </div>
  </nav>
</section>
    
    </template>