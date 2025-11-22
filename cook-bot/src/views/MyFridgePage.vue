<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>CookBot</ion-title>
        <LogoutButton />
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Mon frigo</ion-title>

        </ion-toolbar>
      </ion-header>

      <!-- PARTIE PHOTO (PREMIUM uniquement + si des photos existent) -->
      <ion-grid v-if="premium && photos.length">
        <ion-row>
          <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="ion-padding">
        <!-- Bouton IA par photo (PREMIUM) -->
        <ion-button
            v-if="premium"
            expand="block"
            :disabled="!photos.length || loadingAi"
            @click="handleGenerateRecipeTitleFromImage"
        >
          <ion-icon :icon="camera" slot="start" />
          <span v-if="!loadingAi">Générer des idées de recettes avec la photo</span>
          <span v-else>Génération en cours...</span>
        </ion-button>
        <ion-button
            v-if="premium"
            expand="block"
            :disabled="!photos.length || loadingAi"
            @click="handleGenerateRecipeFromImage"
        >
        <ion-icon :icon="camera" slot="start" />
        <span v-if="!loadingAi">Générer une recette complète avec la photo</span>
        <span v-else>Génération en cours...</span>
        </ion-button>
      </div>

      <!-- PARTIE LISTE MANUELLE (FREE + PREMIUM) -->
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
              @click="handleGenerateRecipeFromManual"
          >
            <span v-if="!loadingAi">Générer des recettes avec ces ingrédients</span>
            <span v-else>Génération en cours...</span>
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- ERREURS IA -->
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

      <!-- RECETTE IA -->
      <ion-card v-if="aiRecipe" class="ion-margin">
        <ion-card-header>
          <ion-card-title>{{ aiRecipe.name}}</ion-card-title>
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

      <!-- FAB PHOTO (PREMIUM uniquement) -->
      <ion-fab v-if="premium" vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonButton,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
} from '@ionic/vue';

import { ref, computed } from 'vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';
import LogoutButton from '@/components/LogoutButton.vue';
import { isPremiumUser } from '@/services/authApi';
import {
  generateRecipeFromImage,
  generateRecipeFromIngredients, generateRecipeTitleFromImage,
} from '@/services/aiAPI';
import type { Recipe, IngredientInput, RecipeTitle } from '@/services/aiAPI';

const { photos, takePhoto } = usePhotoGallery();

const premium = isPremiumUser();
const loadingAi = ref(false);
const aiError = ref('');
const aiRecipe = ref<Recipe | null>(null);
const aiRecipeTitles = ref<RecipeTitle[] | null>(null);

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

const handleGenerateRecipeTitleFromImage = async () => {
  aiError.value = '';
  aiRecipe.value = null;
  aiRecipeTitles.value = null;

  if (!photos.value.length) {
    aiError.value = 'Prends une photo d’abord';
    return;
  }

  const photo = photos.value[0];

  loadingAi.value = true;
  try {
    const titles = await generateRecipeTitleFromImage(photo);
    aiRecipeTitles.value = titles;
  } catch (err) {
    console.error(err);
    aiError.value =
        err instanceof Error
            ? err.message
            : 'Erreur lors de la génération des idées de recettes depuis la photo';
  } finally {
    loadingAi.value = false;
  }
};

const handleGenerateRecipeFromImage = async () => {
  aiError.value = '';
  aiRecipe.value = null;
  aiRecipeTitles.value = null;

  if (!premium) {
    aiError.value = 'La génération par photo est réservée aux comptes PREMIUM.';
    return;
  }

  if (!photos.value.length) {
    aiError.value = 'Prends une photo d’abord';
    return;
  }

  const photo = photos.value[0];

  loadingAi.value = true;
  try {
    const recipe = await generateRecipeFromImage(photo);
    aiRecipe.value = recipe;
  } catch (err) {
    console.error(err);
    aiError.value =
        err instanceof Error
            ? err.message
            : 'Erreur lors de la génération de la recette depuis la photo';
  } finally {
    loadingAi.value = false;
  }
};

const handleGenerateRecipeFromManual = async () => {
  aiError.value = '';
  aiRecipe.value = null;
  aiRecipeTitles.value = null;

  const ingredients = manualIngredientsCleaned.value;

  if (ingredients.length === 0) {
    aiError.value = 'Ajoute au moins un ingrédient';
    return;
  }

  loadingAi.value = true;
  try {
    const titles = await generateRecipeFromIngredients(ingredients);
    aiRecipeTitles.value = titles;
  } catch (err) {
    console.error(err);
    aiError.value =
        err instanceof Error
            ? err.message
            : 'Erreur lors de la génération de la recette depuis les ingrédients';
  } finally {
    loadingAi.value = false;
  }
};
</script>
