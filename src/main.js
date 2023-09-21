import { createApp } from 'vue'
import App from './App.vue'
import Bulma from 'bulma'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faPen, faTrash, faMagnifyingGlass, faRepeat, faEye, faEyeSlash, faLock, faEnvelope, faRotateRight, faFloppyDisk, faExclamationTriangle, faChevronDown, faChevronUp, faRightFromBracket, faFileArrowUp, faBan, faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { db } from '@/firebase'
import { createPinia } from 'pinia'
 
library.add(faPlus, faPen, faTrash, faMagnifyingGlass, faRepeat, faEye, faEyeSlash, faLock, faEnvelope, faRotateRight, faFloppyDisk, faExclamationTriangle, faChevronUp, faChevronDown, faRightFromBracket, faFileArrowUp, faBan, faFile )
const pinia = createPinia()

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.use(db)
.use(router)
.use(Bulma)
.use(pinia)
.mount('#app')