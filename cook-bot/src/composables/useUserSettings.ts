import { reactive, toRefs } from 'vue';
import { getUserSetting } from '@/services/settingsAPI';
import { getUserPlan } from '@/services/authApi';

const state = reactive({
    nbPeople: 1,
    isPremium : false,
    isLoading: false,
    hasLoaded: false,
});

export function useUserSettings() {

    const checkPremiumStatus = () => {
        const plan = getUserPlan();
        console.log("Mise à jour statut Premium. Plan détecté :", plan);
        state.isPremium = (plan === 'PREMIUM');
    };

    const loadUserSettings = async (force = false) => {
        checkPremiumStatus();

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
        loadUserSettings,
        checkPremiumStatus
    };
}