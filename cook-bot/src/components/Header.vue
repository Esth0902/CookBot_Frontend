<template>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <router-link to="/tabs/home" class="logo-link">
          <img :src="logo" alt="Logo CookBot" class="logo-header"/>
        </router-link>
      </ion-buttons>

      <ion-buttons slot="end">
        <ion-button tab='settings' href="/tabs/settings">
         <ion-icon :icon="personCircleOutline" class="icon-header"></ion-icon>
        </ion-button>
      </ion-buttons>
        <LogoutButton class="icon-header"/>
    </ion-toolbar>
  </ion-header>
</template>


<script setup lang="ts">
import {personCircleOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/vue";
import LogoutButton from "@/components/LogoutButton.vue";
import logo from '/LogoCookBot.png';
</script>