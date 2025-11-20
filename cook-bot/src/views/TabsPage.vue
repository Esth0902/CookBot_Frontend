<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <img src="/public/LogoCookBot.png" alt="Logo CookBot" class="logo-header"/>
        </ion-buttons>
          <ion-buttons slot="end">
            <ion-button tab='settings' href="/tabs/settings">
              <ion-icon :icon="personCircleOutline" class="icon-header"></ion-icon>
          </ion-button>
        </ion-buttons>
        <LogoutButton class="icon-header"/>

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
