import { authFetch } from './authApi';

export interface ShoppingItem {
    id?: number;
    name: string;
    checked: boolean;
    quantity?: string;
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
        body: JSON.stringify({
            shoppingListName: name,
            items: []
        }),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la création de la liste");
    }

    const result = await response.json();
    return result.data;
}

export async function addItemToList(listId: number, itemName: string): Promise<ShoppingList> {

    const response = await authFetch(`/api/v1/shopping/item/${listId}`, {
    method: 'POST',

    body: JSON.stringify({
        name: itemName,
        checked: false
    }),
});
    if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'item');
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
