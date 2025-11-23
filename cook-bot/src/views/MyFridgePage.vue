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

      <ion-grid v-if="premium && photos.length" class="ion-margin">
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
            <ion-img
                :src="photo.webviewPath"
                :style="{
          display: 'block',
          width: '60%',
          maxWidth: '240px',
          height: 'auto',
          margin: '8px auto',
          borderRadius: '12px'
        }"
            />
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="ion-padding">
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


      <AiRecipeResult
          :ai-error="aiError"
          :ai-recipe="aiRecipe"
          :ai-recipe-titles="aiRecipeTitles"
      />

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
  onIonViewWillEnter,
} from '@ionic/vue';

import { ref } from 'vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';
import LogoutButton from '@/components/LogoutButton.vue';
import { isPremiumUser } from '@/services/authApi';
import { useAiRecipes } from '@/composables/useAiRecipes';
import AiRecipeResult from "@/components/AiRecipeResult.vue";

const { photos, takePhoto } = usePhotoGallery();
const premium = ref(false);

onIonViewWillEnter(() => {
  premium.value = isPremiumUser();
  console.log('onIonViewWillEnter – premium =', premium.value);
});

const {
  loadingAi,
  aiError,
  aiRecipe,
  aiRecipeTitles,
  getTitlesFromImage,
  getRecipeFromImage,
} = useAiRecipes();

const handleGenerateRecipeTitleFromImage = async () => {
  const photo = photos.value[0];
  await getTitlesFromImage(photo);
};

const handleGenerateRecipeFromImage = async () => {
  const photo = photos.value[0];
  await getRecipeFromImage(photo);
};
</script>

