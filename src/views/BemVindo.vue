<script setup>


</script>

<style>

.container-principal {
    position: relative;
    top: 3rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 1rem;
    height: 100vh;
}

.link-paginas {
    width: 100%;
    margin-bottom: 1rem;
}

.link-paginas:last-child {
    margin-bottom: 0;
}

</style>

<template>

<div class="container-principal">
    <p class="title has-text-light is-4 mb-4">Bem-vindo ao sistema Atari! Deseja ir para qual tela?</p>
    <div class="columns">
        <div class="column">
            <div class="box">
                <router-link :to="{name: 'ClientesView'}" class="button is-info is-medium link-paginas">Clientes</router-link>
                <router-link :to="{name: 'FornecedoresView'}" class="button is-info is-medium link-paginas">Fornecedores</router-link>
                <router-link :to="{}" class="button is-info is-medium link-paginas">Dados Cadastrais</router-link>
                <router-link :to="{}" class="button is-info is-medium link-paginas">Pedido de Compras</router-link>
                <router-link :to="{}" class="button is-info is-medium link-paginas">Notas Fiscais</router-link>
                <router-link :to="{}" class="button is-info is-medium link-paginas">Relatórios</router-link>
            </div>
        </div>
        <div class="column">
            <div class="box">
                <p class="title is-4">Avisos gerais do sistema</p>
                <ul>
                    <li>
                        Avisto teste 1
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

</template>