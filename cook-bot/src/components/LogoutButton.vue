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
    <ion-button @click="logout"
                style="--padding-start: 0; --padding-end: 0; width: 40px; height: 40px;"
    >
      <ion-icon :icon="logOutOutline"
                style="font-size: 32px; width: 32px; height: 32px; color: var(--ion-color-tertiary);"/>
    </ion-button>
  </ion-buttons>
</template>

<style scoped>

</style>