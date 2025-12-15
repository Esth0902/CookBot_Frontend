<template>
  <ion-page>
    <HeaderComponent />

    <ion-content fullscreen class="favorites-content">

      <section class="favorites-section">
        <div class="favorites-card">
          <h2 class="favorites-card-title">Mes recettes favorites</h2>

          <ion-list v-if="favoriteRecipes.length" class="favorites-list-container">
            <div v-for="rec in favoriteRecipes" :key="rec.id">

              <ion-item lines="none" class="favorite-item">
                <ion-label @click="toggleExpanded(rec)" class="favorite-title-label">
                  <h3 class="favorite-title-clickable">{{ rec.name }}</h3>
                </ion-label>

                <ion-button
                    slot="end"
                    fill="clear"
                    color="secondary"
                    :disabled="togglingFavoriteID === rec.id"
                    @click.stop="onToggleFavorite(rec)"
                    class="favorites-heart-btn"
                >
                  <ion-icon :icon="heart" />
                </ion-button>
              </ion-item>

              <div
                  v-if="expandedRecipeId === rec.id"
                  class="favorites-expand-area"
              >
                <AiRecipeResult
                    :ai-error="''"
                    :ai-recipe="rec"
                    :ai-recipe-titles="null"
                />
              </div>

            </div>
          </ion-list>

          <p v-else-if="!loadingRecipes" class="favorites-empty-text">
            Vous n'avez pas encore de recettes favorites.
          </p>

        </div>

        <div class="favorites-separator">
          <img src="/wave1.png" alt="separator">
        </div>
      </section>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonItem,
  IonLabel,
  IonPage,
  IonIcon,
  IonContent,
  onIonViewWillEnter,
} from '@ionic/vue';
import { ref } from 'vue';
import { heart } from 'ionicons/icons';

import type { Recipe } from '@/services/aiAPI';
import { useFavoriteRecipes } from '@/composables/useFavoriteRecipes';
import { useUserSettings } from '@/composables/useUserSettings';
import HeaderComponent from '@/components/HeaderComponent.vue';
import AiRecipeResult from '@/components/AiRecipeResult.vue';

const { loadUserSettings } = useUserSettings();
const {
  loadingRecipes,
  favoriteRecipes,
  togglingFavoriteID,
  fetchRecipes,
  toggleFavorite,
} = useFavoriteRecipes();

const expandedRecipeId = ref<number | null>(null);

onIonViewWillEnter(() => {
  fetchRecipes();
  loadUserSettings();
});

function toggleExpanded(rec: Recipe) {
  if (expandedRecipeId.value === rec.id) {
    expandedRecipeId.value = null;
  } else {
    expandedRecipeId.value = rec.id;
  }
}

function onToggleFavorite(rec: Recipe) {
  toggleFavorite(rec);
}
</script>

<style scoped>
/* --- STRUCTURE GLOBALE --- */
.favorites-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding-bottom: 120px;
}

.favorites-section {
  padding: 10px 10px;
}

/* --- CARTE PRINCIPALE (Glassmorphism) --- */
.favorites-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  border: 1px solid var(--ion-color-primary);
  text-align: center;
  transition: 0.3s;
}

.favorites-card:hover {
  transform: translateY(-4px);
}

.favorites-card-title {
  color: var(--ion-color-light);
  font-size: 1.6rem;
  margin-bottom: 20px;
  font-weight: 600;
}

/* --- LISTE & ITEMS --- */
.favorites-list-container {
  background: transparent;
  padding: 0;
}

.favorite-item {
  --background: transparent;
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.favorite-title-label {
  cursor: pointer;
}

.favorite-title-clickable {
  font-size: 1.15rem;
  color: var(--ion-color-light);
  font-weight: 500;
  margin: 0;
  transition: 0.2s;
}

.favorite-title-clickable:hover {
  color: var(--ion-color-primary);
}

/* --- BOUTON COEUR --- */
.favorites-heart-btn {
  font-size: 24px;
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
  transition: transform 0.2s;
}

.favorites-heart-btn:hover {
  transform: scale(1.15);
}

/* --- ZONE DÉPLIÉE --- */

.favorites-expand-area {
  margin-top: 10px;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 10px;

  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- TEXTE VIDE --- */
.favorites-empty-text {
  font-style: italic;
  opacity: 0.7;
  margin-top: 20px;
  font-size: 1rem;
}

/* --- IMAGE SEPARATEUR --- */
.favorites-separator img {
  width: 230px;
  margin: 15px auto 0;
  display: block;
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .favorites-content {
    padding: 16px;
  }
  .favorites-card {
    padding: 15px;
  }
  .favorites-card-title {
    font-size: 1.4rem;
  }
}
</style>