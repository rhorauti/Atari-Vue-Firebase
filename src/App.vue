<script setup>

import { defineAsyncComponent } from 'vue'
import { useStoreUsers } from '@/stores/UserStore'

const MenuInicial = defineAsyncComponent(() => import('@/components/MenuInicial.vue')) 

const userStore = useStoreUsers();

</script>

<style>

</style>

<template>

<MenuInicial v-show="userStore.userState.isLogado"></MenuInicial>

<router-view/>

</template>



