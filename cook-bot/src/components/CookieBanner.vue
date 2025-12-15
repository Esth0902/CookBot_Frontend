<template>
  <transition name="slide-up">
    <div v-if="showBanner" class="cookie-banner">
      <div class="cookie-content">
        <h3>🍪 Cookies & Confidentialité</h3>
        <p>
          Nous utilisons des cookies essentiels pour assurer le bon fonctionnement de l'application (authentification, préférences).
          En continuant, vous acceptez notre politique de confidentialité.
        </p>
      </div>
      <div class="cookie-actions">
        <ion-button fill="clear" size="small" @click="openLegal" color="medium">
          En savoir plus
        </ion-button>
        <ion-button  size="small" @click="acceptCookies">
          Accepter
        </ion-button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';

const showBanner = ref(false);
const router = useRouter();

onMounted(() => {
  const consent = localStorage.getItem('cookie_consent');
  if (!consent) {
    setTimeout(() => { showBanner.value = true; }, 1000);
  }
});

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'true');
  showBanner.value = false;
}

function openLegal() {
  router.push('/legal');
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--ion-color-primary);
  padding: 20px;
  z-index: 9999; /* Toujours au-dessus */
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
  border-radius: 20px 20px 0 0;
}

.cookie-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--ion-color-light);
}

.cookie-content p {
  margin: 0 0 15px 0;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  line-height: 1.4;
}

.cookie-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Animation d'entrée */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>