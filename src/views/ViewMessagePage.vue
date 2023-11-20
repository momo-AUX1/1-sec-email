<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="message">
      <ion-item>
        <ion-icon aria-hidden="true" :icon="personCircle" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">
          <h2>
            {{ message.fromName }}
            <span class="date">
              <ion-note>{{ message.date }}</ion-note>
            </span>
          </h2>
          <h3>To: <ion-note>Me</ion-note></h3>
        </ion-label>
      </ion-item>

      <div class="ion-padding">
        <h1>{{ message.subject }}</h1>
        <p>
          {{ message.content }}
        </p>
        <div v-if="message.attachments && message.attachments.length" class="attachments">
          <h3>Attachments:</h3>
          <ul>
            <li v-for="attachment in message.attachments" :key="attachment.filename">
              <a :href="generateDownloadLink(message.id, message.username, message.domain, attachment.filename)">
                {{ attachment.filename }} ({{ attachment.size }} bytes)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
} from '@ionic/vue';
import { personCircle } from 'ionicons/icons';
import axios from 'axios';

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Inbox' : '';
};

const route = useRoute();
//@ts-ignore
const messageId = parseInt(route.params.id, 10);
const username = route.params.username;
const domain = route.params.domain;
const message : any = ref(null);

const fetchSingleMessage = async (id : any, username : any, domain : any) => {
  try {
    const response = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${id}`);
    const apiMessage = response.data;

    message.value = {
      id: apiMessage.id,
      fromName: apiMessage.from,
      subject: apiMessage.subject,
      date: apiMessage.date,
      content: apiMessage.textBody || apiMessage.htmlBody || "No content",
      attachments: apiMessage.attachments || [],
      username,
      domain
    };
  } catch (error) {
    console.error("Error fetching the message:", error);
  }
};

const generateDownloadLink = (id : any, username : any, domain : any, filename : any) => {
  return `https://www.1secmail.com/api/v1/?action=download&login=${username}&domain=${domain}&id=${id}&file=${encodeURIComponent(filename)}`;
};

onMounted(() => {
  fetchSingleMessage(messageId, username, domain);
});
</script>

<style scoped>
ion-item {
  --inner-padding-end: 0;
  --background: transparent;
}

ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

ion-item .date {
  align-items: center;
  display: flex;
}

ion-item ion-icon {
  font-size: 42px;
  margin-right: 8px;
}

ion-item ion-note {
  font-size: 0.9375rem;
  margin-right: 12px;
  font-weight: normal;
}

h1 {
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
}

p {
  line-height: 1.4;
}
</style>
