  <template>
    <ion-page>
      <HeaderComponent />

      <ion-content class="fridge-content" ref="contentRef">

        <!-- Section de bienvenue -->
        <section class="fridge-section">
          <div class="fridge-card">
            <h1 class="fridge-card-title">Mon frigo intelligent</h1>
            <p class="fridge-card-text">
              Prends une photo de ton frigo et laisse CookBot créer des recettes personnalisées !
            </p>

            <!-- Bouton pour prendre une photo -->
            <ion-button
                @click="takePhoto()"
                class="fridge-btn-camera"
            >
              <ion-icon :icon="camera" slot="start" />
              Prendre une photo
            </ion-button>
          </div>

          <div class="fridge-separator">
            <img src="/wave1.png" alt="separator" />
          </div>
        </section>

        <!-- Photo prise -->
        <section v-if="photos.length" class="fridge-section">
          <div class="fridge-card">
            <h2 class="fridge-card-subtitle">Ma photo</h2>

            <div class="fridge-photo-container">
              <ion-img
                  :src="photos[0].webviewPath"
                  class="fridge-photo"
              />
              <ion-button
                  fill="clear"
                  class="fridge-delete-btn"
                  @click="deletePhoto()"
              >
                <ion-icon slot="icon-only" :icon="closeCircle"></ion-icon>
              </ion-button>
            </div>
          </div>

          <div class="fridge-separator">
            <img src="/wave1.png" alt="separator" />
          </div>
        </section>

        <!-- Boutons d'action -->
        <section v-if="photos.length" class="fridge-section">
          <div class="fridge-card">
            <h2 class="fridge-card-subtitle">Générer avec l'IA</h2>

            <div class="fridge-actions">
              <ion-button
                  expand="block"
                  :disabled="loadingAi"
                  @click="handleGenerateRecipeTitleFromImage"
                  class="fridge-btn"
              >
                <ion-icon :icon="camera" slot="start" />
                <span v-if="!loadingAi">Idées de recettes</span>
                <span v-else>Génération...</span>
              </ion-button>

              <ion-button
                  expand="block"
                  :disabled="loadingAi"
                  @click="handleGenerateRecipeFromImage"
                  class="fridge-btn fridge-btn-secondary"
              >
                <ion-icon :icon="camera" slot="start" />
                <span v-if="!loadingAi">Recette complète</span>
                <span v-else>Génération...</span>
              </ion-button>
            </div>
          </div>

          <div class="fridge-separator">
            <img src="/wave1.png" alt="separator" />
          </div>
        </section>

        <!-- Résultats IA -->
        <div ref="resultsRef">
        <section v-if="aiRecipe || aiRecipeTitles || aiError">
          <AiRecipeResult
              :ai-error="aiError"
              :ai-recipe="aiRecipe"
              :ai-recipe-titles="aiRecipeTitles"
              :show-save-button="true"
              @select-title="handleGenerateRecipeFromTitle"
          />
        </section>
        </div>


      </ion-content>
    </ion-page>
  </template>

  <script setup lang="ts">
  import { camera, closeCircle } from 'ionicons/icons';
  import {
    IonPage,
    IonIcon,
    IonContent,
    IonImg,
    IonButton,
  } from '@ionic/vue';
  import { ref, watch, nextTick } from 'vue';
  import { usePhotoGallery } from '@/composables/usePhotoGallery';
  import { useAiRecipes } from '@/composables/useAiRecipes';
  import AiRecipeResult from "@/components/AiRecipeResult.vue";
  import HeaderComponent from "@/components/HeaderComponent.vue";


  const contentRef = ref<any>(null);
  const resultsRef = ref<HTMLElement | null>(null);

  const { photos, takePhoto, deletePhoto } = usePhotoGallery();

  const {
    loadingAi,
    aiError,
    aiRecipe,
    aiRecipeTitles,
    getTitlesFromImage,
    getRecipeFromImage,
    getRecipeFromDish,
  } = useAiRecipes();

  watch([aiRecipe, aiRecipeTitles], async ([newRecipe, newTitles]) => {
    if (newRecipe || (newTitles && newTitles.length > 0)) {
      await nextTick();
      if (contentRef.value && resultsRef.value) {
        const y = resultsRef.value.offsetTop;
        contentRef.value.$el.scrollToPoint(0,y -20,600);
      }
    }
  });

  const handleGenerateRecipeTitleFromImage = async () => {
    const photo = photos.value[0];
    await getTitlesFromImage(photo);
  };

  const handleGenerateRecipeFromImage = async () => {
    const photo = photos.value[0];
    await getRecipeFromImage(photo);
  };

  const handleGenerateRecipeFromTitle = async (title : string) => {
    await getRecipeFromDish(title);
  };

  </script>

  <style scoped>
  .fridge-content {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 26px;
    padding-bottom: 100px;
    --overflow: auto;
  }

  .fridge-section {
    padding: 10px 10px;
  }

  .fridge-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    backdrop-filter: blur(6px);
    border: 1px solid var(--ion-color-primary);
    text-align: center;
    transition: 0.3s;
  }

  .fridge-card:hover {
    transform: translateY(-4px);
  }

  .fridge-card-title {
    color: var(--ion-color-light);
    font-size: 1.6rem;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .fridge-card-subtitle {
    color: var(--ion-color-secondary);
    font-size: 1.3rem;
    margin-bottom: 15px;
    font-weight: 600;
  }

  .fridge-card-text {
    color: var(--ion-text-color);
    font-size: 1rem;
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .fridge-separator img {
    width: 230px;
    margin: 15px auto 0;
    display: block;
  }

  /* Photo unique */
  .fridge-photo-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .fridge-photo {
    width: 100%;
    max-width: 200px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    transition: transform 0.3s;
  }

  .fridge-photo:hover {
    transform: scale(1.02);
  }

  .fridge-btn-camera {
    --background: var(--ion-color-primary);
    --background-hover: var(--ion-color-secondary);
    --border-radius: 12px;
    --padding-top: 14px;
    --padding-bottom: 14px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.3px;
    margin-top: 10px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .fridge-delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    --color: var(--ion-color-primary);
    font-size: 36px;
    z-index: 10;
  }

  .fridge-delete-btn:hover {
    --color: var(--ion-color-light);
    transform: scale(1.15);
  }

  /* Actions */
  .fridge-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }

  .fridge-btn {
    --background: var(--ion-color-primary);
    --background-hover: var(--ion-color-tertiary);
    --border-radius: 12px;
    --padding-top: 14px;
    --padding-bottom: 14px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.3px;
  }

  .fridge-btn-secondary {
    --background: var(--ion-color-secondary);
    --background-hover: var(--ion-color-light);
  }

  .fridge-btn:disabled {
    opacity: 0.5;
  }

  /* FAB Button */
  .fridge-fab {
    --background: var(--ion-color-primary);
    --background-hover: var(--ion-color-tertiary);
    --color: var(--ion-text-color);
    box-shadow: 0 6px 20px rgba(44, 206, 210, 0.4);
    width: 64px;
    height: 64px;
  }

  .fridge-fab::part(native) {
    border-radius: 50%;
    overflow: hidden;
  }

  .fridge-fab:hover {
    transform: scale(1.1);
  }

  /* Responsive */
  @media (min-width: 768px) {
    .fridge-actions {
      flex-direction: row;
    }

    .fridge-btn {
      flex: 1;
    }

    .fridge-photo {
      max-width: 250px;
    }

    .fridge-delete-btn {
      right: calc(50% - 125px + 10px);
    }
  }

  @media (min-width: 1024px) {
    .fridge-content {
      max-width: none;
      margin: 0;
    }
  }
  </style>
