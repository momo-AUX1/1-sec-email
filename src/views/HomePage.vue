<template>
  <ion-page>
    <ion-alert
    :is-open="isOpen"
    header="Temporary email"
    :message="alertMessage"
    :buttons="alertButtons"
    @didDismiss="setOpen(false)"
  ></ion-alert>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Inbox</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Inbox</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <MessageListItem v-for="message in messages" :key="message.id" :message="message" />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonAlert,
  IonIcon,
} from '@ionic/vue';
import MessageListItem from '@/components/MessageListItem.vue';
import { getMessages, Message } from '@/data/messages';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import {toastController} from '@ionic/vue';
import { arrowDownOutline, arrowUpOutline, add, cardOutline, cashOutline, personCircleOutline, arrowUpCircleOutline, arrowDownCircleOutline } from 'ionicons/icons';
var tempmail = ref()
const alertMessage = computed(() => `Your temporary email is ${tempmail.value}`);
var messages : any = ref([])
var name = ref()
var dom = ref()

const getmail = () => {
  axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1')
    .then((response) => {
      tempmail.value = response.data[0];
      setOpen(true);
      const [username, domain] = tempmail.value.split('@');
      console.log(username, domain);
      name.value = username
      dom.value = domain
      getMessagesFromApi(username, domain);
    })
    .catch((error) => {
      console.error(error);
    });
};

const getMessagesFromApi = async (username : any, domain : any) => {
  try {
    const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${name.value}&domain=${dom.value}`;
    const response = await axios.get(url);
    const apiMessages = response.data;

    const fetchedMessages = [];
    for (const apiMessage of apiMessages) {
      const messageContentResponse = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${name.value}&domain=${dom.value}&id=${apiMessage.id}`);
      const messageContent = messageContentResponse.data.textBody || messageContentResponse.data.htmlBody || "No content";

      fetchedMessages.push({
        fromName: apiMessage.from.split('@')[0],
        username:name.value,
        domain:dom.value,
        subject: apiMessage.subject,
        date: apiMessage.date,
        content: messageContent,
        reqd:false,
        id: apiMessage.id
      });
    }

    messages.value = fetchedMessages;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};


//const messages = ref<Message[]>(getMessages());

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    getMessagesFromApi(name, dom);
    ev.detail.complete();
  }, 3000);
};


const presentToast = async () => {
        const toast = await toastController.create({
          message: 'Email copied to clipboard',
          duration: 1000,
          position: 'bottom',
        });
        await toast.present();
}


const isOpen = ref(false);
const alertButtons = [
  {
    text: 'Copy',
    role: 'copy',
    handler: () => {
      if (tempmail.value) {
        navigator.clipboard.writeText(tempmail.value)
          .then(() => {
            presentToast();
            console.log('Email address copied to clipboard');
          })
          .catch(err => {
            console.error('Failed to copy email address: ', err);
          });
      }
    },
  },
  {
    text: 'OK',
    role: 'confirm',
    handler: () => {
      console.log('Alert confirmed');
    },
  },
];

const setOpen = (state: boolean) => {
    isOpen.value = state;
};

const checkForNewEmails = () => {
  if (name.value && dom.value) {
    getMessagesFromApi(name.value, dom.value);
  }
};

onMounted(() => {
  getmail();
  setInterval(checkForNewEmails, 3000)
})
</script>
