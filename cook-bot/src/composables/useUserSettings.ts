import { reactive, toRefs } from 'vue';
import { getUserSetting } from '@/services/settingsAPI';

const state = reactive({
    nbPeople: 1,
    isLoading: false,
    hasLoaded: false,
});

export function useUserSettings() {

    const loadUserSettings = async (force = false) => {
        if (state.hasLoaded && !force) return;

        state.isLoading = true;
        try {
            const settings = await getUserSetting();
            state.nbPeople = settings.nbPeople || 1;
            state.hasLoaded = true;
        } catch (e) {
            console.error("Erreur chargement settings", e);
        } finally {
            state.isLoading = false;
        }
    };

    return {
        ...toRefs(state),
        loadUserSettings
    };
}