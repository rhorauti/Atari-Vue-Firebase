<template>
  <nav class="is-flex is-justify-content-center has-background-info-dark" role="navigation">
    <router-link to="/clientes">
        <img src="@/img/atari.png" width="45">
    </router-link>
    <router-link class="mx-2 my-2 button is-light is-outlined" style="font-size: 0.56rem;" to="/clientes">Clientes</router-link>
    <router-link class="mx-2 my-2 button is-light is-outlined" style="font-size: 0.56rem;" to="/fornecedores">Fornecedores</router-link>
  </nav>
  <router-view/>

</template>

<script>
  
</script>

<style>


</style>

