import { create } from 'zustand';

interface CartStore {
  readonly items: Readonly<Record<string, number>>; // productId → qty
  readonly totalCount: number;
  readonly addToCart: (id: string) => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  items: {},
  totalCount: 0,
  addToCart: (id) =>
    set((state) => ({
      items: { ...state.items, [id]: (state.items[id] ?? 0) + 1 },
      totalCount: state.totalCount + 1,
    })),
}));
