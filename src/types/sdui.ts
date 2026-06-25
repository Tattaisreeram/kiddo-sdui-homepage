// ─── Theme ────────────────────────────────────────────────────────────────────

export interface ColorTokens {
  readonly background: string;
  readonly surface: string;
  readonly surfaceVariant: string;
  readonly primary: string;
  readonly primaryForeground: string;
  readonly secondary: string;
  readonly secondaryForeground: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly border: string;
  readonly error: string;
  readonly success: string;
}

export interface SpacingTokens {
  readonly xs: number;   // 4
  readonly sm: number;   // 8
  readonly md: number;   // 16
  readonly lg: number;   // 24
  readonly xl: number;   // 32
  readonly '2xl': number; // 48
}

export interface TypographyTokens {
  readonly fontFamilyRegular: string;
  readonly fontFamilyBold: string;
  readonly sizeXs: number;
  readonly sizeSm: number;
  readonly sizeMd: number;
  readonly sizeLg: number;
  readonly sizeXl: number;
  readonly size2Xl: number;
  readonly lineHeightBody: number;
  readonly lineHeightHeading: number;
}

export interface RadiiTokens {
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly full: number;
  readonly card: number;
  readonly button: number;
}

export interface Theme {
  readonly id: string;
  readonly colors: ColorTokens;
  readonly spacing: SpacingTokens;
  readonly typography: TypographyTokens;
  readonly radii: RadiiTokens;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export interface AddToCartAction {
  readonly type: 'ADD_TO_CART';
  readonly payload: {
    readonly productId: string;
    readonly qty: number;
    readonly variantId?: string;
  };
}

export interface DeepLinkAction {
  readonly type: 'DEEP_LINK';
  readonly payload: {
    readonly url: string;
    readonly presentationStyle?: 'push' | 'modal' | 'sheet';
  };
}

export interface ApplyMysteryGiftCouponAction {
  readonly type: 'APPLY_MYSTERY_GIFT_COUPON';
  readonly payload: {
    readonly couponCode: string;
    readonly campaignId: string;
    readonly expiresAt: string; // ISO 8601
  };
}

export type Action =
  | AddToCartAction
  | DeepLinkAction
  | ApplyMysteryGiftCouponAction;

// ─── Shared sub-shapes ────────────────────────────────────────────────────────

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly imageUrl: string;
  readonly priceInr: number;
  readonly originalPriceInr?: number;
  readonly discountPercent?: number;
  readonly badge?: string;
  readonly inStock: boolean;
  readonly rating?: number;          // 1–5
  readonly reviewCount?: number;
  readonly addToCartAction: AddToCartAction;
  readonly tapAction: DeepLinkAction;
}

export interface CollectionItem {
  readonly id: string;
  readonly imageUrl: string;
  readonly label: string;
  readonly action: Action;
}

// ─── Block data shapes ────────────────────────────────────────────────────────

export interface BannerHeroData {
  readonly imageUrl: string;
  readonly imageAltText: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly ctaLabel: string;
  readonly ctaAction: Action;
  readonly aspectRatio: number; // width / height, e.g. 1.91 for 16:8.4
  readonly hasOverlayGradient: boolean;
}

export interface ProductGrid2x2Data {
  readonly title?: string;
  readonly products: readonly Product[];
  readonly viewAllAction?: DeepLinkAction;
}

export interface DynamicCollectionData {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly CollectionItem[];
  readonly layout: 'horizontal_scroll' | 'chips';
  readonly showViewAll: boolean;
  readonly viewAllAction?: DeepLinkAction;
}

// ─── Block discriminated union ─────────────────────────────────────────────────

export interface BannerHeroBlock {
  readonly id: string;
  readonly type: 'BANNER_HERO';
  readonly data: BannerHeroData;
}

export interface ProductGrid2x2Block {
  readonly id: string;
  readonly type: 'PRODUCT_GRID_2X2';
  readonly data: ProductGrid2x2Data;
}

export interface DynamicCollectionBlock {
  readonly id: string;
  readonly type: 'DYNAMIC_COLLECTION';
  readonly data: DynamicCollectionData;
}

// Catch-all for block types the client does not yet recognise.
// type is string (not a literal) so automatic narrowing of Block by .type
// will NOT exclude this member — use the isXxxBlock type guards below instead.
export interface UnknownBlock {
  readonly id: string;
  readonly type: string;
  readonly data: Record<string, unknown>;
}

export type KnownBlockType =
  | 'BANNER_HERO'
  | 'PRODUCT_GRID_2X2'
  | 'DYNAMIC_COLLECTION';

export type Block =
  | BannerHeroBlock
  | ProductGrid2x2Block
  | DynamicCollectionBlock
  | UnknownBlock;

// Type guards — use these instead of raw equality checks on block.type
// so TypeScript narrows correctly without pulling UnknownBlock into the result.
export function isBannerHeroBlock(b: Block): b is BannerHeroBlock {
  return b.type === 'BANNER_HERO';
}
export function isProductGrid2x2Block(b: Block): b is ProductGrid2x2Block {
  return b.type === 'PRODUCT_GRID_2X2';
}
export function isDynamicCollectionBlock(b: Block): b is DynamicCollectionBlock {
  return b.type === 'DYNAMIC_COLLECTION';
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export type OverlayContent =
  | {
      readonly kind: 'lottie';
      readonly lottieUrl: string;
      readonly loop: boolean;
      readonly autoPlay: boolean;
    }
  | {
      readonly kind: 'image';
      readonly imageUrl: string;
    };

export interface Overlay {
  readonly id: string;
  readonly content: OverlayContent;
  readonly backdropOpacity: number;    // 0.0–1.0
  readonly autoDismissMs: number | null; // null = stays until dismissed explicitly
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export interface Campaign {
  readonly id: string;
  readonly name: string;
  readonly themeOverride: Theme;
  readonly overlay: Overlay;
  readonly triggerOnLoad: boolean;
  readonly expiresAt: string; // ISO 8601
}

// ─── Root Screen payload ───────────────────────────────────────────────────────

export interface Screen {
  readonly schemaVersion: string;
  readonly screenId: string;
  readonly fetchedAt: string; // ISO 8601
  readonly theme: Theme;
  readonly blocks: readonly Block[];
  readonly campaigns: readonly Campaign[];
}
