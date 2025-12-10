import { authFetch } from './authApi';



export interface ShoppingItem {
    id?: number;
    name: string;
    checked: boolean;
    quantity?: string;
    unit?: string;
    sequence?: number;
}

export interface ShoppingList {
    id?: number;
    shoppingListName: string;
    items: ShoppingItem[];
}

export async function getAllShoppingLists(): Promise<ShoppingList[]> {
    const response = await authFetch('/api/v1/shopping', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des listes');
    }

    const result = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: ShoppingList[];
    };
    return result.data;
}

export async function createShoppingList(name: string): Promise<ShoppingList> {

    const response = await authFetch(`/api/v1/shopping`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shoppingListName: name,
            items: []
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.responseMessage || "Erreur lors de la création de la liste";
        throw new Error(errorMessage);}

    const result = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: ShoppingList;
        items: []
    };
    return result.data;
}

export async function addItemToList(listId: number, itemName: string, itemQuantity: number, itemUnit: string): Promise<ShoppingList> {

    const response = await authFetch(`/api/v1/shopping/item/${listId}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        },
    body: JSON.stringify({
        name: itemName,
        quantity: itemQuantity,
        unit : itemUnit,

    }),
});
    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.responseMessage || "Erreur lors de l'ajout de l'item";
        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
}

export async function deleteShoppingList(listId: number): Promise<void> {

    const response = await authFetch(`/api/v1/shopping/${listId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
    }
}

export async function updateShoppingList(list: ShoppingList): Promise<ShoppingList> {

    if (!list.id) {
        throw new Error("L'ID de la liste de courses est manquant pour la mise à jour.");
    }

    const response = await authFetch(`/api/v1/shopping`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(list),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du nom de la liste");
    }

    const result = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: ShoppingList;
    };
    return result.data;
}

export async function deleteItem(itemId: number): Promise<ShoppingList> {

    const response = await authFetch(`/api/v1/shopping/item/delete/${itemId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.responseMessage || "Erreur lors de la suppression de l'aliment";
        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
}

export async function updateItem(listId: number, item: ShoppingItem): Promise<ShoppingList> {

    const response = await authFetch(`/api/v1/shopping/item/${listId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.responseMessage || "Erreur lors de la mise à jour de l'aliment";
        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
}


