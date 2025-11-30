<template>
  <ion-page>
    <Header />

    <ion-content fullscreen>
      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Mes recettes favorites</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button
              expand="block"
              fill="outline"
              size="small"
              :disabled="loadingFavorites"
              @click="fetchFavoriteRecipes"
          >
            <span v-if="!loadingFavorites">Recharger les favoris</span>
            <span v-else>Chargement...</span>
          </ion-button>

          <div v-if="favoritesError" class="ion-padding-top">
            <ion-text color="danger">
              <p>{{ favoritesError }}</p>
            </ion-text>
          </div>

          <ion-list v-if="favoriteRecipes.length">
            <div
                v-for="rec in favoriteRecipes"
                :key="rec.id"
            >
              <ion-item>
                <ion-label @click="toggleExpanded(rec)" class="recipe-title-label">
                  <h3 class="recipe-title-clickable">
                    {{ rec.name }}
                  </h3>
                </ion-label>

                <ion-button
                    slot="end"
                    size="small"
                    fill="clear"
                    color="danger"
                    :disabled="togglingFavoriteID === rec.id"
                    @click.stop="onToggleFavorite(rec)"
                >
                  <ion-icon :icon="heart" />
                </ion-button>
              </ion-item>

              <div v-if="expandedRecipeId === rec.id" class="ion-padding-start ion-padding-end ion-padding-bottom">
                <AiRecipeResult
                    :ai-error="''"
                    :ai-recipe="rec"
                    :ai-recipe-titles="null"
                />
              </div>
            </div>
          </ion-list>

          <p v-else-if="!loadingFavorites" class="ion-padding-top">
            Aucune recette favorite pour l’instant.
          </p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonPage,
  IonIcon,
  IonContent,
  onIonViewWillEnter,
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { heart } from 'ionicons/icons';

import type { Recipe } from '@/services/aiAPI';
import { useFavoriteRecipes } from '@/composables/useFavoriteRecipes';

import Header from '@/components/Header.vue';
import AiRecipeResult from '@/components/AiRecipeResult.vue';

const {
  loadingFavorites,
  favoritesError,
  favoriteRecipes,
  togglingFavoriteID,
  fetchFavoriteRecipes,
  toggleFavorite,
} = useFavoriteRecipes();

const expandedRecipeId = ref<number | null>(null);

onIonViewWillEnter(() => {
  fetchFavoriteRecipes();
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
.recipe-title-label {
  cursor: pointer;
}

.recipe-title-clickable:hover {
  text-decoration: underline;
}
</style>