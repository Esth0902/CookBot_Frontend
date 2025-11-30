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
  IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem,
  IonPage, IonTitle, IonToolbar,
} from '@ionic/vue';
import { computed, ref } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import type { IngredientInput } from '@/services/aiAPI';
import { useAiRecipes } from '@/composables/useAiRecipes';
import AiRecipeResult from "@/components/AiRecipeResult.vue";
import Header from "@/components/Header.vue";

const {
  loadingAi,
  aiError,
  aiRecipe,
  aiRecipeTitles,
  getTitlesFromIngredients,
  getRecipeFromIngredients,
} = useAiRecipes();


const manualIngredients = ref<IngredientInput[]>([
  { name: '', quantity: 0, unit: '' },
]);

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

</script>

