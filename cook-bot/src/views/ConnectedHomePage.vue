<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonSpinner,
} from '@ionic/vue';

import Header from "@/components/Header.vue";
import {getToken, getUserPlan} from "@/services/authApi";
import { jwtDecode} from "jwt-decode";
import {onMounted, ref} from "vue";
import Pricing from "@/components/Pricing.vue";
import {generateDailyRecipe, Recipe, generateChefTip} from "@/services/aiAPI";

const username = ref("Utilisateur");
const token = getToken();
const userRole = getUserPlan();
const dailyRecipe = ref<Recipe | null>(null);
const chefTip = ref("");
const loading = ref(true);

if (token) {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded?.sub) username.value = decoded.sub;
  } catch {
    console.error("Token invalide");
  }
}

onMounted(async () => {
  loading.value = true;
  if (userRole === 'PREMIUM') {
    try {
      dailyRecipe.value = await generateDailyRecipe();
      chefTip.value = await generateChefTip();
    }
    catch (e) {
      console.error('Erreur de la génération de la recette quotidienne : ', e)
  }
}
  loading.value = false;
});



</script>

<template>
  <ion-page>
    <Header />
    <ion-content class="home-content">

      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Génération de ta recette...</p>
      </div>

      <div v-else>

      <!-- Section de bienvenue -->
      <section class="home-welcome">
        <h1>Bonjour {{username}}</h1>
        <p>Ravi de te revoir ! Prêt(e) à cuisiner quelque chose de délicieux ?
        </p>
      </section>

      <Pricing v-if="userRole === 'FREE'"/>

      <section v-if="userRole === 'PREMIUM'" class="home-permium">

        <div v-if="dailyRecipe" class="home-recipe">
          <h2>
            Recette du jour
          </h2>

          <div v-if="dailyRecipe" class="home-recipe-card">
            <h3>
              {{dailyRecipe.name}}
            </h3>
            <p>
              {{dailyRecipe.durationMinutes}} min
            </p>
            <ion-button expand="block" fill="outline">Voir la recette</ion-button>
          </div>
        </div>

          <div v-if="chefTip" class="home-tips">
          <h2>Astuces du chef</h2>
          <p>{{chefTip}}</p>
          </div>

      </section>
      </div>

    </ion-content>
  </ion-page>
</template>



<style scoped>

</style>
