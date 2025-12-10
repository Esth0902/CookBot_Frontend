import {authFetch} from "@/services/authApi";

export interface BackendSettings {
    darkMode: boolean;
    language: string;
    nbPeople: number;
    endedTrialDate: string | null;
    trial: boolean;
}

interface SettingsResponse {
    success: boolean;
    responseCode: number;
    responseMessage: string;
    data: BackendSettings;
}

export async function getUserSetting(): Promise<BackendSettings> {
    const response = await authFetch('/api/v1/user/settings', {
        method: 'GET',
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la récupération des réglages');
    }

    const json = await response.json() as SettingsResponse;
    return json.data;
}

export async function updateUserNbPeople(nbPeople: number) : Promise<BackendSettings> {
    const response = await authFetch("/api/v1/user/settings", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            darkMode: null,
            language: null,
            nbPeople,
        }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de la mise à jour du nombre de personnes");
    }
    const json = await response.json() as SettingsResponse;
    return json.data;
}

export interface UserPreference {
    id: number;
    allergen: string;
}

interface PreferencesResponse {
    success: boolean;
    responseCode: number;
    responseMessage: string;
    data: UserPreference[];
}

export async function getUserPreferences(): Promise<UserPreference[]> {
    const response = await authFetch('/api/v1/user/preferences', {
        method: 'GET',
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la récupération des préférences');
    }

    const json = await response.json() as PreferencesResponse;
    return json.data;
}

export async function addUserPreferences(allergens: string[]): Promise<UserPreference[]>{
    const body = allergens.map(a => ({ allergen: a }));
    const response = await authFetch('/api/v1/user/preferences', {
        method: "POST",
        headers :  {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de l'ajout des préférences");
    }
    const json = await response.json() as PreferencesResponse;
    return json.data;
}

export async function deleteUserPreferenceByName(name : string): Promise<void> {
    const response = await authFetch(
        `/api/v1/user/preference/name/${encodeURIComponent(name)}`,
        {method: 'DELETE'}
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de la suppression");
    }
}