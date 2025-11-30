<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Recettes</ion-title>

        </ion-toolbar>
      </ion-header>

    <ion-card class="ion-margin">
      <ion-card-header>
        <ion-card-title>Ingrédients dans mon frigo</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item v-for="(ing, index) in manualIngredients" :key="index">
          <ion-input
              label="Nom"
              label-placement="stacked"
              v-model="ing.name"
              placeholder="Tomates"
          />
          <ion-input
              label="Quantité"
              label-placement="stacked"
              type="number"
              v-model.number="ing.quantity"
              placeholder="4"
          />
          <ion-input
              label="Unité"
              label-placement="stacked"
              v-model="ing.unit"
              placeholder="pièces, g, ml..."
          />
          <ion-button
              fill="clear"
              color="danger"
              @click="removeIngredientRow(index)"
              :disabled="manualIngredients.length === 1"
          >
            X
          </ion-button>
        </ion-item>

        <ion-button
            expand="block"
            fill="outline"
            class="ion-margin-top"
            @click="addIngredientRow"
        >
          Ajouter un ingrédient
        </ion-button>

        <ion-button
            expand="block"
            class="ion-margin-top"
            :disabled="loadingAi || manualIngredientsCleaned.length === 0"
            @click="handleGenerateRecipeTitleFromManual"
        >
          <span v-if="!loadingAi">Générer des idées de recettes</span>
          <span v-else>Génération en cours...</span>
        </ion-button>
        <ion-button
            expand="block"
            class="ion-margin-top"
            :disabled="loadingAi || manualIngredientsCleaned.length === 0"
            @click="handleGenerateRecipeFromManual"
        >
          <span v-if="!loadingAi">Générer une recette complète</span>
          <span v-else>Génération en cours...</span>
        </ion-button>
      </ion-card-content>
    </ion-card>
      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>À partir d’un plat</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-input
                label="Nom du plat"
                label-placement="stacked"
                v-model="dishValue"
                placeholder="Omelette au fromage, pasta carbonara…"
            />
          </ion-item>

          <ion-button
              expand="block"
              class="ion-margin-top"
              :disabled="loadingAi || dishValueCleaned.length === 0"
              @click="handleGenerateRecipeFromDish"
          >
            <span v-if="!loadingAi">Générer une recette depuis ce plat</span>
            <span v-else>Génération en cours...</span>
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Mes recettes sauvegardées</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-if="recipeError" class="ion-padding-top">
            <ion-text color="danger">
              <p>{{ recipeError }}</p>
            </ion-text>
          </div>

          <ion-list v-if="recipes.length">
            <div
                v-for="rec in recipes"
                :key="rec.id"
            >
              <ion-item>
                <ion-label @click="toggleExpanded(rec)" class="recipe-title-label">
                  <h3 class="recipe-title-clickable">{{ rec.name }}</h3>
                </ion-label>

                <ion-button
                    slot="end"
                    size="small"
                    fill="clear"
                    :color="rec.isFavorite ? 'danger' : 'medium'"
                    :disabled="togglingFavoriteID === rec.id"
                    @click.stop="toggleFavorite(rec)"
                >
                  <ion-icon :icon="rec.isFavorite ? heart : heartOutline" />
                </ion-button>

                <ion-button
                    slot="end"
                    size="small"
                    fill="clear"
                    color="danger"
                    :disabled="deletingRecipeID === rec.id"
                    @click.stop="removeRecipe(rec)"
                >
                  <ion-icon :icon="closeOutline" />
                </ion-button>
              </ion-item>

              <div
                  v-if="expandedRecipeId === rec.id"
                  class="ion-padding-start ion-padding-end ion-padding-bottom"
              >
                <AiRecipeResult
                    :ai-error="''"
                    :ai-recipe="rec"
                    :ai-recipe-titles="null"
                />
              </div>
            </div>
          </ion-list>

          <p v-else-if="!loadingRecipes" class="ion-padding-top">
            Aucune recette pour l’instant.
          </p>
        </ion-card-content>
      </ion-card>





      <AiRecipeResult
          :ai-error="aiError"
          :ai-recipe="aiRecipe"
          :ai-recipe-titles="aiRecipeTitles"
          :show-save-button="true"
      />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton, IonCard,
  IonCardContent,
  IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonText, IonTitle, IonToolbar, onIonViewWillEnter,
} from '@ionic/vue';
import { computed, ref } from 'vue';
import type {IngredientInput, Recipe} from '@/services/aiAPI';
import { useAiRecipes } from '@/composables/useAiRecipes';
import AiRecipeResult from "@/components/AiRecipeResult.vue";
import Header from "@/components/Header.vue";
import { useFavoriteRecipes } from '@/composables/useFavoriteRecipes';
import { heart, heartOutline, closeOutline } from 'ionicons/icons';

const {
  loadingAi,
  aiError,
  aiRecipe,
  aiRecipeTitles,
  getTitlesFromIngredients,
  getRecipeFromIngredients,
  getRecipeFromDish,
} = useAiRecipes();

const {
  loadingRecipes,
  recipeError,
  recipes,
  fetchRecipes,
  removeRecipe,
  deletingRecipeID,
  togglingFavoriteID,
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

function onToggleRecipeFavorite(rec: Recipe) {
  toggleFavorite(rec);
}


const manualIngredients = ref<IngredientInput[]>([
  { name: '', quantity: 0, unit: '' },
]);

const dishValue = ref('');
const dishValueCleaned = computed(() => dishValue.value.trim());

const manualIngredientsCleaned = computed(() =>
    manualIngredients.value.filter(
        (ing) => ing.name.trim() !== '' && !Number.isNaN(ing.quantity),
    ),
);

function addIngredientRow() {
  manualIngredients.value.push({
    name: '',
    quantity: 0,
    unit: '',
  });
}

function removeIngredientRow(index: number) {
  manualIngredients.value.splice(index, 1);
  if (manualIngredients.value.length === 0) {
    manualIngredients.value.push({ name: '', quantity: 0, unit: '' });
  }
}

const handleGenerateRecipeTitleFromManual = () =>
    getTitlesFromIngredients(manualIngredientsCleaned.value);

const handleGenerateRecipeFromManual = () =>
    getRecipeFromIngredients(manualIngredientsCleaned.value);

const handleGenerateRecipeFromDish = () =>
    getRecipeFromDish(dishValueCleaned.value);


</script>

