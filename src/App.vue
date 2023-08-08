  <script setup>

  import { defineAsyncComponent } from 'vue'
  
  const MenuInicial = defineAsyncComponent(() => import('@/components/MenuInicial.vue')) 

  </script>

  <style>
  
  body {
    font-size: 0.8rem;
  }
  
  </style>

<template>

<MenuInicial></MenuInicial>

</template>



