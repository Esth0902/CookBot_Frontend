<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  IonLabel,
  IonText,
} from '@ionic/vue';
import type { Recipe, RecipeTitle } from '@/services/aiAPI';

defineProps<{
  aiError: string;
  aiRecipe: Recipe | null;
  aiRecipeTitles: RecipeTitle[] | null;
}>();
</script>

<template>
  <div>
    <div class="ion-padding" v-if="aiError">
      <ion-text color="danger">
        <p>{{ aiError }}</p>
      </ion-text>
    </div>

    <ion-card v-if="aiRecipeTitles && aiRecipeTitles.length" class="ion-margin">
      <ion-card-header>
        <ion-card-title>Idées de recettes</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item v-for="(rec, idx) in aiRecipeTitles" :key="idx">
            <ion-label>
              <h3>{{ rec.title }}</h3>
              <p>Durée : {{ rec.durationMinutes }} min</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <ion-card v-if="aiRecipe" class="ion-margin">
      <ion-card-header>
        <ion-card-title>{{ aiRecipe.name }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Durée : {{ aiRecipe.durationMinutes }} min</p>

        <h3>Ingrédients</h3>
        <ul>
          <li v-for="(ing, idx) in aiRecipe.ingredients" :key="idx">
            {{ ing.quantity }} {{ ing.unit }} - {{ ing.name }}
          </li>
        </ul>

        <h3>Étapes</h3>
        <ol>
          <li v-for="step in aiRecipe.steps" :key="step.stepNumber">
            {{ step.description }}
          </li>
        </ol>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<style scoped>

</style>