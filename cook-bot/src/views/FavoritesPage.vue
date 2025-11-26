<template>


  <ion-page>
    <Header />
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
        <ion-item
            v-for="(rec, idx) in favoriteRecipes"
            :key="idx"
            button
            @click="selectFavorite(rec)"
        >
          <ion-label>
            <h3>{{ rec.name }}</h3>
            <p>Durée : {{ rec.durationMinutes }} min</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <p v-else-if="!loadingFavorites" class="ion-padding-top">
        Aucune recette favorite pour l’instant.
      </p>
    </ion-card-content>
  </ion-card>
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
  IonPage
} from '@ionic/vue';
import type { Recipe } from '@/services/aiAPI';
import { useFavoriteRecipes } from '@/composables/useFavoriteRecipes';
import { useAiRecipes } from '@/composables/useAiRecipes';
import Header from "@/components/Header.vue";

const { aiRecipe } = useAiRecipes();
const {
  loadingFavorites,
  favoritesError,
  favoriteRecipes,
  fetchFavoriteRecipes,
} = useFavoriteRecipes();


function selectFavorite(rec: Recipe) {
  aiRecipe.value = rec;
}
</script>
