<template>
  <ion-app>
    <ion-router-outlet />
    <CookieBanner />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import CookieBanner from "@/components/CookieBanner.vue";
</script>
