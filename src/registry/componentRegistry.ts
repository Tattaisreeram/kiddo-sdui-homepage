import type React from 'react';
import type { Block, KnownBlockType } from '../types/sdui';
import BannerHero from '../components/blocks/BannerHero';
import ProductGrid2x2 from '../components/blocks/ProductGrid2x2';
import DynamicCollection from '../components/blocks/DynamicCollection';

export type BlockFactory = React.ComponentType<{ readonly block: Block }>;

// MemoExoticComponent isn't structurally assignable to ComponentType, so cast
const registry: Record<KnownBlockType, BlockFactory> = {
  BANNER_HERO: BannerHero as unknown as BlockFactory,
  PRODUCT_GRID_2X2: ProductGrid2x2 as unknown as BlockFactory,
  DYNAMIC_COLLECTION: DynamicCollection as unknown as BlockFactory,
};

export function resolveComponent(type: string): BlockFactory | null {
  return type in registry ? registry[type as KnownBlockType] : null;
}
