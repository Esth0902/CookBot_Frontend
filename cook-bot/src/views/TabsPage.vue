<template>
  <ion-page>
    <ion-tabs>

      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button v-if="isPremium" tab="myfridge" href="/tabs/myfridge">
          <ion-icon :icon="cameraOutline" />
          <ion-label>Mon Frigo</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="shopping" href="/tabs/shopping">
          <ion-icon :icon="cartOutline" />
          <ion-label>Courses</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="recipes" href="/tabs/recipes">
          <ion-icon :icon="sparklesOutline" />
          <ion-label>Recettes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favorites" href="/tabs/favorites">
          <ion-icon :icon="heartOutline" />
          <ion-label>Favoris</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped>
ion-tab-bar {
  --color: rgba(255, 255, 255, 0.55);
  --color-selected: var(--ion-color-primary);
}


</style>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import {
  homeOutline,
  cameraOutline,
  cartOutline,
  sparklesOutline,
  heartOutline,
} from 'ionicons/icons';
import { useUserSettings } from '@/composables/useUserSettings';
import {onIonViewWillEnter} from "@ionic/vue";
const { isPremium, checkPremiumStatus } = useUserSettings();

onIonViewWillEnter(() => {
  checkPremiumStatus();
});

</script>
