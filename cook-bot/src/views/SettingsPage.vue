<template>
  <ion-page>
    <Header/>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Réglages</ion-title>
        <LogoutButton />
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="p-4 space-y-6">
        <ion-list inset>
          <ion-list-header>
            <ion-label>
              <h2>Préférences de cuisine</h2>
              <p>Valeurs par défaut utilisées pour les recettes</p>
            </ion-label>
          </ion-list-header>

          <ion-item lines="full">
            <ion-label>Nombre de personnes</ion-label>
            <div class="flex items-center gap-2">
              <ion-button @click="decServings" size="small" aria-label="Diminuer">
                <ion-icon :icon="remove" />
              </ion-button>
              <ion-badge color="light">
                {{ settings.servings }}
              </ion-badge>
              <ion-button @click="incServings" size="small" aria-label="Augmenter">
                <ion-icon :icon="add" />
              </ion-button>
            </div>
          </ion-item>

          <ion-item>
            <ion-label>Filtrer les résultats avec mes exclusions</ion-label>
            <ion-toggle :checked="settings.applyFiltersInSearch" @ionChange="toggleApplyFilters" />
          </ion-item>
        </ion-list>

        <ion-list inset>
          <ion-list-header>
            <ion-label>
              <h2>Aliments à éviter</h2>
            </ion-label>
          </ion-list-header>

          <ion-item>
            <ion-label>Allergènes (liste rapide)</ion-label>
          </ion-item>
          <div class="px-4 pb-2 flex flex-wrap gap-2">
            <ion-chip
                v-for="a in commonAllergens"
                :key="a"
                :color="settings.allergens.includes(a) ? 'danger' : undefined"
                @click="toggleAllergen(a)"
            >
              <ion-icon :icon="settings.allergens.includes(a) ? checkmark : alertCircle" />
              <ion-label>{{ a }}</ion-label>
            </ion-chip>
          </div>

          <ion-item lines="full">
            <ion-label position="stacked">Liste personnalisée</ion-label>
            <div class="w-full flex gap-2 items-end">
              <ion-input
                  v-model="newAvoid"
                  placeholder="ex: coriandre, champignons..."
                  @keyup.enter="addAvoid"
                  :clear-input="true"
              />
              <ion-button @click="addAvoid" :disabled="!newAvoid.trim()">Ajouter</ion-button>
            </div>
          </ion-item>

          <div v-if="settings.avoidList.length" class="px-4 pt-2 pb-4 flex flex-wrap gap-2">
            <ion-chip
                v-for="(item, i) in settings.avoidList"
                :key="item"
                @click="removeAvoid(i)"
                color="medium"
            >
              <ion-label>{{ item }}</ion-label>
              <ion-icon :icon="close" />
            </ion-chip>
          </div>
        </ion-list>

        <div class="px-4 flex gap-3">
          <ion-button expand="block" class="flex-1" @click="saveNow" :disabled="!dirty">Enregistrer</ion-button>
          <ion-button expand="block" class="flex-1" color="medium" fill="outline" @click="resetAll">
            Réinitialiser
          </ion-button>
        </div>

      </div>

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
import { IonLabel, IonIcon, IonPage, IonToast, IonChip, IonContent,IonInput,IonList, IonToggle, IonTitle, IonToolbar, IonHeader, IonListHeader, IonButton, IonBadge, IonItem } from '@ionic/vue';
import { reactive, ref, watch, onMounted } from 'vue'
import { Preferences } from '@capacitor/preferences'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { add, remove, close, checkmark, alertCircle } from 'ionicons/icons'
import LogoutButton from "@/components/LogoutButton.vue";
import Header from "@/components/Header.vue";

const STORAGE_KEY = 'cookbot.settings.v1'

interface Settings {
  servings: number
  applyFiltersInSearch: boolean
  allergens: string[]
  avoidList: string[]
  plan: 'free' | 'premium'
}

const defaultSettings: Settings = {
  servings: 2,
  applyFiltersInSearch: true,
  allergens: [],
  avoidList: [],
  plan: 'free',
}

const settings = reactive<Settings>({ ...defaultSettings })
const dirty = ref(false)
const newAvoid = ref('')
const toast = reactive({ open: false, message: '' })

const commonAllergens = [
  'Gluten',
  'Lactose',
  'Oeufs',
  'Arachides',
  'Fruits à coque',
  'Soja',
  'Crustacés',
]

function buzz() {
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}
function markDirty() {
  dirty.value = true
}

function toggleApplyFilters(ev: CustomEvent) {
  settings.applyFiltersInSearch = !!(ev as any).detail.checked
  markDirty()
}
function incServings() {
  settings.servings = Math.min(12, settings.servings + 1)
  buzz()
  markDirty()
}
function decServings() {
  settings.servings = Math.max(1, settings.servings - 1)
  buzz()
  markDirty()
}
function toggleAllergen(a: string) {
  const idx = settings.allergens.indexOf(a)
  if (idx >= 0) settings.allergens.splice(idx, 1)
  else settings.allergens.push(a)
  markDirty()
}
function addAvoid() {
  const val = newAvoid.value.trim()
  if (!val) return
  if (!settings.avoidList.includes(val)) settings.avoidList.push(val)
  newAvoid.value = ''
  markDirty()
}
function removeAvoid(i: number) {
  settings.avoidList.splice(i, 1)
  markDirty()
}

async function loadSettings() {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    if (value) {
      const parsed = JSON.parse(value)
      Object.assign(settings, { ...defaultSettings, ...parsed })
    }
  } catch (e) {
    console.warn('Failed to load settings', e)
  }
}
async function saveSettings() {
  try {
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(settings) })
    dirty.value = false
    toast.message = 'Réglages enregistrés'
    toast.open = true
  } catch (e) {
    toast.message = "Erreur d'enregistrement"
    toast.open = true
  }
}

let saveTimer: number | undefined
watch(
    settings,
    () => {
      clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => {
        if (dirty.value) saveSettings()
      }, 2500)
    },
    { deep: true }
)

function saveNow() {
  saveSettings()
}

function resetAll() {
  Object.assign(settings, { ...defaultSettings })
  saveSettings()
}

onMounted(loadSettings)

</script>

<style scoped>
:deep(.chip-disabled) {
  opacity: 0.6;
}
</style>
