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
import {getToken, getUserPlan} from "@/services/authApi";
import { jwtDecode} from "jwt-decode";
import {computed} from "vue";
import {ref} from "vue";

const username = ref("Utilisateur");
const token = getToken();
const userRole = getUserPlan();

if (token) {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded?.sub) username.value = decoded.sub;
  } catch {
    console.error("Token invalide");
  }
}






</script>

<style scoped>

</style>
