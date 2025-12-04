import { authFetch } from '@/services/authApi';
import type {Recipe} from '@/services/aiAPI';

type NewRecipePayload = {
    name: string;
    durationMinutes : number;
    isFavorite: boolean;
    ingredients: Recipe['ingredients'];
    steps: Recipe['steps'];
};

export async function createRecipe(payload: NewRecipePayload) : Promise<Recipe> {
    const response = await authFetch('/api/v1/recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de l'enregistrement");
    }
    const json = await response.json() as {
        success : boolean,
        responseCode: number;
        responseMessage: string;
        data : Recipe;
    };
    return json.data;
}

export async function deleteRecipe(recipeId: number) : Promise<void> {
    const response = await authFetch(`/api/v1/recipe/${recipeId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la suppression de la recette');
    }
}

// export async function getFavoriteRecipes(): Promise<Recipe[]> {
//     const response = await authFetch('/api/v1/recipe/favorites', {
//         method: 'GET',
//     });
//
//     if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Erreur lors de la récupération des recettes favorites');
//     }
//
//     const json = await response.json() as {
//         success: boolean;
//         responseCode: number;
//         responseMessage: string;
//         data: Recipe[];
//     };
//
//     return json.data;
// }

export async function toggleFavoriteRecipe(recipeId: number): Promise<void> {
    const response = await authFetch(`/api/v1/recipe/${recipeId}`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la modification du favori');
    }
}

export async function getAllRecipes(): Promise<Recipe[]> {
    const response = await authFetch('/api/v1/recipe/all', {
        method: 'GET',
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la récupération des recettes');
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Recipe[];
    };

    return json.data;
}