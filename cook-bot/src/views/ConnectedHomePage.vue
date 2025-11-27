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
import AiRecipeResult from '@/components/AiRecipeResult';

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
        <section class="home-section">
          <div class="home-card">
            <h1 class="home-card-title">Bonjour {{ username }}</h1>
            <p class="home-card-text">
              Ravi de te revoir ! Prêt(e) à cuisiner quelque chose de délicieux ?
            </p>
          </div>

          <div class="home-separator">
            <img src="/wave1.png" alt="separator" />
          </div>
        </section>



        <!-- SECTION FREE -->
        <div v-if="userRole === 'FREE'" class="home-free-section">
          <img src="/banner.png" alt="Publicité CookBot" class="banner" />

          <div class="home-offer-card">
            <Pricing />
          </div>

          <div class="home-separator">
            <img src="/wave1.png" alt="separator"/>
          </div>
        </div>


        <!-- SECTION PREMIUM -->
        <section v-if="userRole === 'PREMIUM'" class="home-premium">

          <!-- Recette du jour -->
          <div v-if="dailyRecipe" class="home-section">
            <div class="home-card">
              <h2 class="home-card-title">Recette du jour</h2>

              <AiRecipeResult
              :ai-error="dailyRecipe"
              :ai-recipe="dailyRecipe"
              :ai-recipe-titles="dailyRecipe.name"
              />

              <h3 class="home-card-sub">{{ dailyRecipe.name }}</h3>
              <p class="home-card-text">{{ dailyRecipe.durationMinutes }} min</p>
              <p>{{dailyRecipe.ingredients}}</p>
              <p>{{dailyRecipe.steps}}</p>


              <ion-button
                  size="small"
                  fill="outline"
                  class="home-card-btn"
              >
                Voir la recette
              </ion-button>
            </div>

            <div class="home-separator">
              <img src="/wave1.png" alt="separator" />
            </div>
          </div>


          <!-- Astuce du chef -->
          <div v-if="firstTip" class="home-section">
            <div class="home-card">
              <h2 class="home-card-title">Astuce du chef</h2>
              <p class="home-card-text">{{ firstTip }}</p>
            </div>
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

.home-free-section {
  display: flex;
  flex-direction: column;
  align-items: center;   /* centre HORIZONTAL */
  gap: 20px;             /* espace entre pub et card */
}

.banner {
  width: min(90%, 450px);
  display: block;
  margin: 0 auto;
  height: auto;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
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

.home-loading-container {
  margin-top: 40px;
  text-align: center;
}

/* SECTION WRAPPER */
.home-section {
  padding: 10px 10px;
}

/* CARD STYLE — comme Pricing */
.home-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  border: 1px solid var(--ion-color-primary);
  text-align: center;
  transition: 0.3s;
}

.home-card:hover {
  transform: translateY(-4px);
}

.home-card-title {
  color: var(--ion-color-light);
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.home-card-sub {
  color: var(--ion-color-secondary);
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.home-card-text {
  color: var(--ion-text-color);
  font-size: 1rem;
  margin-bottom: 15px;
}

.home-card-btn {
  --border-radius: 10px;
  --padding-start: 10px;
  --padding-end: 10px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  font-size: 0.9rem;
  width: auto;
  margin: 0 auto;
}

.home-separator img {
  width: 230px;
  margin: 15px auto 0;
  display: block;
}

</style>
