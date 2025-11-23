<template>
  <ion-page>
    <Header />
    <ion-content class="home-content">

      <!-- Section de bienvenue -->
      <div class="home-welcome">
        <h1>Bonjour {{}}</h1>
        <p> Prêt à cuisiner aujourd'hui ?</p>
      </div>

      <div>
        <Pricing />
      </div>

      <div>
        <p class="premium-msg">🌟 Merci d’être Premium !</p>
      </div>






    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
} from '@ionic/vue';

import Header from "@/components/Header.vue";
import Pricing from "@/components/Pricing.vue";

</script>

<style scoped>
/* === Structure générale === */
.main-content {
  --background: var(--ion-background-color);
  color: var(--ion-text-color);
  text-align: center;
  padding-top: 2rem;
}

/* === Introduction === */
.intro-section {
  margin-bottom: 3rem;
}

.intro-logo {
  width: 100px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 0.8rem;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(44, 206, 210, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin-bottom: 1rem;
}

.intro-text {
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  line-height: 1.6;
  font-size: 1rem;
  color: var(--ion-text-color);
}

.cta-button {
  font-weight: 600;
  border-radius: 10px;
  --background: var(--ion-color-secondary);
  --color: #26474E;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cta-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* === Section Tarifs === */
.pricing-section {
  margin-top: 2rem;
}

.pricing-card {
  background: var(--ion-color-tertiary);
  border-radius: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.plan-card {
  background: #ffffff;
  color: #26474E;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.pro-card {
  border: 2px solid var(--ion-color-primary);
}

ion-card-title {
  font-weight: 700;
  color: #26474E;
}

ion-card-subtitle {
  color: var(--ion-color-secondary);
  font-weight: 600;
}

/* === Responsive === */
@media (max-width: 768px) {
  .intro-text {
    font-size: 0.95rem;
  }
  .app-title {
    font-size: 1.5rem;
  }
}
</style>
