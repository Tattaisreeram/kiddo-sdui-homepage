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
  readonly xs: number;
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly xl: number;
  readonly '2xl': number;
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
    readonly expiresAt: string;
  };
}

export type Action =
  | AddToCartAction
  | DeepLinkAction
  | ApplyMysteryGiftCouponAction;

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
  readonly rating?: number;
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

export interface BannerHeroData {
  readonly imageUrl: string;
  readonly imageAltText: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly ctaLabel: string;
  readonly ctaAction: Action;
  readonly aspectRatio: number;
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

// catch-all for block types the client doesn't recognise yet
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

export function isBannerHeroBlock(b: Block): b is BannerHeroBlock {
  return b.type === 'BANNER_HERO';
}
export function isProductGrid2x2Block(b: Block): b is ProductGrid2x2Block {
  return b.type === 'PRODUCT_GRID_2X2';
}
export function isDynamicCollectionBlock(b: Block): b is DynamicCollectionBlock {
  return b.type === 'DYNAMIC_COLLECTION';
}

export interface FullScreenOverlay {
  readonly id: string;
  readonly type: 'lottie' | 'image';
  readonly animation_url: string;
  readonly loop: boolean;
  readonly autoPlay: boolean;
  readonly backdropOpacity: number;
  readonly autoDismissMs: number | null;
}

/** Code-defined campaign — no expiry, no trigger flag. */
export interface CampaignDefinition {
  readonly id: string;
  readonly name: string;
  readonly themeOverride: Theme;
  readonly overlay: FullScreenOverlay;
}

/** JSON-delivered campaign — extends CampaignDefinition with server-side metadata. */
export interface Campaign extends CampaignDefinition {
  readonly triggerOnLoad: boolean;
  readonly expiresAt: string;
}

export interface Screen {
  readonly schemaVersion: string;
  readonly screenId: string;
  readonly fetchedAt: string;
  readonly theme: Theme;
  readonly blocks: readonly Block[];
  readonly campaigns: readonly Campaign[];
}
