<script>


</script>

<style scoped>

    #login-form {
        display: flex;
        justify-content: center;
    }

</style>

<template>
    <div class="is-flex-direction-column is-align-items-center" id="login-form">
        <div>
            <img src="../img/atari.png" alt="" width="150">
        </div>
        <div class="field" style="width: 17rem;">
            <label for="" class="label has-text-centered">Login</label>
            <div class="field">
                <label for="">Usuário</label>
                <div class="control mt-1">
                    <input type="e-mail" class="input is-small is-info" placeholder="Digite o seu e-mail">
                </div>
            </div>
            <div class="field">
                <label for="">Senha</label>
                <div class="control mt-1">
                    <input type="password" class="input is-small is-info">
                </div>
                <p class="help mt-2 has-text-centered">Esqueceu a senha? 
                    <span class="has-text-info is-underlined" style="cursor: pointer;">
                        Redefinir senha
                    </span>
                </p>
            </div>
            <div class="control">
                <button class="button is-small is-info is-fullwidth">Entrar</button>
            </div>
            <p class="help mt-2 has-text-centered">Não tem conta? 
                <span class="has-text-info is-underlined" style="cursor: pointer;">
                    Cadastre-se
                </span>
            </p>
        </div>
    </div>

</template>