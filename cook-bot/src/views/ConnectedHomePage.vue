<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonSpinner,
} from '@ionic/vue';

import Header from "@/components/Header.vue";
import {getToken, getUserPlan} from "@/services/authApi";
import { jwtDecode} from "jwt-decode";
import {computed, onMounted, ref} from "vue";
import Pricing from "@/components/Pricing.vue";
import {generateDailyRecipe} from "@/services/aiAPI";
import type {Recipe} from "@/types/Recipe";

const username = ref("Utilisateur");
const token = getToken();
const userRole = getUserPlan();
const dailyRecipe = ref<Recipe | null>(null);
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
    }
    catch (e) {
      console.error('Erreur de la génération de la recette quotidienne : ', e)
  }
}
  loading.value = false;
});

const firstTip = computed(() => {
  if (!dailyRecipe.value?.tips?.length) return null;

  const firstGroup = dailyRecipe.value.tips[0];
  if (!firstGroup?.tips?.length) return null;

  return firstGroup.tips[0]; // 👉 la toute première astuce
});



</script>

<template>
  <ion-page>
    <Header />
    <ion-content class="home-content">

      <div v-if="loading" class="home-loading-container">
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

        <div v-if="userRole === 'FREE'" class="home-publicite">
          <img src="/publicite.png" alt="Publicité CookBot" class="banner" />
        </div>

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

          <div v-if="dailyRecipe?.tips" class="home-tips">
          <h2>Astuces du chef</h2>
            <p>{{firstTip}}</p>
          </div>

      </section>
      </div>

    </ion-content>
  </ion-page>
</template>



<style scoped>
.home-content {
  padding: 20px;
}

.home-loading-container {
  text-align: center;
  margin-top: 40px;
}

.home-welcome {
  margin-bottom: 25px;
}

.home-welcome h1 {
  font-size: 24px;
  font-weight: bold;
}
.home-welcome p {
  color: #6666;
}

.home-publicite {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.banner {
  width: 250%;
  max-width: 300px;
  height: auto;
  display: block;
}

.home-recipe {
  margin-top: 20px;
}

.home-recipe h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.home-recipe-card {
  background:#fff;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.home-recipe-card h3 {
  margin-bottom: 6px;
}

.home-tips {
  background: #fdf7e3;
  border-left: 4px solid #f5c400;
  padding: 16px;
  border-radius: 8px;
  margin-top: 25px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.05);
}

.home-tips h2 {
  margin-bottom: 8px;
}

</style>
