<template>
 
    <div v-if="this.notificationAdicionar" class="notification has-background-primary is-flex " style="padding: 0.2rem !important; margin-bottom: 0.4rem !important;">
        <div class="is flex mb-1">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="has-text-light mt-2 ml-3"/>
            <span class="has-text-light ml-3">Item adicionado com sucesso!</span>
        </div>
        <button class="delete" @click="FecharNotificationAdicionar()"></button>
    </div>

    <div v-if="this.notificationAlterar" class="notification has-background-primary is-flex " style="padding: 0.2rem !important; margin-bottom: 0.4rem !important;">
        <div class="is flex mb-1">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="has-text-light mt-2 ml-3"/>
            <span class="has-text-light ml-3">Item alterado com sucesso!</span>
        </div>
        <button class="delete" @click="FecharNotificationAlterar()"></button>
    </div>

    <div v-if="this.notificationExcluir" class="notification has-background-primary is-flex " style="padding: 0.2rem !important; margin-bottom: 0.4rem !important;">
        <div class="is flex mb-1">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="has-text-light mt-2 ml-3"/>
            <span class="has-text-light ml-3">Item excluido com sucesso!</span>
        </div>
        <button class="delete" @click="FecharNotificationExcluir()"></button>
    </div>

</template>

<script>

    const notificationMessage = {
        name: 'NotificationMessage',
        props: {
            notificationExcluir: Boolean,
            notificationAlterar: Boolean,
            notificationAdicionar: Boolean
        },

        methods: {
            FecharNotificationAdicionar() {
                this.$emit('FecharNotificationAdicionar')
            },

            FecharNotificationAlterar() {
                this.$emit('FecharNotificationAlterar')
            },

            FecharNotificationExcluir() {
                this.$emit('FecharNotificationExcluir')
            }
        }
    }

    export default notificationMessage

</script>

<style>

</style>


  