import { ref } from 'vue';
import type { Recipe, RecipeTitle, IngredientInput } from '@/services/aiAPI';
import {
    generateRecipeFromImage,
    generateRecipeTitleFromImage,
    generateRecipeFromIngredients,
    generateRecipeTitleFromIngredients,
    generateRecipeFromDish,
} from '@/services/aiAPI';

export function useAiRecipes() {
    const loadingAi = ref(false);
    const aiError = ref('');
    const aiRecipe = ref<Recipe | null>(null);
    const aiRecipeTitles = ref<RecipeTitle[] | null>(null);

    function resetState() {
        aiError.value = '';
        aiRecipe.value = null;
        aiRecipeTitles.value = null;
    }

    async function withAiState<T>(
        fn: () => Promise<T>,
        onSuccess: (res: T) => void,
        defaultError: string,
    ) {
        resetState();
        loadingAi.value = true;
        try {
            const res = await fn();
            onSuccess(res);
        } catch (err) {
            console.error(err);
            aiError.value =
                err instanceof Error ? err.message : defaultError;
        } finally {
            loadingAi.value = false;
        }
    }

    async function getTitlesFromIngredients(ingredients: IngredientInput[]) {
        if (!ingredients.length) {
            aiError.value = 'Ajoute au moins un ingrédient';
            return;
        }

        await withAiState(
            () => generateRecipeTitleFromIngredients(ingredients),
            (titles) => {
                aiRecipeTitles.value = titles;
            },
            'Erreur lors de la génération de la recette depuis les ingrédients',
        );
    }

    async function getRecipeFromIngredients(ingredients: IngredientInput[]) {
        if (!ingredients.length) {
            aiError.value = 'Ajoute au moins un ingrédient';
            return;
        }

        await withAiState(
            () => generateRecipeFromIngredients(ingredients),
            (recipe) => {
                aiRecipe.value = recipe;
            },
            'Erreur lors de la génération de la recette depuis les ingrédients',
        );
    }

    async function getTitlesFromImage(photo: any) {
        if (!photo) {
            aiError.value = 'Prends une photo d’abord';
            return;
        }

        await withAiState(
            () => generateRecipeTitleFromImage(photo),
            (titles) => {
                aiRecipeTitles.value = titles;
            },
            'Erreur lors de la génération des idées de recettes depuis la photo',
        );
    }

    async function getRecipeFromImage(photo: any) {
        if (!photo) {
            aiError.value = 'Prends une photo d’abord';
            return;
        }

        await withAiState(
            () => generateRecipeFromImage(photo),
            (recipe) => {
                aiRecipe.value = recipe;
            },
            'Erreur lors de la génération de la recette depuis la photo',
        );
    }

    function setRecipeFromFavorite(recipe: Recipe) {
        aiError.value = '';
        aiRecipeTitles.value = null;
        aiRecipe.value = recipe;
    }

    async function getRecipeFromDish(dish: string) {
        if (!dish || !dish.trim()) {
            aiError.value = 'Entre un nom de plat';
            return;
        }

        await withAiState(
            () => generateRecipeFromDish(dish),
            (recipe) => {
                aiRecipe.value = recipe;
            },
            'Erreur lors de la génération de la recette depuis le plat',
        );
    }

    return {
        loadingAi,
        aiError,
        aiRecipe,
        aiRecipeTitles,
        getTitlesFromIngredients,
        getRecipeFromIngredients,
        getTitlesFromImage,
        getRecipeFromImage,
        getRecipeFromDish,
    };
}