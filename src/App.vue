<script setup>

import { defineAsyncComponent } from 'vue'
import { useStoreUsers } from '@/stores/UserStore'

const MenuInicial = defineAsyncComponent(() => import('@/components/MenuInicial.vue')) 

const userStore = useStoreUsers();

</script>

  <style>
  
  body {
    font-size: 0.8rem;
  }
  
  </style>

<template>

<MenuInicial v-show="userStore.userState.isLogado"></MenuInicial>

<router-view/>

</template>



