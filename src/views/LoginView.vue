<script setup>

import { ref, onMounted } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { useStoreUsers } from '@/stores/UserStore'
import { Loading, Notify } from 'notiflix'
import { useRouter } from 'vue-router'

const isNovoUsuario = ref(false)
const isUsuarioCriado = ref(false);
const email = ref('');
const senha1 = ref('');
const senha2 = ref('');
const storeUsers = useStoreUsers();
const router = useRouter();

onMounted(() => {
    limparCamposFormulario();
    email.value = window.localStorage.getItem('usuarioRegistrado') ? JSON.parse(window.localStorage.getItem('usuarioRegistrado')) : email.value;
    senha1.value = window.localStorage.getItem('senhaRegistrada') ? JSON.parse(window.localStorage.getItem('senhaRegistrada')) : senha1.value;
})

function limparCamposFormulario() {
    email.value = '';
    senha1.value = '';
    senha2.value = '';
}

const isNotShowPassword = ref(true);

function abrirNovoCadastro() {
    isNovoUsuario.value = true;
    isNotShowPassword.value = true;
    limparCamposFormulario();
}

function voltarTelaLogin() {
    isNovoUsuario.value = false;
    isNotShowPassword.value = true;
    limparCamposFormulario();
}

function logarUsuario() {
    Loading.pulse();
    signInWithEmailAndPassword(auth, email.value, senha1.value).then((ObjectUser) => {
        if(!ObjectUser.user.emailVerified) { 
            Notify.failure(`Email: ${ObjectUser.user.email} não está validado!`);
            validarEmail();
        } else {
            storeUsers.user.email = ObjectUser.user.email;
            storeUsers.userState.isLogado = true;
            window.localStorage.setItem('usuarioRegistrado', JSON.stringify(email.value));
            window.localStorage.setItem('senhaRegistrada', JSON.stringify(senha1.value));
            limparCamposFormulario();
            router.push({name: 'Home'});
            Notify.success(`Usuário ${ObjectUser.user.email} logado com sucesso!`);
        }
        }).catch(() => {
            Notify.failure('E-mail ou senha inválida!')
        }).finally(() => {
            Loading.remove();
        })
}


function criarUsuario() {
    Loading.pulse()
    if(senha1.value != senha2.value) {
        Notify.failure('As senhas digitadas não são iguais!');
        Loading.remove();
        return;
    }
    else if(senha1.value.length < 6) {
        Notify.failure('As senha digitada possui menos do que 6 caracteres!');
        Loading.remove();
        return;
    }
     else {
        createUserWithEmailAndPassword(auth, email.value, senha1.value)
        .then((ObjectUser) => {
            isNovoUsuario.value = false;
            isUsuarioCriado.value = true;
            storeUsers.user.email = email.value
            window.localStorage.setItem('usuarioRegistrado', JSON.stringify(email.value));
            Notify.success(`Usuario: ${ObjectUser.user.email} criado com sucesso!`);
        }).catch(() => {
            Notify.failure('Erro ao criar o usuário');
        }).finally(() => {
            Loading.remove();
        })
    }
}

function validarEmail() {
    Loading.pulse();
    auth.languageCode = 'pt-BR';
    const user = auth.currentUser;
    console.log(user);
    const actionSettings = {
        url: 'http://localhost:8080/#/login'
    }
    sendEmailVerification(user, actionSettings).then(() => {
        limparCamposFormulario();
        isUsuarioCriado.value = false;
        Notify.success('E-mail enviado para validação');
    }).catch(() => {
        Notify.failure('Erro ao enviar e-mail de validação!');
    }).finally(() => {
        Loading.remove();
    })
}

function redefinirSenha() {
    Loading.pulse();
    if(email.value == "") {
        Notify.failure('Digite um e-mail válido!');
        Loading.remove();
    } else {
        auth.languageCode = 'pt-BR'; 
        const actionSettings = {
        url: 'http://localhost:8080/#/login'
        }
        sendPasswordResetEmail(auth, email.value, actionSettings).then(() => {
            Notify.success('E-mail de redefinição de senha enviado com sucesso!');
        }).catch(() => {
            Notify.failure('Erro ao enviar e-mail de redefinição de senha!');
        }).finally(() => {
            Loading.remove();
        })
    }
}


</script>

<style>

    #container-principal-login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .login-form {
        z-index: 1;
    }

    #background-login {
        position: absolute;
        margin-top: auto;
        margin-left: auto;
        padding: 2rem;
        width: 23rem;
        height: 31rem;
        background-color: black;
        opacity: 0.1;
        border-radius: 2rem;
        z-index: 0;
    }

    label {
        color: white;
    }

    .caixa-mensagem-validacao {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .help{
        color: white;
    }

    .link-form {
            color: lightblue;
            font-weight: 700;
            text-decoration: underline;
            cursor: pointer;
            pointer-events: all;
        }

</style>

<template>
<div v-show="!isUsuarioCriado" id="container-principal-login-form">
    <div>
        <img src="../img/atari.png" alt="" width="100">
    </div>
    <div class="field login-form" style="width: 17rem;">
        <label for="" class="label has-text-centered has-text-light is-size-5">{{ (!isNovoUsuario) ? 'Login' : 'Novo Usuário' }}</label>
        <div class="field">
            <label for="">E-mail</label>
            <div class="field">
                <p class="control has-icons-left mt-1">
                    <input v-model="email" type="e-mail" class="input is-info" placeholder="Digite o seu e-mail">
                    <span class="icon is-left">
                        <font-awesome-icon :icon="['fas', 'envelope']"/>
                    </span>
                </p>
            </div>
        </div>
        <div class="field">
            <label for="">Senha</label>
            <div class="field">
                <p class="control has-icons-left has-icons-right mt-1">
                    <input v-model="senha1" :type="(isNotShowPassword) ? 'password' : 'text'" class="input is-info">
                    <span class="icon is-left">
                        <font-awesome-icon :icon="['fas', 'lock']"/>
                    </span>
                    <span class="icon is-small is-right" @click="isNotShowPassword = !isNotShowPassword">
                        <font-awesome-icon :icon="(isNotShowPassword) ? ['fas', 'eye-slash'] : ['fas', 'eye']"/>
                    </span>
                </p>
            </div>
        </div>
        <div v-show="isNovoUsuario" class="field">
            <label for="">Confirmar senha</label>
            <div class="field">
                <p class="control has-icons-left has-icons-right mt-1">
                    <input v-model="senha2" :type="(isNotShowPassword) ? 'password' : 'text'" class="input is-info">
                    <span class="icon is-left">
                        <font-awesome-icon :icon="['fas', 'lock']"/>
                    </span>
                    <span class="icon is-right" @click="isNotShowPassword = !isNotShowPassword">
                        <font-awesome-icon :icon="(isNotShowPassword) ? ['fas', 'eye-slash'] : ['fas', 'eye']"/>
                    </span>
                </p>
            </div>
        </div>
        <!--Texto que irá aparecer se o usuário não está logado-->
        <div v-show="!isNovoUsuario" class="field">
            <p class="help mt-4 has-text-centered">Esqueceu a senha? 
                <span @click="redefinirSenha()" class="link-form">
                    Redefinir senha
                </span>
            </p>
            <div class="control">
                <button class="button is-info is-fullwidth mt-4" @click="logarUsuario">
                    Entrar
                </button>
            </div>
            <p class="help mt-4 has-text-centered">Não tem conta? 
                <span @click="abrirNovoCadastro()" class="link-form">
                    Cadastre-se
                </span>
            </p>
        </div>
        <!--Texto que irá aparecer se o usuário não é cadastrado-->
        <div v-show="isNovoUsuario" class="field">
            <p v-show="isNovoUsuario" class="help mt-2 has-text-centered">
                Nova senha deve ter no mínino 6 caracteres
            </p>
            <div v-show="isNovoUsuario" class="control mt-3" @click="criarUsuario()">
                <button class="button is-info is-fullwidth">Criar</button>
            </div>
            <p v-show="isNovoUsuario" class="help mt-2 has-text-centered">Já possui uma conta? 
                <span @click="voltarTelaLogin()" class="link-form">
                    Fazer o login
                </span>
            </p>
        </div>
    </div>

    <div id="background-login"></div>

    <div v-show="isUsuarioCriado" class="has-text-centered caixa-mensagem-validacao">
        <p class="is-size-5">Email criado: <span class="has-text-weight-bold">{{ storeUsers.user.email }}</span></p>
        <p class="is-size-6 has-text-danger mt-3 mr-3 mb-2">Seu e-mail não está validado!</p>
        <p class="is-size-6 has-text-danger mr-3 mb-3">Clique no botão baixo para enviarmos um e-mail de validação.</p>
        <button @click="validarEmail()" class="button is-info is-medium">Validar e-mail</button>
    </div>
</div>
        

</template>