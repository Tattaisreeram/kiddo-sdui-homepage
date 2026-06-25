import type React from 'react';
import type { Block, KnownBlockType } from '../types/sdui';
import BannerHero from '../components/blocks/BannerHero';
import ProductGrid2x2 from '../components/blocks/ProductGrid2x2';
import DynamicCollection from '../components/blocks/DynamicCollection';

export type BlockFactory = React.ComponentType<{ readonly block: Block }>;

// Hash-map registry — no switch statements.
// React.memo returns MemoExoticComponent which is not structurally identical to
// ComponentType, so we use `as unknown as BlockFactory` to satisfy the Record type
// while keeping the registry itself fully typed via the KnownBlockType key.
const registry: Record<KnownBlockType, BlockFactory> = {
  BANNER_HERO: BannerHero as unknown as BlockFactory,
  PRODUCT_GRID_2X2: ProductGrid2x2 as unknown as BlockFactory,
  DYNAMIC_COLLECTION: DynamicCollection as unknown as BlockFactory,
};

export function resolveComponent(type: string): BlockFactory | null {
  return type in registry ? registry[type as KnownBlockType] : null;
}
