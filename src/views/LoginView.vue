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
    if(!window.localStorage.getItem('usuario')) return;
    email.value = JSON.parse(window.localStorage.getItem('usuario'));
    senha1.value = JSON.parse(window.localStorage.getItem('senha'));
})

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
    Loading.pulse();
    signInWithEmailAndPassword(auth, email.value, senha1.value).then((ObjectUser) => {
        if(!ObjectUser.user.emailVerified) { 
            Notify.failure(`Email: ${ObjectUser.user.email} não está validado!`);
            validarEmail();
        } else {
            storeUsers.user.email = ObjectUser.user.email;
            storeUsers.userState.isLogado = true;
            window.localStorage.setItem('usuario', JSON.stringify(email.value));
            window.localStorage.setItem('senha', JSON.stringify(senha1.value));
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
            window.localStorage.setItem('usuario', email.value);
            Notify.success(`Usuario: ${ObjectUser.user.email} criado com sucesso!`);
        }).catch(() => {
            Notify.failure('Erro ao criar o usuário');
        }).finally(() => {
            Loading.remove();
            limparCamposFormulario();
        })
    }
}

function validarEmail() {
    Loading.pulse();
    auth.languageCode = 'pt-BR';
    const user = auth.currentUser;
    console.log(user);
    sendEmailVerification(user).then(() => {
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
        sendPasswordResetEmail(auth, email.value).then(() => {
            Notify.success('E-mail de redefinição de senha enviado com sucesso!');
        }).catch(() => {
            Notify.failure('Erro ao enviar e-mail de redefinição de senha!');
        }).finally(() => {
            Loading.remove();
        })
    }
}


</script>

<style scoped>

    #login-form {
        display: flex;
        justify-content: center;
        margin-top: 2.5rem;
    }

</style>

<template>
    <div v-show="!isUsuarioCriado" class="is-flex-direction-column is-align-items-center" id="login-form">
        <div>
            <img src="../img/atari.png" alt="" width="80">
        </div>
        <div class="field" style="width: 17rem;">
            <label for="" class="label has-text-centered">{{ (!isNovoUsuario) ? 'Login' : 'Novo Usuário' }}</label>
            <div class="field">
                <label for="">E-mail</label>
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
                    <span @click="redefinirSenha()" class="has-text-info is-underlined" style="cursor: pointer;">
                        Redefinir senha
                    </span>
                </p>
                <div class="control">
                    <button class="button is-small is-info is-fullwidth mt-4" @click="logarUsuario">
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
                <div v-show="isNovoUsuario" class="control mt-3" @click="criarUsuario()">
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

    <div v-show="isUsuarioCriado" class="has-text-centered">
        <p>Email criado: <span class="has-text-weight-bold">{{ storeUsers.user.email }}</span></p>
        <p class="help is-danger mr-3 mb-2">Seu e-mail não está validado!</p>
        <button @click="validarEmail()" class="button is-info is-small">Validar e-mail</button>
    </div>

</template>