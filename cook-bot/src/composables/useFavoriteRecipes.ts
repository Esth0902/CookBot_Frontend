import { ref, computed } from 'vue';
import type { Recipe } from '@/services/aiAPI';
import { getAllRecipes, toggleFavoriteRecipe, deleteRecipe } from '@/services/recipeAPI';

export function useFavoriteRecipes() {
    const loadingRecipes = ref(false);
    const recipeError = ref('');
    const recipes = ref<Recipe[]>([]);
    const togglingFavoriteID = ref<number | null>(null);
    const deletingRecipeID = ref<number | null>(null);
    const favoriteRecipes = computed(() =>
        recipes.value.filter((r) => r.isFavorite),
    );

    async function fetchRecipes() {
        loadingRecipes.value = true;
        recipeError.value = '';
        try {
            recipes.value = await getAllRecipes();
        } catch (err) {
            console.error(err);
            recipeError.value =
                err instanceof Error
                    ? err.message
                    : 'Erreur lors du chargement des recettes';
        } finally {
            loadingRecipes.value = false;
        }
    }

    async function toggleFavorite(rec: Recipe) {
        togglingFavoriteID.value = rec.id;
        recipeError.value = '';

        try {
            await toggleFavoriteRecipe(rec.id);

            recipes.value = recipes.value.map((r) =>
                r.id === rec.id
                    ? { ...r, isFavorite: !r.isFavorite }
                    : r,
            );
        } catch (err) {
            console.error(err);
            recipeError.value =
                err instanceof Error
                    ? err.message
                    : 'Erreur lors de la modification du favori';
        } finally {
            togglingFavoriteID.value = null;
        }
    }

    async function removeRecipe(rec: Recipe) {
        deletingRecipeID.value = rec.id;
        recipeError.value = '';
        try {
            await deleteRecipe(rec.id);
            recipes.value = recipes.value.filter((r) => r.id !== rec.id);
        } catch (err) {
            recipeError.value =
                err instanceof Error
                    ? err.message
                    : 'Erreur lors de la suppression de la recette';
        } finally {
            deletingRecipeID.value = null;
        }
    }

    return {
        loadingRecipes,
        recipeError,
        recipes,
        favoriteRecipes,
        togglingFavoriteID,
        deletingRecipeID,

        fetchRecipes,
        toggleFavorite,
        removeRecipe,
    };
}