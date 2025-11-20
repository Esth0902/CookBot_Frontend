<template>
  <ion-page>
    <ion-content class="main-content ion-padding">
      <!-- Section d’introduction -->
      <section class="intro-section">
        <!-- Logo + titre -->
        <div class="intro-header">
          <img src="/public/LogoCookBot.png" alt="Logo MyCookBot" class="intro-logo" />
          <h1 class="app-title">Votre assistant culinaire intelligent</h1>
        </div>

        <p class="intro-text">
          <strong>MyCookBot</strong> transforme votre quotidien en cuisine !
          Grâce à son intelligence artificielle, il vous aide à créer des recettes
          à partir de vos ingrédients, planifier vos repas et générer vos listes de courses automatiquement.
        </p>

        <ion-button class="cta-button" color="secondary" router-link="/register">
          Créer mon compte
        </ion-button>
      </section>

      <!-- Section Tarifs -->
      <section class="pricing-section">
        <ion-card class="pricing-card">
          <ion-card-header>
            <ion-card-title>Choisissez votre formule</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-grid>
              <ion-row>
                <!-- Offre gratuite -->
                <ion-col size="12" size-md="6">
                  <ion-card class="plan-card">
                    <ion-card-header>
                      <ion-card-subtitle>Gratuit</ion-card-subtitle>
                      <ion-card-title>Free</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      Accès aux recettes de base, liste de courses manuelle, et navigation simple.
                    </ion-card-content>
                    <ion-button expand="block" color="secondary" router-link="/home">
                      Continuer gratuitement
                    </ion-button>
                  </ion-card>
                </ion-col>

                <!-- Offre Pro -->
                <ion-col size="12" size-md="6">
                  <ion-card class="plan-card pro-card">
                    <ion-card-header>
                      <ion-card-subtitle>Essai 7 jours</ion-card-subtitle>
                      <ion-card-title>Pro</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      Recettes IA, gestion du frigo par photo, favoris, et plus encore.
                    </ion-card-content>
                    <ion-button expand="block" color="primary">
                      Essayer gratuitement
                    </ion-button>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';
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
