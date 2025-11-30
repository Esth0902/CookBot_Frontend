import { ref } from 'vue';
import type { Recipe } from '@/services/aiAPI';
import { getFavoriteRecipes, toggleFavoriteRecipe } from '@/services/recipeAPI';

export function useFavoriteRecipes() {
  const loadingFavorites = ref(false);
  const favoritesError = ref('');
  const favoriteRecipes = ref<Recipe[]>([]);
  const togglingFavoriteID = ref<number | null>(null);

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

  async function toggleFavorite(rec: Recipe) {
      togglingFavoriteID.value = rec.id;
      favoritesError.value = '';

      try {
          await toggleFavoriteRecipe(rec.id);
          favoriteRecipes.value = favoriteRecipes.value.filter(
              (r) => r.id !== rec.id,
          );
      } catch (err) {
          console.error(err);
          favoritesError.value =
            err instanceof Error
                ? err.message
                : 'Erreur lors de la modification du favori';
      } finally {
          togglingFavoriteID.value = null;
      }
  }

  return {
    loadingFavorites,
    favoritesError,
    favoriteRecipes,
    fetchFavoriteRecipes,
    toggleFavorite,
    togglingFavoriteID,
  };
}