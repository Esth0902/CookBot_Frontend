<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/authApi';
import {
  IonPage,
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
    <ion-content fullscreen class="login-content">
      <div class="login-logo-container">
        <img src="/LogoCookBot.png" alt="Logo" class="login-logo" />
      </div>

      <div class="login-card">
        <h1 class="login-title">Connexion à ton espace</h1>

        <p v-if="error" class="login-error">{{ error }}</p>

      <form @submit.prevent="handleSubmit">
        <ion-item class="login-input-item">
          <ion-label position="stacked">Nom d'utilisateur</ion-label>
          <ion-input v-model="username" autcomplete="username">
          </ion-input>
        </ion-item>

        <ion-item class="login-input-item">
          <ion-label position="stacked">Mot de passe</ion-label>
          <ion-input v-model="password" type="password" autocomplete="current-password"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" class="login-button" :disabled="loading">
          <ion-spinner v-if="loading" name="dots"/>
          <span v-else>Se connecter</span>
        </ion-button>
      </form>

        <ion-button fill="clear" class="login-register-button" router-link="/register">
        Créer mon compte
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>

/* ---- Layout ---- */

.login-content {
  --background: var(--ion-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.login-logo-container {
  text-align: center;
}

.login-logo {
  width: 70%;
  max-width: 260px;
}

.login-card {
  background: rgba(255, 255, 255, 0.06);
  padding: 25px 25px;
  border-radius: 16px;
  width:100%;
  max-width: 380px;
  justify-self: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
  margin: 0 10px;
}

.login-title {
  color: var(--ion-color-light);
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.6rem;
}

.login-error {
  color: var(--ion-color-secondary);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
}

/* ---- Inputs ---- */

.login-input-item {
  --color: var(--ion-color-light);
  border-radius: 10px;
  margin-bottom: 18px;
  border: 1px solid var(--ion-color-tertiary);
}

.login-input-item ion-label {
  font-size: 1.5rem;
  background: transparent;
  font-weight: 500;
  margin-bottom: 6px;
}

@media (max-width: 360px) {
  .login-input-item ion-label {
    font-size: 1.2rem;
  }
}

.login-input-item ion-input {
  color: var(--ion-text-color);
  background: transparent;
}

.login-button {
  margin-top: 10px;
  --background: var(--ion-color-primary);
  --background-activated: var(--ion-color-secondary);
  --border-radius: 10px;
  font-size: 1rem;
}

.login-register-button {
  margin-top: 10px;
  color: var(--ion-color-secondary);
  text-align: center;
}

</style>