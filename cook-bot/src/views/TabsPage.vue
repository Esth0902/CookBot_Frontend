<template>
  <ion-page>

    <ion-header>
      <ion-toolbar slot="end">
          <ion-tab-button tab='settings' href="/tabs/settings">
            <ion-icon :icon="personCircleOutline"></ion-icon>
          </ion-tab-button>
          <LogoutButton />
      </ion-toolbar>
    </ion-header>

    <ion-tabs>

      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="myfridge" href="/tabs/myfridge">
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

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import {
  settings,
  homeOutline,
  cameraOutline,
  cartOutline,
  sparklesOutline,
  heartOutline,
  personCircleOutline
} from 'ionicons/icons';
import LogoutButton from "@/components/LogoutButton.vue";
</script>
