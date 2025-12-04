<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register, login } from '@/services/authApi';
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
const success = ref('');

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await register(username.value, password.value);
    success.value = 'Compte créé, tu peux te connecter 👌';

    await login(username.value, password.value);
      router.push('/tabs/home');
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
    <ion-content fullscreen class="register-content">

      <div class="register-logo-container">
        <img src="/LogoCookBot.png" alt="Logo" class="register-logo" />
      </div>

      <div class="register-card">
        <h1 class="register-title">Créer un compte !</h1>

        <p v-if="error" class="register-error">{{ error }}</p>
        <p v-if="success" class="register-success">{{ success }}</p>

        <form @submit.prevent="handleSubmit">
        <ion-item class="register-input-item">
          <ion-label position="stacked">Nom d’utilisateur</ion-label>
          <ion-input v-model="username"></ion-input>
        </ion-item>

        <ion-item class="register-input-item">
          <ion-label position="stacked">Mot de passe</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>

          <ion-button
              expand="block"
              type="submit"
              :disabled="loading"
              class="register-button"
          >
            <ion-spinner v-if="loading" name="dots" />
            <span v-else>S’inscrire</span>
          </ion-button>
        </form>
        <ion-button fill="clear" class="register-login-button" router-link="/login">
          J’ai déjà un compte
        </ion-button>
        </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>

/* ---- Layout ---- */

.register-content {
  --background: var(--ion-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;}

.register-logo-container {
  text-align: center;
}

.register-logo {
  width: 70%;
  max-width: 260px;
}

.register-card {
  background: rgba(255, 255, 255, 0.06);
  padding: 25px 25px;
  border-radius: 16px;
  width:100%;
  max-width: 380px;
  justify-self: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
  margin: 0 10px;
}

.register-title {
  color: var(--ion-color-light);
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.6rem;
}

.register-error {
  color: var(--ion-color-secondary);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
}

/* ---- Inputs ---- */

.register-input-item {
  --color: var(--ion-color-light);
  border-radius: 10px;
  margin-bottom: 18px;
  border: 1px solid var(--ion-color-tertiary);
}

.register-input-item ion-label {
  font-size: 1.5rem;
  background: transparent;
  font-weight: 500;
  margin-bottom: 6px;
}

@media (max-width: 360px) {
  .register-input-item ion-label {
    font-size: 1.2rem;
  }
}

.register-input-item ion-input {
  color: var(--ion-text-color);
  background: transparent;
}

.register-button {
  margin-top: 10px;
  --background: var(--ion-color-primary);
  --background-activated: var(--ion-color-secondary);
  --border-radius: 10px;
  font-size: 1rem;
}

.register-login-button {
  margin-top: 10px;
  color: var(--ion-color-secondary);
  text-align: center;
}

</style>