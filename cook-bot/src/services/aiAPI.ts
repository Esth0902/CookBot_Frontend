import { authFetch } from '@/services/authApi';
import type { UserPhoto } from '@/composables/usePhotoGallery';

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

export interface Step {
    stepNumber: number;
    description: string;
}

export interface Recipe {
    name: string;
    durationMinutes: number;
    isFavorite?: boolean;
    ingredients: Ingredient[];
    steps: Step[];
}

export interface RecipeTitle {
    title: string;
    durationMinutes: number;
}

export interface IngredientInput {
    name: string;
    quantity: number;
    unit: string;
}

async function userPhotoToBlob(photo: UserPhoto): Promise<Blob> {
    if (!photo.webviewPath) {
        throw new Error('Aucun chemin webview pour la photo.');
    }
    const response = await fetch(photo.webviewPath);
    return response.blob();
}

export async function generateRecipeFromImage(photo: UserPhoto): Promise<Recipe> {
    const blob = await userPhotoToBlob(photo);

    const formData = new FormData();
    formData.append('file', blob, photo.filepath ?? 'photo.jpg');

    const response = await authFetch('/api/v1/ai/recipe/image', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la génération de la recette depuis la photo');
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Recipe;
    };

    return json.data;
}

export async function generateRecipeTitleFromImage(photo: UserPhoto): Promise<RecipeTitle[]> {
    const blob = await userPhotoToBlob(photo);

    const formData = new FormData();
    formData.append('file', blob, photo.filepath ?? 'photo.jpg');

    const response = await authFetch('/api/v1/ai/recipeTitle/image', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la génération de la recette depuis la photo');
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: {
            recipeTitles: RecipeTitle[];
        };
    };

    return json.data.recipeTitles;
}

export async function generateRecipeFromIngredients(
    ingredients: IngredientInput[],
): Promise<RecipeTitle[]> {
    const response = await authFetch('/api/v1/ai/recipeTitle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(
            text || 'Erreur lors de la génération de la recette depuis les ingrédients',
        );
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: {
            recipeTitles: RecipeTitle[];
        };
    };

    return json.data.recipeTitles;
}

export async function generateDailyRecipe(): Promise<Recipe> {
    const response = await authFetch('/api/v1/ai/recipe/season', {
        method: 'GET'
        })

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de la génération de la recette de saison");
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Recipe;
    };

    return json.data;
}






