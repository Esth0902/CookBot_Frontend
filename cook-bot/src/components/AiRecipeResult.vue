<script setup lang="ts">
import {
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
        <p class="home-card-text">{{ aiRecipe.durationMinutes }} min</p>

        <div class="home-card-content fade-in">
          <!-- Ingrédients -->
          <div class="recipe-section">
            <h4 class="recipe-title">Ingrédients</h4>
            <ul class="recipe-list">
              <li v-for="(ing, idx) in aiRecipe.ingredients" :key="idx">
                <span class="ing-qty">{{ ing.quantity }} {{ ing.unit }}</span>
                <span class="ing-name">{{ ing.name }}</span>
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
</style>