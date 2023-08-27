<script setup>


</script>

<style scoped>

.container-principal {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1rem;
}

.btn-container {
    margin: 0.5rem 0.5rem;
}

div button {
    width: 100%;
    margin: 1rem 0;
}

</style>

<template>

    <div class="container-principal">
        <p class="title">Bem-vindo ao sistema Atari!</p>
        <p class="subtitle mb-0">Deseja ir para qual tela?</p>
        <div class="btn-container">
            <div class="columns">
                <div class="column">
                    <button class="button is-info is-medium">
                        <router-link :to="{name: 'ClientesView'}">Clientes</router-link>
                    </button>
                    <button class="button is-info is-medium">Fornecedores</button>
                    <button class="button is-info is-medium">Dados Cadastrais</button>
                </div>
                <div class="column">
                    <button class="button is-info is-medium">Pedido de Compras</button>
                    <button class="button is-info is-medium">Notas Fiscais</button>
                    <button class="button is-info is-medium">Relatórios</button>
                </div>
            </div>
        </div>
    </div>

</template>