<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/services/authApi';
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
const success = ref('');

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await register(username.value, password.value);
    success.value = 'Compte créé, tu peux te connecter 👌';

    // Option : redirection directe vers login
    setTimeout(() => {
      router.push('/login');
    }, 800);
  } catch (err: any) {
    console.error(err);
    error.value = err.message || 'Erreur lors de l’inscription';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Inscription</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="handleSubmit">
        <ion-item>
          <ion-label position="stacked">Nom d’utilisateur</ion-label>
          <ion-input v-model="username"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Mot de passe</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>

        <div class="ion-margin-top">
          <ion-button
              expand="block"
              type="submit"
              :disabled="loading"
          >
            <ion-spinner v-if="loading" name="dots" />
            <span v-else>S’inscrire</span>
          </ion-button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>

        <div class="ion-margin-top">
          <ion-button fill="clear" router-link="/login">
            J’ai déjà un compte
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 8px;
}
.success {
  color: green;
  margin-top: 8px;
}
</style>