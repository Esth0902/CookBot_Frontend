import {jwtDecode} from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'jwtToken';

export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function getUserPlan(): UserPlan | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
        const decoded = jwtDecode<{ role: UserPlan }>(token);
        console.log("JWT décodé dans getUserPlan :", decoded);
        return decoded.role ?? null;
    } catch (err) {
        console.error("Erreur en décodant le token :", err);
        return null;
    }
}

export function clearUserPlan(): void {
    localStorage.removeItem('userPlan');
}

export function isPremiumUser(): boolean {
    const plan = getUserPlan();
    console.log('isPremiumUser – plan =', plan);
    return plan === 'PREMIUM';
}

interface ApiResponse<T> {
    success: boolean;
    responseCode: number;
    responseMessage: string;
    data: T,
    errorList?: string[];
}

export type RegisterResponse = ApiResponse<string>;

export type UserPlan = 'FREE' | 'PREMIUM' | 'ADMIN';

export interface LoginData {
    accessToken: string;
    tokenType: string;
    role: UserPlan;
}

export type LoginResponse = ApiResponse<LoginData>;


export async function register(username: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || "Erreur lors de l'inscription");
    }

    const body: RegisterResponse = await response.json();

    if (!body.success) {
        throw new Error(body.responseMessage || "Erreur lors de l'inscription");
    }

    return body;
}


export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const errorText = errorBody.errorList?.[0] || "Erreur lors de la connexion"
        throw new Error(errorText);
    }

    const body: LoginResponse = await response.json();

    if (!body.success) {
        const errorBody = body.errorList?.[0] || body.responseMessage || "Erreur lors de la connexion";
        throw new Error(errorBody)
    }

    const token = body.data?.accessToken;

    if (!token) {
        throw new Error('Token manquant dans la réponse serveur');
    }

    saveToken(token);

    return body;
}

export async function anonymizeUser(): Promise<void> {
    const response = await authFetch(`/api/v1/user/anonymate`, {
        method: 'PUT',
    });
    if (!response.ok) {
        throw new Error("Erreur lors de l'anonymisation");
    }
}

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();
    if (!token) throw new Error('Utilisateur non authentifié');

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (response.status === 401) {
        const clonedResponse = response.clone();
        try {
            const body = await clonedResponse.json();

            if (body.message === "Full authentication is required to access this resource" ||
                body.responseMessage === "Full authentication is required to access this resource" ||
                body.errorList?.includes("Unauthorized")) {

                console.warn("Session expirée, redirection...");
                clearToken();
                window.location.href = '/login';
                throw new Error("Session expirée");
            }
        } catch (e) {
            console.log("401 métier ou erreur de parsing, on reste connecté.");
        }
    }
    return response;
}

export async function startTrial(): Promise<string> {
    const response = await authFetch('/api/v1/user/trial', {
        method: 'GET',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de l'activation de la période d'essai");
    }

    const body: ApiResponse<string> = await response.json();

    if (!body.success) {
        throw new Error(body.responseMessage || "Erreur lors de l'activation de l'essai");
    }

    const token = body.data;

    if (!token) {
        throw new Error('Token manquant dans la réponse serveur');
    }

    saveToken(token);

    return body.data;
}