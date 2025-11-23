<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>CookBot</ion-title>
        <LogoutButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Cookbot</ion-title>
        </ion-toolbar>
      </ion-header>

      <p class="intro-text">
        <strong>MyCookBot</strong> transforme votre quotidien en cuisine !
        Grâce à son intelligence artificielle, il vous aide à créer des recettes
        à partir de vos ingrédients, planifier vos repas et générer vos listes de courses automatiquement.
      </p>
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
      <ExploreContainer name="Tab 1 page" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonCardSubtitle, IonGrid, IonRow, IonCol, IonButton, IonCardContent
} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import LogoutButton from "@/components/LogoutButton.vue";
</script>
