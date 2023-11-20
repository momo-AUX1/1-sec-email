<template>
  <ion-item v-if="message" :routerLink="`/message/${message.id}/${message.username}/${message.domain}`" :detail="false" class="list-item" @click="markAsRead(message)">
    <div slot="start" :class="!message.read ? 'dot dot-unread' : 'dot'"></div>
    <ion-label class="ion-text-wrap">
      <h2>
        {{ message.fromName }}
        <span class="date">
          <ion-note>{{ message.date }}</ion-note>
          <ion-icon aria-hidden="true" :icon="chevronForward" size="small" v-if="isIos()"></ion-icon>
        </span>
      </h2>
      <h3>{{ message.subject }}</h3>
      <p>
        {{ message.content }}
      </p>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
import { ref, watchEffect, onMounted } from 'vue';
import { LocalNotifications } from '@capacitor/local-notifications';

const props = defineProps({
  message: Object,
});

const isIos = () => {
  const win = window as any;
  return win && win.Ionic && win.Ionic.mode === 'ios';
};

const readMessages = ref(new Set());

const loadReadMessages = () => {
  const savedReadMessages = sessionStorage.getItem('readMessages');
  if (savedReadMessages) {
    readMessages.value = new Set(JSON.parse(savedReadMessages));
  }
};

const saveReadMessages = () => {
  sessionStorage.setItem('readMessages', JSON.stringify(Array.from(readMessages.value)));
};

loadReadMessages();

const markAsRead = (message : any) => {
  message.read = true;
  readMessages.value.add(message.id);
  saveReadMessages();
};

watchEffect(() => {
  if (props.message && readMessages.value.has(props.message.id)) {
    props.message.read = true;
  }
});

onMounted(async () => {
  //@ts-ignore
  if (!props.message.read  && !readMessages.value.has(props.message.id)) {
    await LocalNotifications.schedule({
      notifications: [
        {
          //@ts-ignore
          title: props.message.subject,
          //@ts-ignore
          body: `From: ${props.message.fromName}`,
          //@ts-ignore
          id: props.message.id,
          schedule: { at: new Date(Date.now()) },
        }
      ]
    });
  }
});
</script>


<style scoped>
.list-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.list-item ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

.list-item h2 {
  font-weight: 600;
  margin: 0;
  
  /**
   * With larger font scales
   * the date/time should wrap to the next
   * line. However, there should be
   * space between the name and the date/time
   * if they can appear on the same line.
   */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.list-item p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 95%;
}

.list-item .date {
  align-items: center;
  display: flex;
}

.list-item ion-icon {
  color: #c9c9ca;
}

.list-item ion-note {
  font-size: 0.9375rem;
  margin-right: 8px;
  font-weight: normal;
}

.list-item ion-note.md {
  margin-right: 14px;
}

.list-item .dot {
  display: block;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  align-self: start;
  margin: 16px 10px 16px 16px;
}

.list-item .dot-unread {
  background: var(--ion-color-primary);
}
</style>
