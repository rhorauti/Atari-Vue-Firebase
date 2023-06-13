import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
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

export default router
