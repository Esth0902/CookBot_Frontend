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
    id : number;
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

async function handleJsonResponse<T>(response: Response, defaultError: string): Promise<T> {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || defaultError);
    }
    return response.json() as Promise<T>;
}

async function handleBlobFormRequest<T>(
    url: string,
    photo: UserPhoto,
    defaultError: string,
): Promise<T> {
    const blob = await userPhotoToBlob(photo);
    const formData = new FormData();
    formData.append('file', blob, photo.filepath ?? 'photo.jpg');

    const response = await authFetch(url, {
        method: 'POST',
        body: formData,
    });

    return handleJsonResponse<T>(response, defaultError);
}

export async function generateRecipeFromImage(photo: UserPhoto): Promise<Recipe> {
    const json = await handleBlobFormRequest<{
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Recipe;
    }>('/api/v1/ai/recipe/image', photo, 'Erreur lors de la génération de la recette depuis la photo');

    return json.data;
}
export async function generateRecipeTitleFromImage(photo: UserPhoto): Promise<RecipeTitle[]> {
    const json = await handleBlobFormRequest<{
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: {
            recipeTitles: RecipeTitle[];
        };
    }>(
        '/api/v1/ai/recipeTitle/image',
            photo,
        'Erreur lors de la génération de la recette depuis la photo'
        );

    return json.data.recipeTitles;
}

export async function generateRecipeTitleFromIngredients(
    ingredients: IngredientInput[],
): Promise<RecipeTitle[]> {
    const response = await authFetch('/api/v1/ai/recipeTitle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
    });

    const json = await handleJsonResponse<{
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: {
            recipeTitles: RecipeTitle[];
        };
    }>(
        response,
        'Erreur lors de la génération de la recette depuis les ingrédients'
    );

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

export async function generateRecipeFromIngredients(
    ingredients: IngredientInput[],
): Promise<Recipe> {
    const response = await authFetch('/api/v1/ai/recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ingredients}),
    });

    const json = await handleJsonResponse<{
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Recipe;
    }>(
        response,
        'Erreur lors de la génération de la recette depuis les ingrédients',
    );

    return json.data;
}



