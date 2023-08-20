import { defineStore } from 'pinia';

export const useStoreUsers = defineStore({
    id: 'users',
    state: () => ({
        userState: {
            isLogado: false,
            isAutenticado: false,
            isEmailValidado: false
        },
        user: {
            email: null
        }
    }),
})