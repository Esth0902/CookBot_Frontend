<template>
  <ion-page>
    <HeaderComponent />

    <ion-content fullscreen>
      <ion-card class="favorites-card ion-margin">
        <ion-card-header>
          <ion-card-title class="favorites-title">Mes recettes favorites</ion-card-title>
        </ion-card-header>

        <ion-card-content>

          <div v-if="favoriteRecipes.length" class="favorites-list">
            <ion-card
                v-for="rec in favoriteRecipes"
                :key="rec.id"
                class="favorites-item-card"
            >

              <ion-item lines="none">
                <ion-label
                    @click="toggleExpanded(rec)"
                    class="favorites-item-title"
                >
                  {{ rec.name }}
                </ion-label>

                <ion-button
                    slot="end"
                    size="small"
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
                  class="favorites-details"
              >
                <AiRecipeResult
                    :ai-error="''"
                    :ai-recipe="rec"
                    :ai-recipe-titles="null"
                />
              </div>

            </ion-card>
          </div>

          <p v-else-if="!loadingRecipes" class="favorites-empty-text">
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

import HeaderComponent from '@/components/HeaderComponent.vue';
import AiRecipeResult from '@/components/AiRecipeResult.vue';

const {
  loadingRecipes,
  recipeError,
  favoriteRecipes,
  togglingFavoriteID,
  fetchRecipes,
  toggleFavorite,
} = useFavoriteRecipes();

const expandedRecipeId = ref<number | null>(null);

onIonViewWillEnter(() => {
  fetchRecipes();
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

.favorites-title {
  font-weight: 700;
  color: var(--ion-color-light);
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 6px;
}


.favorites-card {
  border-radius: 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--ion-color-primary);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}


.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.favorites-item-card {
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--ion-color-primary);
  padding: 0;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  transition: 0.25s ease;
}

.favorites-item-card:hover {
  transform: translateY(-3px);
}


.favorites-item-title {
  font-size: 1.15rem;
  color: var(--ion-color-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.favorites-item-title:hover {
  color: var(--ion-color-primary);
  text-decoration: underline;
}


.favorites-heart-btn {
  --padding-start: 6px;
  --padding-end: 6px;
  --padding-top: 4px;
  --padding-bottom: 4px;
  font-size: 22px;
  transition: transform 0.2s;
}

.favorites-heart-btn:hover {
  transform: scale(1.2);
}

.favorites-details {
  padding: 14px 18px 18px;
  background: rgba(255,255,255,0.04);
  border-top: 1px solid var(--ion-color-primary);
  border-radius: 0 0 16px 16px;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}


.favorites-empty-text {
  text-align: center;
  opacity: 0.7;
  padding-top: 12px;
  font-style: italic;
  font-size: 1rem;
}

@media (max-width: 480px) {

  /* Carte principale */
  .favorites-card {
    padding: 2px !important;
    border-radius: 14px;
  }

  /* Titre */
  .favorites-title {
    font-size: 1,9rem;
    margin-bottom: 2px;
  }

  /* Liste */
  .favorites-list {
    gap: 10px;
  }

  /* Carte d’un élément */
  .favorites-item-card {
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  }

  /* Titre de recette */
  .favorites-item-title {
    font-size: 1rem;
  }

  /* Bouton favori */
  .favorites-heart-btn {
    --padding-start: 2px;
    --padding-end: 2px;
    --padding-top: 2px;
    --padding-bottom: 2px;
    font-size: 18px;
  }

  /* Détails de recette */
  .favorites-details {
    padding: 5px 5px 5px;
  }

  /* Message vide */
  .favorites-empty-text {
    font-size: 0.9rem;
    opacity: 0.6;
  }

  /* Ion-item interne */
  ion-item {
    --padding-start: 5px;
    --padding-end: 5px;
    --min-height: 42px;
  }
}
</style>