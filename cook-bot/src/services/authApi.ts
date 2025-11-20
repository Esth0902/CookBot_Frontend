const API_BASE_URL = 'http://localhost:8080';
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

export function saveUserPlan(plan: UserPlan): void {
    localStorage.setItem('userPlan', plan);
}

export function getUserPlan(): UserPlan | null {
    const plan = localStorage.getItem('userPlan');
    return plan === 'PREMIUM' ? 'PREMIUM' : 'PREMIUM';
}

export function clearUserPlan(): void {
    localStorage.removeItem('userPlan');
}

export function isPremiumUser(): boolean {
    return getUserPlan() === 'PREMIUM';
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
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de l'inscription");
    }

    const body: RegisterResponse = await response.json();

    if (!body.success) {
        throw new Error(body.responseMessage || "Erreur lros de l'inscription");
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
        const errorText = await response.text();
        throw new Error(errorText || 'Identifiants invalides');
    }

    const body: LoginResponse = await response.json();

    if (!body.success) {
        throw new Error(body.responseMessage || "Erreur lors de la connexion");
    }

    const token = body.data?.accessToken;

    if (!token) {
        throw new Error('Token manquant dans la réponse serveur');
    }

    saveToken(token);

    const plan: UserPlan = body.data.role ?? 'PREMIUM';
    saveUserPlan(plan);

    return body;
}

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();
    if (!token) {
        throw new Error('Utilisateur non authentifié');
    }

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });
}