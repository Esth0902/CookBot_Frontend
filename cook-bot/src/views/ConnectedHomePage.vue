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
import type {Recipe} from '@/types/Recipe';

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

  return firstGroup.tips[0];
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
            <ion-button expand="default" fill="outline">Voir la recette</ion-button>
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
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

/* SECTION BIENVENUE */
.home-welcome {
  text-align: center;
  margin-top: 10px;
}

.home-welcome h1 {
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--ion-color-light);
  margin-bottom: 6px;
}

.home-welcome p {
  font-size: 1.05rem;
  color: var(--ion-text-color);
}

/* PUBLICITÉ */
.home-publicite {
  display: flex;
  justify-content: center;
}

.banner {
  width: 100%;
  max-width: 340px;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* === RECETTE PREMIUM === */
.home-recipe {
  margin-top: 0;
}

.home-recipe-card {
  background: var(--ion-background-color-step-100);
  padding: 22px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.18);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.home-recipe h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ion-color-light);
  margin-bottom: 12px;
}

.home-recipe-card h3 {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--ion-color-light);
  margin: 0;
}

.home-recipe-card p {
  color: var(--ion-text-color);
  font-size: 1.1rem;
  margin: 0;
}

.home-recipe-card ion-button {
  --background: var(--ion-color-primary);
  --border-radius: 12px;
  width: fit-content;   /* bouton non full width */
  padding: 0 20px;
  align-self: flex-start;
}

/* === ASTUCES === */
.home-tips {
  background: var(--ion-background-color-step-100);
  padding: 22px;
  border-radius: 20px;
  border-left: 6px solid var(--ion-color-secondary);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.home-tips h2 {
  font-size: 1.45rem;
  font-weight: 600;
  color: var(--ion-color-light);
  margin-bottom: 12px;
}

.home-tips p {
  font-size: 1.05rem;
  line-height: 1.45;
  color: var(--ion-text-color);
}

/* LOADING */
.home-loading-container {
  margin-top: 40px;
  text-align: center;
}


</style>
