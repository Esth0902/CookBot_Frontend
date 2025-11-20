<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/authApi';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    await login(username.value, password.value);
    router.push('/tabs/home');
  } catch (err: any) {
    console.error(err);
    error.value = err.message || 'Erreur de connexion';
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Connexion</ion-title>
      </ion-toolbar>

    </ion-header>
    <ion-content>
      <form @submit.prevent="handleSubmit">
      <h2>Bienvenue</h2>
        <ion-item>
          <ion-label position="stacked">Nom d'utilisateur</ion-label>
          <ion-input v-model="username" autcomplete="username">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Mot de passe</ion-label>
          <ion-input v-model="password" type="password" autocomplete="current-password"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" :disabled="loading">
          <ion-spinner v-if="loading" name="dots"/>
          <span v-else>Se connecter</span>
        </ion-button>

        <p v-if="error">{{ error }}</p>

        <ion-button fill="clear" router-link="/register">
        Créer un compte
        </ion-button>

      </form>
    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>