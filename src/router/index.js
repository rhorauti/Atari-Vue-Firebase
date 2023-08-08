import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "ClientesView" */ '../views/BemVindo.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "ClientesView" */ '../views/LoginView.vue')
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

router.beforeEach((to, from, next) => {
  // const store = useStore();
  const usuarioLogado = true;
  if (!usuarioLogado && to.name != 'Login') {
    next({name: 'Login'});
  } else {
    
    next();
  }
});

export default router
