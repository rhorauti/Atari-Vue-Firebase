<script setup lang="ts">

enum NotificationType {
    INFO = 1,
    WARNING = 2,
    DANGER = 3,
    POWERUP = 4,
    TRUCK = 5,
    TAG = 6
}

const props = defineProps({
    tipo: Number as PropType<NotificationType>,
    isLight: { type: Boolean, default: true },
    showIcon: {type: Boolean, default: true},
    bigIcon: {type: Boolean, default: false},
    temDelete: {type: Boolean, default: false}
});

const emit = defineEmits(['deleteClick']);

let notificationClass = "is-warning";
let notificationIcon = "mdi-information";

switch(props.tipo){
    case NotificationType.WARNING:
        notificationClass = "is-warning";
        notificationIcon = "mdi-alert";
        break;
    case NotificationType.DANGER:
        notificationClass = "is-danger";
        notificationIcon = "mdi-alert";
        break;
    case NotificationType.POWERUP:
        notificationClass = "is-info";
        notificationIcon = "mdi-one-up";
        break;
    case NotificationType.TRUCK:
        notificationClass = "is-info";
        notificationIcon = "mdi-truck";
        break;
    case NotificationType.TAG:
        notificationClass = "is-info";
        notificationIcon = "mdi-tag";
        break;
    case NotificationType.INFO:
    default:
        notificationClass = "is-info";
        notificationIcon = "mdi-information";
        break;
}

</script>

<template>
    <div class="notification" :class="[notificationClass, {'is-light': props.isLight}, {'is-flex is-flex-row p-4': props.bigIcon}]">
        <button class="delete" v-if="props.temDelete" @click="emit('deleteClick')"></button>
        <span class="icon" :class="{'mr-3 is-large' : props.bigIcon}" v-if="props.showIcon"><i class="mdi" :class="[notificationIcon, {'mdi-36px' : props.bigIcon}]"></i></span>
        <span><slot></slot></span>
    </div>
</template>