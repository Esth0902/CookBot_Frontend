import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ConnectedHomePage from '@/views/ConnectedHomePage.vue';
import { getToken, getUserPlan } from '@/services/authApi';

vi.mock('@/services/authApi', () => ({
    getToken: vi.fn(),
    getUserPlan: vi.fn(),
}));

vi.mock('jwt-decode', () => ({
    jwtDecode: vi.fn(() => ({ sub: 'TestUser' })),
}));

vi.mock('@/services/aiAPI', () => ({
    generateDailyRecipe: vi.fn(),
}));

vi.mock('@/components/HeaderComponent.vue', () => ({ default: {
        template: '<div>Mocked Header</div>'
    } }));
vi.mock('@/components/AiRecipeResult.vue', () => ({default: {
        template: '<div>Mocked Recipe Result</div>'
    } }));


describe('Composant: ConnectedHomePage - Affichage par Rôle', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        (getToken as any).mockReturnValue('dummy.token.123');    });

    it('doit afficher la section FREE et le composant de Pricing si utilisateur FREE', async () => {
        (getUserPlan as any).mockReturnValue('FREE');

        const wrapper = mount(ConnectedHomePage, {
            global: {
                stubs: {
                    'ion-page': { template: '<div><slot /></div>' },
                    'ion-content': { template: '<div><slot /></div>' },
                    'ion-button': true,
                    'ion-spinner': true,
                    'ion-img': true,
                    PricingComponent: true,
                },
            },
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.find('.home-free-section').exists()).toBe(true);
        expect(wrapper.find('img[alt="Publicité CookBot"]').exists()).toBe(true);
        expect(wrapper.find('.home-offer-card').exists()).toBe(true);
        expect(wrapper.find('.home-premium').exists()).toBe(false);
    });

});