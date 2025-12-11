<template>
  <ion-page>
    <Header />

    <!-- ALERT NOUVELLE LISTE -->
    <IonAlert
        :is-open="isCreateAlertOpen"
        header="Ajouter une nouvelle liste"
        :buttons="createListAlertButtons"
        :inputs="createListAlertInputs"
        @didDismiss="() => (isCreateAlertOpen = false)"
    />

    <!-- ALERT AJOUT ITEM -->
    <IonAlert
        :is-open="isAddItemAlertOpen"
        header="Ajouter un aliment"
        :buttons="addItemAlertButtons"
        :inputs="addItemAlertInputs"
        @didDismiss="() => (isAddItemAlertOpen = false)"
    />

    <!-- TOAST -->
    <IonToast
        :is-open="isToastOpen"
        :message="toastMessage"
        :duration="4000"
        :color="toastColor"
        position="bottom"
        @didDismiss="() => setToastMessage('', false)"
    />

    <ion-content class="shopping-content">

      <h1 class="shopping-title">Mes listes de courses</h1>

      <div class="add-list-container">
        <IonButton class="add-list-btn" @click="handleAddList">
          + Ajouter une liste
        </IonButton>
      </div>

      <div v-if="!shoppingLists.length" class="shopping-empty">
        <p>Aucune liste de courses pour le moment</p>
      </div>

      <div v-else>
        <div
            v-for="list in shoppingLists"
            :key="list.id"
            class="shopping-list">

          <!-- SUPPRIMER UNE LISTE -->
          <IonButton fill="clear" class="shopping-delete-btn"
                     @click="handleDeleteList(list.id!)">
            <IonIcon :icon="closeOutline" />
          </IonButton>

          <!-- TITRE LISTE -->
          <IonInput
              v-model="list.shoppingListName"
              class="shopping-list-title"
              placeholder="Titre de la liste"
              @ionBlur="handleUpdateList(list)"
          />

          <!-- AJOUTER UN ITEM -->
          <IonButton
              fill="clear"
              class="shopping-add-btn"
              @click="handleAddItem(list.id!)">
            + Ajouter un aliment
          </IonButton>

          <!-- REORDER -->
          <IonReorderGroup :disabled="false" @ionItemReorder="(ev) => handleItemReorder(ev, list)">
            <IonItem
                v-for="item in list.items"
                :key="item.id"
                class="shopping-list-item">

              <!-- CHECKBOX -->
              <IonCheckbox
                  slot="start"
                  v-model="item.bought"
                  @ionChange="handleItemChangeAndSave(list, item)"
              />

              <!-- AFFICHAGE / EDITION -->
              <div class="editable-content" :class="{ checked: item.bought }">

                <!-- MODE AFFICHAGE -->
                <IonLabel
                    v-if="editingItemId !== item.id"
                    class="display-mode-label"
                    @click="activateEditMode(item.id!)">

                  <span class="item-details">{{ item.quantity }} {{ item.unit }}</span>
                  <span class="item-name">{{ item.name }}</span>
                </IonLabel>

                <!-- MODE ÉDITION -->
                <div v-else class="edit-mode-inputs">
                  <IonInput
                      v-model="item.quantity"
                      type="number"
                      placeholder="Quantité"
                      class="input-quantity"
                      @ionBlur="handleItemChangeAndSave(list, item)"
                  />
                  <IonInput
                      v-model="item.unit"
                      type="text"
                      placeholder="Unité"
                      class="input-unit"
                      @ionBlur="handleItemChangeAndSave(list, item)"
                  />
                  <IonInput
                      v-model="item.name"
                      type="text"
                      placeholder="Nom de l'aliment"
                      class="input-name"
                      @ionBlur="handleItemChangeAndSave(list, item)"
                  />
                </div>
              </div>

              <!-- REORDER HANDLE -->
              <IonReorder slot="end"></IonReorder>

              <!-- SUPPRIMER ITEM -->
              <IonButton fill="clear" slot="end"
                         class="item-delete-btn"
                         @click="handleDeleteItem(list.id!, item.id!)">
                <IonIcon :icon="closeOutline" />
              </IonButton>

            </IonItem>
          </IonReorderGroup>

          <p v-if="!list.items?.length" class="shopping-empty-list">
            Cette liste est vide
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonReorder,
    IonReorderGroup,
    IonCheckbox,
    IonIcon,
    IonAlert,
    IonToast,

} from '@ionic/vue';
import {closeOutline} from "ionicons/icons";

import Header from "@/components/Header.vue";
import {ref} from 'vue';
import {onIonViewWillEnter} from "@ionic/vue";
import {
  getAllShoppingLists,
  ShoppingList, ShoppingItem,
  createShoppingList,
  deleteShoppingList,
  addItemToList,
  deleteItem,
  updateItem, updateShoppingList,
}
  from "@/services/shoppingApi";

const shoppingLists = ref<ShoppingList[]>([])
const loading = ref(true)
const isToastOpen = ref(false);
const toastMessage = ref("");
const toastColor = ref("danger");
const isCreateAlertOpen = ref(false);
const isAddItemAlertOpen = ref(false);
const activeListId = ref<number | null>(null);
const editingItemId = ref<number | null>(null);

const addItemAlertInputs = [
  {
    placeholder: "Nom de l'aliment (ex: Lait)",
    name: 'itemName',
    type: 'text',
    id: 'item-name-input',
  },
  {
    placeholder: "Quantité (ex: 2)",
    name: 'itemQuantity',
    type: 'number',
    id: 'item-quantity-input',
    value: 1,
  },
  {
    placeholder: "Unité (ex: litres, paquets)",
    name: 'itemUnit',
    type: 'text',
    id: 'item-unit-input',
    value: 'unité(s)',
  },
];

const createListAlertInputs = [
  {
    placeholder: "Titre de la nouvelle liste",
    name: 'listName',
    type: 'text',
    id: 'list-name-input',
  },
];

function setToastMessage(message: string, isOpen: boolean, color: string = 'danger') {
  toastMessage.value = message;
  isToastOpen.value = isOpen;
  toastColor.value = color;
}

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

function moveArrayElement(arr: any[], from: number, to: number) {
  const item = arr.splice(from, 1)[0];
  arr.splice(to, 0, item);
}

async function handleItemReorder(ev: CustomEvent, list: ShoppingList) {
  const from = ev.detail.from;
  const to = ev.detail.to;
  const listIndex = shoppingLists.value.findIndex(l => l.id === list.id);
  if (listIndex === -1 || !shoppingLists.value[listIndex].items) {
    ev.detail.complete(false);
    return;
  }

  const items = shoppingLists.value[listIndex].items!;
  const itemToMove = items.splice(from, 1)[0];
  items.splice(to, 0, itemToMove);

  items.forEach((item, index) => {
    item.sequence = index;
  });
  try {
    await updateShoppingList(shoppingLists.value[listIndex]);

    setToastMessage(`Ordre des aliments mis à jour.`, true, 'secondary');

    ev.detail.complete(true);

  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ordre :", error);
    const message = error instanceof Error ? error.message : "Impossible de sauvegarder le nouvel ordre.";
    setToastMessage(message, true, 'danger');

    ev.detail.complete(false);
  }
}

async function confirmAddList(data: any) {
  const name = data.listName;
  if (!name || name.trim() === "") {
    setToastMessage("Le nom de la liste ne peut pas être vide.", true, 'warning');
    return;
  }
  try {
    const newList = await createShoppingList(name);
    shoppingLists.value.push(newList);
    setToastMessage(`Liste '${name}' ajoutée.`, true, 'secondary');
    isCreateAlertOpen.value = false;
  } catch (error) {
    console.error("Erreur création :", error);
    let customMessage: string;
    if (error instanceof Error) {
      customMessage = error.message;
    } else {
      customMessage = "Erreur inconnue lors de la création.";
    }

    if (customMessage.includes("Internal Server Error") || customMessage.includes("Erreur lors de la création de la liste")) {
      customMessage = "Attention : Vous avez atteint la limite de 5 listes de courses !";
    }

    setToastMessage(customMessage, true, 'danger');
  }
}

const createListAlertButtons = [
  {
    text: 'Annuler',
    role: 'cancel',
    handler: () => {
      console.log('Création annulée');
    },
  },
  {
    text: 'Ajouter',
    role: 'confirm',
    handler: (data: any) => {
      confirmAddList(data);
    },
  },
];

async function handleAddList() {
  isCreateAlertOpen.value = true;
}

async function handleDeleteList(id: number) {

  try {
    await deleteShoppingList(id)
    shoppingLists.value = shoppingLists.value.filter(list => list.id !== id);
  }
  catch (error) {
    console.error("Erreur suppression :", error);
    const message = error instanceof Error ? error.message : "Impossible de supprimer la liste.";
    setToastMessage(message, true, 'danger');
  }
}

async function confirmAddItem(listId: number, data: any) {
  const name = data.itemName;
  const quantity = parseFloat(data.itemQuantity) || 1;
  const unit = data.itemUnit;
  if (!name || name.trim() === "" || quantity <= 0) {
    setToastMessage("Veuillez entrer un nom et une quantité valide.", true, 'warning');
    return;
  }

  try {
    const updatedList = await addItemToList(listId, name, quantity, unit);
    const index = shoppingLists.value.findIndex(list => list.id === listId);
    if (index !== -1) shoppingLists.value[index] = updatedList;
    setToastMessage(`'${name}' ajouté(e) à la liste.`, true, 'secondary');
    isAddItemAlertOpen.value = false;
    activeListId.value = null;
  } catch (error) {
    console.error("Erreur ajout item :", error);
    const message = error instanceof Error ? error.message : "Erreur lors de l'ajout de l'aliment.";
    setToastMessage(message, true, 'danger');
  }
}

const addItemAlertButtons = [
  {
    text: 'Annuler',
    role: 'cancel',
  },
  {
    text: 'Ajouter',
    role: 'confirm',
    handler: (data: any) => {
      if (activeListId.value !== null) {
        confirmAddItem(activeListId.value, data);
      }
    },
  },
];


async function handleAddItem(listId: number) {
  activeListId.value = listId;
  isAddItemAlertOpen.value = true;
}

async function handleUpdateList(list:ShoppingList) {
  if (!list.shoppingListName || list.shoppingListName.trim() === "") {
    setToastMessage("Le nom de la liste ne peut pas être vide.", true, 'warning');
    return;}
  try {
    await updateShoppingList(list);
    setToastMessage(`Titre de la liste mis à jour.`, true, 'secondary');
  }
  catch (error) {
    console.error("Erreur lors de la mise à jour de la liste :", error);
    alert("Impossible de mettre à jour la liste. Veuillez réessayer.");
  }
}

async function handleDeleteItem(listId: number, itemId: number) {
  try {
    await deleteItem(itemId);

    const listIndex = shoppingLists.value.findIndex(l => l.id === listId);
    if (listIndex !== -1) {
      shoppingLists.value[listIndex].items =
          shoppingLists.value[listIndex].items?.filter(i => i.id !== itemId);
    }

    setToastMessage("Aliment supprimé.", true, "secondary");

  } catch (error) {
    console.error("Erreur suppression item :", error);
    setToastMessage("Impossible de supprimer l'aliment.", true, "danger");
  }
}

async function handleItemChangeAndSave(list: ShoppingList, item: ShoppingItem) {

  editingItemId.value = null;

  if (!item.name || item.name.trim() === "") {
    setToastMessage("Le nom de l'aliment ne peut être vide.", true, 'warning');
    return;
  }

  try {
    await updateShoppingList(list);
    const action = item.checked ? "acheté(e)" : "désélectionné(e)";
    setToastMessage(`Aliment '${item.name}' marqué comme ${action}.`, true, 'secondary');

  } catch (error) {
  console.error("Erreur de mise à jour d'item :", error);
  const message = error instanceof Error ? error.message : "Impossible de sauvegarder la modification.";
  setToastMessage(message, true, 'danger');
  }
}

function activateEditMode(itemId: number) {
  editingItemId.value = itemId;
}

  </script>

<style scoped>

.shopping-title {
  text-align: center;
  color: var(--ion-color-light);
  margin-bottom: 30px;
}

.add-list-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.add-list-btn {
  margin-bottom: 20px;
  --color: var(--ion-text-color);
  --background: var(--ion-color-secondary);
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
  position: relative;
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
  text-align: left;
}

.shopping-list-item ion-label{
  flex-grow: 1;
  text-align: left;
  display: flex;
  align-items: center;
}

.item-details {
  flex-shrink: 0;
  white-space: nowrap;
  font-weight: 500;
  opacity: 0.8;
  margin-right: 5px;
  color: var(--ion-color-secondary);
}
.item-name {
  flex-grow: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
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
.editable-content {
  display: flex;
  flex-grow: 1;
}

.display-mode-label {
  flex-grow: 1;
  display: flex;
  align-items: center;
  overflow: hidden
}

@media (max-width: 480px) {
  .shopping-list {
    margin-left: 5px;
    margin-right: 5px;
    padding: 5px;
    border-width: 1px;
  }
}

</style>