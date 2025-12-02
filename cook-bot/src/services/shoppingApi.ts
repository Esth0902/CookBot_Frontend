import { getToken, authFetch } from './authApi';


const API_BASE_URL = 'http://localhost:8080';

export interface ShoppingItem {
    id?: number;
    name: string;
    checked: boolean;
    quantity?: string;
}

export interface ShoppingList {
    id?: number;
    shoppingListName: string;
    creationDate?: string;
    items: ShoppingItem[];
}

export async function getAllShoppingLists(): Promise<ShoppingList[]> {
    const token = getToken();
    const response = await authFetch('/api/v1/shopping/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des listes');
    }

    const result = await response.json();
    return result.data;
}

export async function addItemToList(listId: number, itemName: string): Promise<ShoppingList> {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/shopping/item/${listId}`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
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
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/shopping/${listId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
    }
}

export async function createShoppingList(name: string): Promise<ShoppingList> {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/shopping`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
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