<script setup lang="ts">
import {
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import {ref, withDefaults, watch, computed } from 'vue';
import { add, remove, peopleOutline } from 'ionicons/icons';
import type { Recipe, RecipeTitle } from '@/services/aiAPI';
import { createRecipe } from '@/services/recipeAPI'
import { useUserSettings } from '@/composables/useUserSettings';

const props = withDefaults(defineProps<{
  aiError: string;
  aiRecipe: Recipe | null;
  aiRecipeTitles: RecipeTitle[] | null;
  showSaveButton?: boolean;
}>(), {
  showSaveButton: false,
});

const emit = defineEmits<{
  (e: 'select-title', title: string): void;
}>();

const saving = ref(false);
const saveSuccess = ref(false);
const saveError = ref('');

watch(
    () => props.aiRecipe,
    () => {
      saving.value = false;
      saveSuccess.value = false;
      saveError.value = '';
    }
);

async function onSaveRecipe() {
  if (!props.aiRecipe) return;

  saving.value = true;
  saveError.value = '';
  saveSuccess.value = false;

  try {
    await createRecipe({
      name: props.aiRecipe.name,
      durationMinutes: props.aiRecipe.durationMinutes,
      isFavorite: true,
      ingredients: props.aiRecipe.ingredients,
      steps: props.aiRecipe.steps,
    });

    saveSuccess.value = true;
  } catch (err) {
    console.error(err);
    saveError.value =
        err instanceof Error
            ? err.message
            : 'Erreur lors de la sauvegarde de la recette';
  } finally {
    saving.value = false;
  }
}

const { nbPeople } = useUserSettings();
const currentServings = ref(1);

watch(() => props.aiRecipe, () => {
  if(props.aiRecipe) {
    currentServings.value = nbPeople.value || 1;
  }
}, {immediate: true});

function updateServings(delta: number) {
  const newVal = currentServings.value + delta;
  if (newVal >= 1 && newVal <= 50) {
    currentServings.value = newVal;
  }
}

function formatQuantity(num: number) {
  if (!num) return '';
  return Number.isInteger(num) ? num : parseFloat(num.toFixed(1));
}

const scaledIngredients = computed(() => {
  if (!props.aiRecipe || !props.aiRecipe.ingredients) return [];
  const ratio = currentServings.value
  return props.aiRecipe.ingredients.map(ing => {
    if (!ing.quantity) return ing;
    return {
      ...ing,
      quantity: ing.quantity * ratio
    };
  });
});

</script>

<template>
  <div>
    <!-- Erreur -->
    <div v-if="aiError" class="home-section">
      <div class="home-card home-card-error">
        <ion-text color="danger">
          <p class="home-card-text">{{ aiError }}</p>
        </ion-text>
      </div>

      <div class="home-separator">
        <img src="/wave1.png" alt="separator" />
      </div>
    </div>

    <!-- Idées de recettes (titres seulement) -->
    <div v-if="aiRecipeTitles && aiRecipeTitles.length" class="home-section">
      <div class="home-card">
        <h2 class="home-card-title">Idées de recettes</h2>

        <div class="recipe-ideas-list">
          <div
              v-for="(rec, idx) in aiRecipeTitles"
              :key="idx"
              class="recipe-idea-item"
              @click="emit('select-title', rec.title)"
          >
            <h3 class="recipe-idea-title">{{ rec.title }}</h3>
            <p class="recipe-idea-duration">{{ rec.durationMinutes }} min</p>
          </div>
        </div>
      </div>

      <div class="home-separator">
        <img src="/wave1.png" alt="separator" />
      </div>
    </div>

    <!-- Recette complète -->
    <div v-if="aiRecipe" class="home-section">
      <div class="home-card">
        <h2 class="home-card-title">{{ aiRecipe.name }}</h2>

        <div class="recipe-meta-row">
          <span class="home-card-text meta-time">{{ aiRecipe.durationMinutes }} min</span>

          <div class="servings-control">
            <ion-icon :icon="peopleOutline" class="servings-icon" />
            <ion-button size="small" fill="clear" @click="updateServings(-1)" class="servings-btn">
              <ion-icon :icon="remove" slot="icon-only" />
            </ion-button>

            <span class="servings-value">{{ currentServings }}</span>

            <ion-button size="small" fill="clear" @click="updateServings(1)" class="servings-btn">
              <ion-icon :icon="add" slot="icon-only" />
            </ion-button>
          </div>
        </div>

        <div v-if="showSaveButton" class="home-save-wrapper">
          <ion-button
              class="save-recipe-btn"
              size="small"
              :disabled="saving || saveSuccess"
              @click="onSaveRecipe"
          >
            <span v-if="!saving && !saveSuccess">Ajouter aux favoris</span>
            <span v-else-if="saving">Sauvegarde...</span>
            <span v-else>Recette sauvegardée ✔️</span>
          </ion-button>

          <p v-if="saveError" class="home-card-text" style="color: var(--ion-color-danger)">
            {{ saveError }}
          </p>
        </div>


        <div class="home-card-content fade-in">
          <div class="recipe-section">
            <h4 class="recipe-title">Ingrédients</h4>
            <ul class="recipe-list">
              <li v-for="(ing, idx) in scaledIngredients" :key="idx">
                <span class="ing-qty" v-if="ing.quantity">
                  {{ formatQuantity(ing.quantity) }} {{ ing.unit }}
                </span>
                <span class="ing-qty" v-else></span> <span class="ing-name">{{ ing.name }}</span>
              </li>
            </ul>
          </div>

          <!-- Étapes -->
          <div class="recipe-section">
            <h4 class="recipe-title">Étapes</h4>
            <ol class="recipe-steps">
              <li v-for="step in aiRecipe.steps" :key="step.stepNumber">
                {{ step.description }}
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div class="home-separator">
        <img src="/wave1.png" alt="separator" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-section {
  padding: 10px 10px;
}

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

.home-card-error {
  border-color: var(--ion-color-danger, #eb445a);
}

.home-card-title {
  color: var(--ion-color-light);
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.home-card-text {
  color: var(--ion-text-color);
  font-size: 1rem;
  margin-bottom: 15px;
}

.home-separator img {
  width: 230px;
  margin: 15px auto 0;
  display: block;
}

.recipe-ideas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.recipe-idea-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(44, 206, 210, 0.3);
  text-align: left;
  transition: 0.3s;
  cursor: pointer;
}

.recipe-idea-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--ion-color-primary);
  transform: translateX(5px);
}

.recipe-idea-title {
  color: var(--ion-color-light);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.recipe-idea-duration {
  color: var(--ion-color-tertiary);
  font-size: 0.9rem;
  margin: 0;
}

.recipe-section {
  margin-top: 16px;
  text-align: left;
}

.recipe-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
  text-align: left;
  color: var(--ion-color-secondary);
}

.recipe-list {
  padding-left: 0;
  margin: 0;
}

.recipe-steps {
  padding-left: 16px;
}

.recipe-list li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  list-style: none;
  font-size: 0.95rem;
}

.recipe-steps li {
  margin: 8px 0;
  line-height: 1.45;
  color: var(--ion-text-color);
}

.ing-qty {
  color: var(--ion-text-color);
}

.ing-name {
  color: var(--ion-text-color);
}

.fade-in {
  opacity: 0;
  animation: fadeSlideUp 0.6s ease forwards;
}

.save-recipe-btn {
  width: auto !important;
  min-width: 140px;
  max-width: 200px;

  --padding-top: 6px;
  --padding-bottom: 6px;
  --padding-start: 14px;
  --padding-end: 14px;

  font-size: 0.85rem;
  border-radius: 10px;

  margin: 10px auto 0; /* centre le bouton */
  display: block;
}

@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (min-width: 768px) {
  .recipe-ideas-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .home-card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    text-align: center;
  }
}

@media (max-width: 480px) {

  .home-card {
    padding: 15px;
  }

  .home-card-title {
    font-size: 1.3rem;
    margin-bottom: 6px;
  }

  .home-card-text {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .recipe-section {
    margin-top: 12px;
  }

  .recipe-title {
    font-size: 14px;
    margin-bottom: 6px;
  }

  .recipe-list li,
  .recipe-steps li {
    font-size: 0.9rem;
    padding: 4px 0;
  }

  .save-recipe-btn {
    min-width: 120px;
    --padding-start: 10px;
    --padding-end: 10px;
    --padding-top: 4px;
    --padding-bottom: 4px;
    font-size: 0.75rem;
  }

  .recipe-ideas-list {
    gap: 8px;
  }

  .recipe-idea-item {
    padding: 10px;
  }

  .recipe-idea-title {
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .recipe-idea-duration {
    font-size: 0.8rem;
  }
}
</style>