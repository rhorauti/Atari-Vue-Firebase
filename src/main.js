import { createApp } from 'vue'
import App from './App.vue'
import Bulma from 'bulma'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTrashCan, faCircleCheck, faRepeat, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { db } from '@/firebase'

library.add(faPlus, faTrashCan, faCircleCheck, faRepeat, faFileCirclePlus )

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.use(db)
.use(router)
.use(Bulma)
.mount('#app')