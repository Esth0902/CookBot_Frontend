import { ref } from 'vue';
import type { Recipe } from '@/services/aiAPI';
import { getFavoriteRecipes } from '@/services/recipeAPI';

export function useFavoriteRecipes() {
  const loadingFavorites = ref(false);
  const favoritesError = ref('');
  const favoriteRecipes = ref<Recipe[]>([]);

  async function fetchFavoriteRecipes() {
    loadingFavorites.value = true;
    favoritesError.value = '';
    try {
      favoriteRecipes.value = await getFavoriteRecipes();
    } catch (err) {
      console.error(err);
      favoritesError.value =
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des recettes favorites';
    } finally {
      loadingFavorites.value = false;
    }
  }

  return {
    loadingFavorites,
    favoritesError,
    favoriteRecipes,
    fetchFavoriteRecipes,
  };
}