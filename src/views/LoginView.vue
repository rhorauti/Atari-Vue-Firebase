<script setup>

import { ref } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useStoreUsers } from '@/stores/UserStore'
import { Loading, Notify } from 'notiflix'
import { useRouter } from 'vue-router';

const isNovoUsuario = ref(false)
const email = ref('');
const senha1 = ref('');
const senha2 = ref('');
const storeUsers = useStoreUsers();
const router = useRouter()

function limparCamposFormulario() {
    email.value = '';
    senha1.value = '';
    senha2.value = '';
}

function abrirNovoCadastro() {
    isNovoUsuario.value = true;
    limparCamposFormulario();
}

function voltarTelaLogin() {
    isNovoUsuario.value = false;
    limparCamposFormulario();
}

function logarUsuario() {
    Loading.pulse()
    signInWithEmailAndPassword(auth, email.value, senha1.value).then((ObjectUser) => {
        storeUsers.user.email = ObjectUser.user.email;
        storeUsers.userState.isLogado = true;
        Notify.success(`Usuário ${ObjectUser.user.email} logado com sucesso!`);
        router.push({name: 'Home'});

    }).catch(() => {
        Notify.failure('E-mail ou senha inválida!')
    }).finally(() => {
        Loading.remove();
        limparCamposFormulario();
    })
}

function criarUsuario() {
    Loading.pulse()
    if(senha1.value != senha2.value) {
        Notify.failure('As senhas digitadas não são iguais!')
        Loading.remove()
        return
    }
    else if(senha1.value.length < 6) {
        Notify.failure('As senha digitada possui menos do que 6 caracteres!')
        Loading.remove()
        return
    }
     else {
        createUserWithEmailAndPassword(auth, email.value, senha2.value)
        .then((ObjectUser) => {
            Notify.success(`Usuario: ${ObjectUser.user.email} criado com sucesso!`);
            isNovoUsuario.value = false;
            console.log(auth.currentUser)
        }).catch(() => {
            Notify.failure('Erro ao criar o usuário');
        }).finally(() => {
            Loading.remove();
            limparCamposFormulario();
        })
    }
}

// function verificacaoEmail() {
//     Loading.pulse();
//     const user = auth.currentUser
//     user.sendEmailVerification().then(() => {
//         Notify.success('E-mail enviado para validação');
//     }).catch(() => {
//         Notify.failure('Erro ao enviar e-mail de validação!');
//     }).finally(() => {
//         Loading.remove();
//         limparCamposFormulario();
//     })
    
// }


</script>

<style scoped>

    #login-form {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }

</style>

<template>
    <div class="is-flex-direction-column is-align-items-center" id="login-form">
        <div>
            <img src="../img/atari.png" alt="" width="80">
        </div>
        <div class="field" style="width: 17rem;">
            <label v-show="!isNovoUsuario" for="" class="label has-text-centered">Login</label>
            <label v-show="isNovoUsuario" for="" class="label has-text-centered">Novo Usuário</label>
            <div class="field">
                <label for="">Usuário</label>
                <div class="control mt-1">
                    <input v-model="email" type="e-mail" class="input is-small is-info" placeholder="Digite o seu e-mail">
                </div>
            </div>
            <div class="field">
                <label for="">Senha</label>
                <div class="control mt-1">
                    <input v-model="senha1" type="password" class="input is-small is-info">
                </div>
            </div>
            <div v-show="isNovoUsuario" class="field">
                <label for="">Confirmar senha</label>
                <div class="control mt-1">
                    <input v-model="senha2" type="password" class="input is-small is-info">
                </div>
            </div>
            <!--Texto que irá aparecer se o usuário não está logado-->
            <div v-show="!isNovoUsuario" class="field">
                <p class="help mt-3 has-text-centered">Esqueceu a senha? 
                    <span class="has-text-info is-underlined" style="cursor: pointer;">
                        Redefinir senha
                    </span>
                </p>
                <div class="control">
                    <button class="button is-small is-info is-fullwidth mt-3" @click="logarUsuario(auth, email, senha)">
                        Entrar
                    </button>
                </div>
                <p class="help mt-2 has-text-centered">Não tem conta? 
                    <span @click="abrirNovoCadastro()" class="has-text-info is-underlined" style="cursor: pointer;">
                        Cadastre-se
                    </span>
                </p>
            </div>
            <!--Texto que irá aparecer se o usuário não é cadastrado-->
            <div v-show="isNovoUsuario" class="field">
                <p v-show="isNovoUsuario" class="help mt-2 has-text-centered">
                    Nova senha deve ter no mínino 6 caracteres
                </p>
                <div v-show="isNovoUsuario" class="control mt-3" @click="criarUsuario(auth, email, senha)">
                    <button class="button is-small is-info is-fullwidth">Criar</button>
                </div>
                <p v-show="isNovoUsuario" class="help mt-2 has-text-centered">Já possui uma conta? 
                    <span @click="voltarTelaLogin()" class="has-text-info is-underlined" style="cursor: pointer;">
                        Clique qui para fazer o login
                    </span>
                </p>
            </div>
        </div>
    </div>

</template>