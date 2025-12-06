<template>
  <ion-page>
    <Header />

<ion-content class="shopping-content">

  <h1 class="shopping-title">Mes listes de courses</h1>
  <IonButton class="add-list-btn" @click="handleAddList">
    + Ajouter une liste
  </IonButton>

  <div v-if="!shoppingLists.length" class="shopping-empty">
    <p>Aucune liste de courses pour le moment</p>

  </div>

  <div v-else>

    <div v-for="list in shoppingLists" :key="list.id"
       class="shopping-list">

      <IonButton fill="clear" class="shopping-delete-btn" @click="handleDeleteList(list.id)">
        <IonIcon :icon="closeOutline" />
      </IonButton>

    <IonInput
        v-model="list.shoppingListName"
        class="shopping-list-title"
        placeholder="Titre de la liste"
    />


    <IonButton fill="clear"
               class="shopping-add-btn"
               @click="handelAddItem(list.id)">
      + Ajouter un aliment
    </IonButton>

    <IonReorderGroup :disabled="false">
      <IonItem
          v-for="item in list.items"
          :key="item.id"
          class="shopping-list-item"
      >
        <IonCheckbox
            :checked="item.checked"
            class="checkbox"
        ></IonCheckbox>

        <IonLabel :class="{ checked: item.checked }">
          {{ item.name }}
        </IonLabel>

        <IonReorder slot="end"></IonReorder>
      </IonItem>
    </IonReorderGroup>

      <p v-if="!list.items?.length" class="shopping-empty-list">
        Cette liste est vide
      </p>
    </div>
  </div>

</ion-content >

  </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonReorder,
    IonReorderGroup,
    IonCheckbox,
    IonIcon

} from '@ionic/vue';
import {closeOutline} from "ionicons/icons";

import Header from "@/components/Header.vue";
import {ref} from 'vue';
import {onIonViewWillEnter} from "@ionic/vue";
import {
  getAllShoppingLists,
  ShoppingList,
  createShoppingList,
  deleteShoppingList}
  from "@/services/shoppingApi";

const shoppingLists = ref<ShoppingList[]>([])
const loading = ref(true)

onIonViewWillEnter(async () => {
  loading.value = true;
  try {
    shoppingLists.value = await getAllShoppingLists();
    console.log('Liste chargée:', shoppingLists.value);
  }
  catch (error) {
    console.error('Erreur:', error);
  }
  finally {
    loading.value = false;
  }
    });

async function handleAddList() {
  const name = prompt("Nom de la nouvelle liste :");

  if (!name || name.trim() === "") {
    return;
  }

  try {
    const newList = await createShoppingList(name);
    shoppingLists.value.push(newList);
  } catch (error) {
    console.error("Erreur création :", error);
  }
}

async function handleDeleteList(id: number) {

  try {
    await deleteShoppingList(id)
    shoppingLists.value = shoppingLists.value.filter(list => list.id !== id);
  }
  catch (error) {
    console.error("Erreur suppression :", error);
    alert("Impossible de supprimer la liste. Veuillez réessayer.");
  }
}

async function handelAddItem(listId: number) {
  const name = prompt("Nom de l'aliment :")

}

  </script>

<style scoped>

.add-list-btn {
  margin-bottom: 20px;
  --color: var(--ion-color-secondary);
}

.shopping-content {
  padding: 22px;
}

.shopping-list {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  backdrop-filter: blur(6px);
  border: 1px solid var(--ion-color-primary);
  margin-bottom: 24px;
  margin-left: 20px;
  margin-right: 20px;
  transition: 0.3s;
}

.shopping-list:hover {
  transform: translateY(-4px);
}

.shopping-list-title {
  margin-bottom: 14px;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ion-color-light);
}

.shopping-add-btn {
  margin-bottom: 16px;
  --color: var(--ion-color-secondary);
}

.shopping-list-item {
  --background: transparent;
  border-bottom: 1px solid var(--ion-color-primary);
  padding: 10px 4px;
}

.shopping-list-item:last-child {
  border-bottom: none;
}

.checkbox {
  margin-right: 12px;
}

.checked {
  text-decoration: line-through;
  opacity: 0.6;
}

.shopping-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  --color: var(--ion-color-secondary);
  font-size: 1.2rem;
}

</style>