import { defineStore } from 'pinia';

export const useStoreUsers = defineStore({
    state: () => ({
        userState: {
            isLogado: false,
            isAutenticado: false,
            isEmailValidado: false,
            temBemVindo: false
        },
        user: {
            id: 0,
            nome: null,
            email: null
        }
    })
})