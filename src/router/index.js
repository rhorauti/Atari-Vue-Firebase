import { createRouter, createWebHashHistory } from 'vue-router'
// import { useStoreUsers } from '@/stores/UserStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "BemVindo" */ '../views/BemVindo.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "LoginView" */ '../views/LoginView.vue')
  },
  {
    path: '/clientes',
    name: 'ClientesView',
    component: () => import(/* webpackChunkName: "ClientesView" */ '../views/ClientesView.vue')
  },
  {
    path: '/fornecedores',
    name: 'FornecedoresView',
    component: () => import(/* webpackChunkName: "FornecedoresView" */ '../views/FornecedoresView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const userStore = useStoreUsers();
//   if (!userStore.userState.isLogado && to.name != 'Login') {
//     next({name: 'Login'});
//   } else {
//     next();
//   }
// });

export default router
