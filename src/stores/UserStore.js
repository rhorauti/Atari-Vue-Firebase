import { defineStore } from 'pinia';

export const useStoreUsers = defineStore({
    id: 'users',
    state: () => ({
        users: [],
        userState: {
            isLogado: false,
            isAutenticado: false
        },
        user: {
            email: null,
            nome: null
        }
    })
})