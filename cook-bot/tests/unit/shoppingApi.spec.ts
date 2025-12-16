import { describe, it, expect, vi } from 'vitest';
import { deleteItem, ShoppingList } from '@/services/shoppingApi';


vi.mock('@/services/authApi', () => ({
    authFetch: vi.fn(),
}));
import { authFetch } from '@/services/authApi';


const mockUpdatedShoppingList = {
    id: 42,
    shoppingListName: "Courses du mois",
    items: [
        { id: 101, name: "Pain", bought: false },
        { id: 102, name: "Fromage", bought: true },
    ]
} as ShoppingList;

const mockSuccessResponse = {
    success: true,
    responseCode: 200,
    responseMessage: "Item deleted successfully",
    data: mockUpdatedShoppingList,
};


describe('Service: shoppingApi', () => {

    // Test de deleteItem
    it('devrait supprimer item et retourner la liste de courses mise à jour', async () => {

        (authFetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockSuccessResponse,
        });

        const itemIdToDelete = 999;

        const updatedList = await deleteItem(itemIdToDelete);

        expect(authFetch).toHaveBeenCalledWith(
            `/api/v1/shopping/item/delete/${itemIdToDelete}`,
            expect.objectContaining({ method: 'DELETE' })
        );

        expect(updatedList.id).toBe(42);
        expect(updatedList).toHaveProperty('shoppingListName', 'Courses du mois');

        expect(Array.isArray(updatedList.items)).toBe(true);

    });

    it('doit envoyer une erreur si appel deleteItem échoue', async () => {
        (authFetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ responseMessage: 'Erreur suppression DB', success: false }),
        });

        await expect(deleteItem(99)).rejects.toThrow('Erreur suppression DB');
    });

});