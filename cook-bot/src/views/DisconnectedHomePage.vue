<template>
  <ion-page>
    <ion-content fullscreen class="DHP-content">

      <!-- LOGO -->
      <section class="DHP-hero">
        <img src="/LogoCookBot.png" alt="CookBot Logo" class="DHP-logo" />

        <h1 class="DHP-title">Ton frigo n’a jamais été aussi créatif.</h1>
        <p class="DHP-subtitle">
          CookBot réinvente la cuisine pour te surprendre.
        </p>

        <div class="DHP-buttons">
          <ion-button expand="block" router-link="/login" class="DHP-button-primary">
            Se connecter
          </ion-button>

          <ion-button expand="block" router-link="/register" fill="clear" class="DHP-button-secondary">
            Créer un compte
          </ion-button>
        </div>
      </section>

      <div class="DHP-separator">
        <img src="/wave.png" alt="wave separator" />
      </div>

      <!-- FEATURES -->
      <section class="DHP-items-section">
        <div class="DHP-item">
          <ion-icon :icon="restaurantOutline"></ion-icon>
          <h3>Recettes intelligentes</h3>
          <p>Des recettes générées selon tes envies et ton frigo.</p>
        </div>

        <div class="DHP-item">
          <ion-icon :icon="flashOutline"></ion-icon>
          <h3>Ultra rapide</h3>
          <p>Des idées en quelques secondes grâce à CookBot AI.</p>
        </div>

        <div class="DHP-item">
          <ion-icon :icon="listOutline"></ion-icon>
          <h3>Liste de courses</h3>
          <p>CookBot génère automatiquement ta liste.</p>
        </div>
      </section>

      <div class="DHP-separator">
        <img src="/wave.png" alt="wave separator" />
      </div>

      <!-- PRICING -->
      <section class="DHP-pricing-section">
        <h2>Choisis ton plan</h2>
        <p>Simple. Flexible. Transparent.</p>

        <ion-button router-link="/tabs/pricing" class="DHP-pricing-btn">
          Voir les offres
        </ion-button>
      </section>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import {restaurantOutline, listOutline, flashOutline} from "ionicons/icons";
</script>

<style scoped>

.DHP-content {
  --background: var(--ion-background-color);
  padding: 0;
  text-align: center;
}

/* HERO */
.DHP-hero {
  padding-bottom: 20px;
}

.DHP-logo {
  width: 280px;
}

.DHP-title {
  color: var(--ion-color-light);
  font-size: 2rem;
  margin-bottom: 10px;
}

.DHP-subtitle {
  color: var(--ion-text-color);
  font-size: 1.1rem;
  margin-bottom: 25px;
}

.DHP-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px; /* limite la taille en web */
  margin: 0 auto;
}

.DHP-button-primary {
  --background: var(--ion-color-primary);
  --border-radius: 12px;
}

.DHP-button-secondary {
  --background: var(--ion-color-secondary);
  --border-radius: 12px;
  color: var(--ion-text-color);
}

/* ITEMS */
.DHP-items-section {
  background: var(--ion-background-color-step-100);
  display: flex;
  flex-direction: column;
  padding-top : 20px;
padding-bottom: 20px;}

.DHP-item ion-icon {
  font-size: 2.7rem;
  color: var(--ion-color-secondary);
  margin-bottom: 5px;
}

.DHP-item h3 {
  color: var(--ion-color-light);
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.DHP-item p {
  color: var(--ion-text-color);
}

/* PRICING */
.DHP-pricing-section {
  background: var(--ion-background-color-step-150);
  padding-bottom: 20px;
  color: var(--ion-color-light);

}

.DHP-pricing-section p {
  color: var(--ion-text-color);
}

.DHP-pricing-btn {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  width: 100%;
  max-width: 300px;
  margin: 20px auto 0;
  display: block;
}

/* SEPARATOR */

.DHP-separator {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  line-height: 0;
}
.DHP-separator img {
  width: 200px;
  max-width: 200px;
  margin: 0 auto;
  display: block;
}

</style>