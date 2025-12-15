<script setup lang="ts">
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonText, onIonViewWillEnter,
} from '@ionic/vue';
import { computed, ref, watch, nextTick } from 'vue';
import type {IngredientInput, Recipe} from '@/services/aiAPI';
import { useAiRecipes } from '@/composables/useAiRecipes';
import AiRecipeResult from "@/components/AiRecipeResult.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useFavoriteRecipes } from '@/composables/useFavoriteRecipes';
import { heart, heartOutline, closeOutline } from 'ionicons/icons';
import { useUserSettings } from '@/composables/useUserSettings';

const { loadUserSettings } = useUserSettings();

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
  recipeError,
  recipes,
  fetchRecipes,
  removeRecipe,
  deletingRecipeID,
  togglingFavoriteID,
  toggleFavorite,
} = useFavoriteRecipes();

const expandedRecipeId = ref<number | null>(null);

const contentRef = ref<any>(null);
const resultsRef = ref<HTMLElement | null>(null);

watch([aiRecipe, aiRecipeTitles], async ([newRecipe, newTitles]) => {
  if (newRecipe || (newTitles && newTitles.length > 0)) {
    await nextTick();
    setTimeout(() => {
      if (contentRef.value && resultsRef.value) {
        const y = resultsRef.value.offsetTop;
        console.log("Tentative de scroll vers :", y);
        contentRef.value.$el.scrollToPoint(0, y - 60, 600);
      }
    }, 150);

  }
});

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

const handleGenerateRecipeFromTitle = async (title: string) => {
  dishValue.value = title
  await handleGenerateRecipeFromDish()
}


</script>

<template>
  <ion-page>
    <HeaderComponent />

    <ion-content fullscreen class="recipes-content" ref="contentRef">

      <!-- SECTION : INGREDIENTS -->
      <section class="recipes-section">
        <div class="recipes-card">

          <h2 class="recipes-card-title">Générer une recette à partir d'ingrédients</h2>

          <!-- INPUTS D'INGRÉDIENTS -->
          <div
              class="recipes-input-row"
              v-for="(ing, index) in manualIngredients"
              :key="index"
          >
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
                placeholder="g, ml, pièces…"
            />

            <ion-button
                fill="clear"
                class="delete-icon-btn"
                @click="removeIngredientRow(index)"
                :disabled="manualIngredients.length === 1"
            >
              <ion-icon :icon="closeOutline" />
            </ion-button>
          </div>

          <!-- AJOUTER UN INGREDIENT -->
          <ion-button
              expand="block"
              fill="outline"
              class="recipes-btn recipes-btn-secondary ion-margin-top"
              @click="addIngredientRow"
          >
            Ajouter un ingrédient
          </ion-button>

          <!-- GENERER TITRES -->
          <ion-button
              expand="block"
              class="recipes-btn ion-margin-top"
              :disabled="loadingAi || manualIngredientsCleaned.length === 0"
              @click="handleGenerateRecipeTitleFromManual"
          >
            <span v-if="!loadingAi">Idées de recettes</span>
            <span v-else>Génération…</span>
          </ion-button>

          <!-- GENERER RECETTE COMPLETE -->
          <ion-button
              expand="block"
              class="recipes-btn ion-margin-top"
              :disabled="loadingAi || manualIngredientsCleaned.length === 0"
              @click="handleGenerateRecipeFromManual"
          >
            <span v-if="!loadingAi">Recette complète</span>
            <span v-else>Génération…</span>
          </ion-button>
        </div>

        <div class="recipes-separator">
          <img src="/wave1.png" alt="separator">
        </div>
      </section>



      <!-- SECTION : DISH INPUT -->
      <section class="recipes-section">
        <div class="recipes-card">
          <h2 class="recipes-card-title">Générer une recette à partir d’un plat</h2>

          <ion-item class="recipes-input-row">
            <ion-input
                label-placement="stacked"
                v-model="dishValue"
                placeholder="Ecrivez l'intitulé de la recette"
            />
          </ion-item>

          <ion-button
              expand="block"
              class="recipes-btn ion-margin-top"
              :disabled="loadingAi || dishValueCleaned.length === 0"
              @click="handleGenerateRecipeFromDish"
          >
            <span v-if="!loadingAi">Générer une recette</span>
            <span v-else>Génération…</span>
          </ion-button>
        </div>

        <div class="recipes-separator">
          <img src="/wave1.png" alt="separator">
        </div>
      </section>

      <!-- SECTION : RECETTES SAUVEGARDEES -->
      <section class="recipes-section">
        <div class="recipes-card">
          <h2 class="recipes-card-title">Mes recettes sauvegardées</h2>

          <div v-if="recipeError">
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

                <!-- FAVORI -->
                <ion-button
                    slot="end"
                    fill="clear"
                    :color="rec.isFavorite ? 'secondary' : 'medium'"
                    :disabled="togglingFavoriteID === rec.id"
                    @click.stop="toggleFavorite(rec)"
                    class="recipes-favorite-btn"
                >
                  <ion-icon :icon="rec.isFavorite ? heart : heartOutline" />
                </ion-button>

                <!-- SUPPRIMER -->
                <ion-button
                    class="delete-icon-btn"
                    slot="end"
                    fill="clear"
                    :disabled="deletingRecipeID === rec.id"
                    @click.stop="removeRecipe(rec)"
                >
                  <ion-icon :icon="closeOutline" />
                </ion-button>
              </ion-item>

              <!-- ZONE DÉPLIÉE -->
              <div
                  v-if="expandedRecipeId === rec.id"
                  class="recipes-expand-area"
              >
                <AiRecipeResult
                    :ai-error="''"
                    :ai-recipe="rec"
                    :ai-recipe-titles="null"
                />
              </div>

            </div>
          </ion-list>

          <p v-else>Aucune recette pour l’instant.</p>
        </div>

        <div class="recipes-separator">
          <img src="/wave1.png" alt="separator">
        </div>
      </section>


      <!-- IA RESULTAT -->
      <div ref="resultsRef">
        <AiRecipeResult
            :ai-error="aiError"
            :ai-recipe="aiRecipe"
            :ai-recipe-titles="aiRecipeTitles"
            :show-save-button="true"
            @select-title="handleGenerateRecipeFromTitle"
        />
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.recipes-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding-bottom: 120px;
}

/* Sections */
.recipes-section {
  padding: 10px 10px;
}

/* CARDS */
.recipes-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  border: 1px solid var(--ion-color-primary);
  text-align: center;
  transition: 0.3s;
}

.recipes-card:hover {
  transform: translateY(-4px);
}

.recipes-card-title {
  color: var(--ion-color-light);
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 600;
}

/* SEPARATEUR */
.recipes-separator img {
  width: 230px;
  margin: 15px auto 0;
  display: block;
}

/* INPUT ROW */
.recipes-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  margin-top: 12px;
}

/* DELETE BUTTON */
.delete-icon-btn {
  --color: var(--ion-color-primary);
  --padding-start: 4px;
  --padding-end: 4px;
  --padding-top: 4px;
  --padding-bottom: 4px;

  width: 34px;
  height: 34px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
}

.delete-icon-btn ion-icon {
  font-size: 22px;
}

.delete-icon-btn:hover {
  transform: scale(1.1);
}
/* BUTTONS */
.recipes-btn {
  --background: var(--ion-color-primary);
  --background-hover: var(--ion-color-tertiary);
  --border-radius: 10px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  color: var(--ion-text-color);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  max-width: 260px;
  margin: 8px auto 0;
}

.recipes-btn-secondary {
  --background: var(--ion-color-secondary);
  --background-hover: var(--ion-color-light);
}

.recipes-btn:disabled {
  opacity: 0.5;
}

/* LISTE DE RECETTES */
.recipe-title-clickable {
  font-size: 1.1rem;
  color: var(--ion-color-light);
  transition: 0.2s;
}

.recipe-title-clickable:hover {
  color: var(--ion-color-primary);
}

/* FAVORI BTN */
.recipes-favorite-btn {
  font-size: 26px;
  transition: 0.2s;
}

.recipes-favorite-btn:hover {
  transform: scale(1.15);
}

/* ZONE EXPAND */
.recipes-expand-area {
  margin-top: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--ion-color-primary);
  border-radius: 12px;
  padding: 14px;
}

/* RESPONSIVE */
@media (min-width: 768px) {
  .recipes-input-row {
    gap: 18px;
  }
}

@media (min-width: 900px) {
  .recipes-input-row {
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>

