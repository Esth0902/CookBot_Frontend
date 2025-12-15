import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveToken, getToken, isPremiumUser, authFetch } from '@/services/authApi';
import { jwtDecode } from 'jwt-decode';

vi.mock('jwt-decode');

const localStorageMock = (function() {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.fetch = vi.fn();

Object.defineProperty(window, 'location', {
    value: { href: '' },
    writable: true
});

describe('Auth Service', () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('saveToken doit stocker le token dans localStorage', () => {
        saveToken('mon-super-token');
        expect(localStorage.getItem('jwtToken')).toBe('mon-super-token');
    });

    it('isPremiumUser doit retourner true si le rôle est PREMIUM', () => {
        saveToken('token-premium');

        vi.mocked(jwtDecode).mockReturnValue({ role: 'PREMIUM' });

        expect(isPremiumUser()).toBe(true);
    });

    it('isPremiumUser doit retourner false si le rôle est FREE', () => {
        saveToken('token-free');

        vi.mocked(jwtDecode).mockReturnValue({ role: 'FREE' });

        expect(isPremiumUser()).toBe(false);
    });

    it('authFetch doit ajouter le Header Authorization', async () => {
        saveToken('valid-token');

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        });

        await authFetch('/test');

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/test'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer valid-token'
                })
            })
        );
    });

    it('authFetch doit déconnecter l\'utilisateur si erreur 401', async () => {
        saveToken('expired-token');

        (global.fetch as any).mockResolvedValue({
            status: 401,
            ok: false,
            text: async () => 'Unauthorized'
        });

        await expect(authFetch('/test')).rejects.toThrow('Session expirée');

        expect(getToken()).toBeNull();
        expect(window.location.href).toContain('/login');
    });
});