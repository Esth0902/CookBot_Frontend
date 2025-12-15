<template>
  <ion-page>
    <HeaderComponent/>

    <ion-content class="settings-content">
      <section class="settings-section">
        <div class="settings-card">
          <h2 class="settings-card-title">Mes préférences culinaires</h2>
          <p class="settings-card-text">Personnalise tes recettes selon tes envies</p>

          <div class="settings-row">
            <span>Nombre de personnes</span>

            <div class="settings-counter">
              <ion-button @click="decServings" size="small">
                <ion-icon :icon="remove" />
              </ion-button>

              <ion-badge color="light">{{ settings.servings }}</ion-badge>

              <ion-button @click="incServings" size="small">
                <ion-icon :icon="add" />
              </ion-button>

            </div>
          </div>

          <div class="settings-row">
            <span>Appliquer mes exclusions dans les recherches</span>
            <ion-toggle
                :checked="settings.applyFiltersInSearch"
                @ionChange="toggleApplyFilters"
            />
          </div>
        </div>
      </section>

      <!-- SEPARATEUR -->
      <div class="settings-separator">
        <img src="/wave.png" alt="separator" />
      </div>

      <section class="settings-section">
        <div class="settings-card">
          <h2 class="settings-card-title">Aliments à éviter</h2>

          <div class="settings-chips">
            <ion-chip
                v-for="a in commonAllergens"
                :key="a"
                :color="settings.allergens.includes(a) ? 'success' : 'light'"
                @click="toggleAllergen(a)"
            >
              <ion-icon :icon="settings.allergens.includes(a) ? checkmark : alertCircle" />
              <ion-label>{{ a }}</ion-label>
            </ion-chip>
          </div>
          <div v-if="settings.avoidList.length" class="settings-chips">
            <ion-chip
                v-for="(item, i) in settings.avoidList"
                :key="item"
                @click="removeAvoid(i)"
                color="warning"
            >
              <ion-label>{{ item }}</ion-label>
              <ion-icon :icon="close" />
            </ion-chip>
          </div>
          <div class="settings-input-column">
            <ion-input
                v-model="newAvoid"
                :placeholder="isPremium ? 'ex: coriandre, champignons...' : 'Option réservée aux membres Premium'"
                @keyup.enter="addAvoid"
                :clear-input="true"
                :disabled="!isPremium"
            />
            <ion-button
                @click="isPremium ? addAvoid() : router.push('/tabs/home')"
                :disabled="isPremium && !newAvoid.trim()"
                class="settings-btn-add"
                :color="isPremium ? 'light' : 'warning'"
            >
              <span v-if="isPremium">Ajouter</span>
              <span v-else style="display: flex; align-items: center; gap: 8px;">
                 <ion-icon :icon="lockClosed" /> Débloquer
              </span>
            </ion-button>
          </div>
        </div>
      </section>

      <section class="settings-section" style="padding-bottom: 30px;">
        <div class="settings-buttons">
          <ion-button expand="block" class="settings-btn-save" @click="saveNow" >
            Enregistrer
          </ion-button>

          <ion-button expand="block"  class="settings-btn-reset" @click="resetAll">
            Réinitialiser
          </ion-button>
        </div>

        <ion-button expand="block" fill="clear" color="medium" router-link="/legal" class="ion-margin-top">
          Mentions Légales & Confidentialité
        </ion-button>
      </section>

      <ion-toast
          :is-open="toast.open"
          :message="toast.message"
          :duration="1400"
          @didDismiss="toast.open = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonIcon,
  IonPage,
  IonToast,
  IonChip,
  IonContent,
  IonInput,
  IonToggle,
  IonButton,
  IonBadge,
  onIonViewWillEnter,
} from '@ionic/vue';
import { reactive, ref } from 'vue';
import { add, remove, close, checkmark, alertCircle, lockClosed } from 'ionicons/icons';
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  getUserPreferences,
  getUserSetting,
  updateUserNbPeople,
  addUserPreferences,
  deleteUserPreferenceByName, UserPreference,
} from "@/services/settingsAPI";
import { isPremiumUser } from '@/services/authApi';

import { useUserSettings } from '@/composables/useUserSettings';
import router from "@/router";

interface Settings {
  servings: number;
  applyFiltersInSearch: boolean;
  allergens: string[];
  avoidList: string[];
  plan: 'free' | 'premium';
}

const defaultSettings: Settings = {
  servings: 1,
  applyFiltersInSearch: true,
  allergens: [],
  avoidList: [],
  plan: 'free',
};

const settings = reactive<Settings>({ ...defaultSettings });
const newAvoid = ref('');
const toast = reactive({ open: false, message: '' });
const originalAllergens = ref<string[]>([]);
const isPremium = ref(false);
const commonAllergens = [
  'Gluten',
  'Lactose',
  'Oeufs',
  'Arachides',
  'Fruits à coque',
  'Soja',
  'Crustacés',
];

function applyPreferencesFromBackend(prefs: UserPreference[]) {
  const allValues = prefs.map(p => p.allergen);
  settings.allergens = allValues.filter(a => commonAllergens.includes(a));
  settings.avoidList = allValues.filter(a => !commonAllergens.includes(a));
  originalAllergens.value = [... allValues];
}

onIonViewWillEnter(async () => {
  try {
    isPremium.value = isPremiumUser();
    const [backendSettings, prefs] = await Promise.all([
      getUserSetting(),
      getUserPreferences(),
    ]);

    settings.servings = backendSettings.nbPeople ?? defaultSettings.servings;
    applyPreferencesFromBackend(prefs);
  } catch (e) {
    console.error(e);
    toast.message = "Impossible de charger les réglages";
    toast.open = true;
  }
});

function toggleApplyFilters(ev: CustomEvent) {
  settings.applyFiltersInSearch = !!(ev as any).detail.checked;
}

function incServings() {
  settings.servings = Math.min(12, settings.servings + 1);
}

function decServings() {
  settings.servings = Math.max(1, settings.servings - 1);
}

async function addAvoid() {
  const val = newAvoid.value.trim();
  if (!val) return;

  if (settings.avoidList.includes(val) || settings.allergens.includes(val)) {
    newAvoid.value = '';
    return;
  }

  settings.avoidList.push(val);
  newAvoid.value = '';
}

async function removeAvoid(i: number) {
  settings.avoidList.splice(i, 1);
}

async function toggleAllergen(a: string) {
  const idx = settings.allergens.indexOf(a);
  if (idx >= 0) {
    settings.allergens.splice(idx, 1);
  } else {
    settings.allergens.push(a);
  }
}

function getCurrentAllergens(): string[] {
  return Array.from(new Set([...settings.allergens, ...settings.avoidList]));
}

const { nbPeople } = useUserSettings();

async function saveNow() {
  try {
    await updateUserNbPeople(settings.servings);

    nbPeople.value = settings.servings;

    const current = getCurrentAllergens();
    const original = originalAllergens.value;
    const toAdd = current.filter(a => !original.includes(a));
    const toDelete = original.filter(a => !current.includes(a));

    if (toAdd.length) {
      await addUserPreferences(toAdd);
    }

    for (const name of toDelete) {
      await deleteUserPreferenceByName(name);
    }

    originalAllergens.value = [...current];

    toast.message = 'Réglages enregistrés';
  } catch (e) {
    console.error(e);
    toast.message = "Erreur lors de l'enregistrement";
  } finally {
    toast.open = true;
  }
}

async function resetAll() {
  settings.servings = defaultSettings.servings;
  settings.allergens = [];
  settings.avoidList = [];

  try {
    await updateUserNbPeople(settings.servings);

    const original = originalAllergens.value;
    for (const name of original) {
      await deleteUserPreferenceByName(name);
    }
    originalAllergens.value = [];

    toast.message = 'Réglages réinitialisés';
  } catch (e) {
    console.error(e);
    toast.message = "Erreur lors de la réinitialisation";
  } finally {
    toast.open = true;
  }
}

</script>

<style scoped>

.settings-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.settings-section {
  padding: 10px 10px;
}

.settings-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  border: 1px solid var(--ion-color-primary);
  text-align: center;
  transition: 0.3s;
}

.settings-card:hover {
  transform: translateY(-4px);
}

.settings-card-title {
  color: var(--ion-color-light);
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.settings-card-text {
  color: var(--ion-text-color);
  font-size: 1rem;
  margin-bottom: 20px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 0;
  color: var(--ion-text-color);
  font-size: 1rem;
  text-align: left;
}

.settings-counter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-counter ion-badge {
  background: var(--ion-color-secondary);
  color: white;
  padding: 6px 10px;
  font-size: 1rem;
  border-radius: 10px;
}

.settings-input-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

.settings-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  justify-content: center;
}

.settings-separator img {
  width: 160px;
  margin: 20px auto;
  display: block;
  opacity: 0.8;
}

.settings-buttons {
  display: flex;
  gap: 12px;
}

.settings-btn-save {
    --background: var(--ion-color-tertiary);
    --border-radius: 12px;
    --color: var(--ion-color-secondary);
    width: 100%;
    max-width: 300px;
    margin: 12px auto 0;
    display: block;
    font-weight: 600;
    font-size: 1rem;
}

.settings-btn-reset {
  --background: var(--ion-color-secondary);
  --border-radius: 12px;
  --color: var(--ion-text-color);
  width: 100%;
  max-width: 300px;
  margin: 10px auto 0;
  display: block;
  font-weight: 600;
  font-size: 1rem;
}

.settings-btn-add {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  --color: var(--ion-text-color);
  width: 100%;
  max-width: 300px;
  margin: 10px auto 0;
  display: block;
  font-weight: 600;
  font-size: 1rem;
}

</style>
