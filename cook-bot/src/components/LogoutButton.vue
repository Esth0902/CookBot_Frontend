<script setup lang="ts">

import { useRouter } from 'vue-router';
import { clearToken } from '@/services/authApi';
import { IonButtons, IonButton, IonIcon } from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';

const router = useRouter();

const logout = () => {
  clearToken();
  router.push('/login');
};
</script>

<template>
  <ion-buttons slot="end">
    <ion-button @click="logout">
      <ion-icon :icon="logOutOutline" slot="icon-only" />
    </ion-button>
  </ion-buttons>
</template>

<style scoped>

</style>