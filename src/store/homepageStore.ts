import { create } from 'zustand';
import type { Campaign } from '../types/sdui';

interface CartItem {
  readonly qty: number;
  readonly variantId?: string;
}

interface HomepageStore {
  // cart
  readonly items: Readonly<Record<string, CartItem>>;
  readonly addToCart: (productId: string, qty: number, variantId?: string) => void;
  readonly removeFromCart: (productId: string) => void;
  readonly clearCart: () => void;
  // campaign
  readonly activeCampaign: Campaign | null;
  readonly activateCampaign: (campaign: Campaign) => void;
  readonly dismissCampaign: () => void;
}

export const useHomepageStore = create<HomepageStore>()((set) => ({
  items: {},

  addToCart: (productId, qty, variantId) =>
    set((state) => {
      const existing = state.items[productId];
      return {
        items: {
          ...state.items,
          [productId]: {
            qty: (existing?.qty ?? 0) + qty,
            variantId: variantId ?? existing?.variantId,
          },
        },
      };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const next: Record<string, CartItem> = { ...state.items };
      delete next[productId];
      return { items: next };
    }),

  clearCart: () => set({ items: {} }),

  activeCampaign: null,
  activateCampaign: (campaign) => set({ activeCampaign: campaign }),
  dismissCampaign: () => set({ activeCampaign: null }),
}));
