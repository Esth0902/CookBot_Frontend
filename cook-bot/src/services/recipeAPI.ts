import { authFetch } from '@/services/authApi';
import type { Recipe } from '@/services/aiAPI';

export async function getFavoriteRecipes(): Promise<Recipe[]> {
    const response = await authFetch('/api/v1/recipe/favorites', {
        method: 'GET',
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la récupération des recettes favorites');
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Recipe[];
    };

    return json.data;
}