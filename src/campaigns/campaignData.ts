import type { CampaignDefinition, DynamicCollectionBlock } from '../types/sdui';
import { defaultSpacing, defaultTypography, defaultRadii } from '../theme/defaultTheme';

// ─── Back to School ──────────────────────────────────────────────────────────

const btsRow: DynamicCollectionBlock = {
  id: 'blk-camp-bts-lunchboxes',
  type: 'DYNAMIC_COLLECTION',
  data: {
    title: 'Lunchboxes & Bags',
    layout: 'horizontal_scroll',
    showViewAll: true,
    viewAllAction: {
      type: 'DEEP_LINK',
      payload: { url: 'kiddo://collection/lunchboxes-bags' },
    },
    items: [
      {
        id: 'bts-item-1',
        imageUrl: 'https://picsum.photos/seed/bts-tiffin/110/110',
        label: 'Tiffin Box Set',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/bts-tiffin' } },
      },
      {
        id: 'bts-item-2',
        imageUrl: 'https://picsum.photos/seed/bts-bag/110/110',
        label: 'School Bag',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/bts-bag' } },
      },
      {
        id: 'bts-item-3',
        imageUrl: 'https://picsum.photos/seed/bts-bottle/110/110',
        label: 'Water Bottle',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/bts-bottle' } },
      },
      {
        id: 'bts-item-4',
        imageUrl: 'https://picsum.photos/seed/bts-pouch/110/110',
        label: 'Pencil Pouch',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/bts-pouch' } },
      },
      {
        id: 'bts-item-5',
        imageUrl: 'https://picsum.photos/seed/bts-kit/110/110',
        label: 'Lunch Kit',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/bts-kit' } },
      },
      {
        id: 'bts-item-6',
        imageUrl: 'https://picsum.photos/seed/bts-stationary/110/110',
        label: 'Stationery Set',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/bts-stationary' } },
      },
    ],
  },
};

const backToSchool: CampaignDefinition = {
  id: 'back-to-school',
  name: 'Back to School',
  injectAfterBlockId: 'blk-01',
  injectBlocks: [btsRow],
  themeOverride: {
    id: 'back-to-school',
    colors: {
      background: '#FFFDE7',
      surface: '#FFF9C4',
      surfaceVariant: '#FFF176',
      primary: '#1565C0',
      primaryForeground: '#FFFFFF',
      secondary: '#F9A825',
      secondaryForeground: '#1A1A1A',
      text: '#1A237E',
      textSecondary: '#3949AB',
      textMuted: '#7986CB',
      border: '#C5CAE9',
      error: '#E53E3E',
      success: '#38A169',
    },
    spacing: defaultSpacing,
    typography: defaultTypography,
    radii: defaultRadii,
  },
  overlay: {
    id: 'overlay-back-to-school',
    type: 'image',
    animation_url: 'https://cdn.kiddo.in/overlays/back-to-school-burst.webp',
    loop: false,
    autoPlay: true,
    backdropOpacity: 0.2,
    autoDismissMs: 3000,
  },
};

// ─── Summer Playhouse ─────────────────────────────────────────────────────────

const summerRow: DynamicCollectionBlock = {
  id: 'blk-camp-summer-play',
  type: 'DYNAMIC_COLLECTION',
  data: {
    title: 'Petting Zoo & Beach Play',
    layout: 'horizontal_scroll',
    showViewAll: true,
    viewAllAction: {
      type: 'DEEP_LINK',
      payload: { url: 'kiddo://collection/summer-play' },
    },
    items: [
      {
        id: 'sp-item-1',
        imageUrl: 'https://picsum.photos/seed/sp-zoo/110/110',
        label: 'Petting Zoo Ticket',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://event/petting-zoo' } },
      },
      {
        id: 'sp-item-2',
        imageUrl: 'https://picsum.photos/seed/sp-ball/110/110',
        label: 'Beach Ball',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/sp-ball' } },
      },
      {
        id: 'sp-item-3',
        imageUrl: 'https://picsum.photos/seed/sp-sand/110/110',
        label: 'Sand Play Set',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/sp-sand' } },
      },
      {
        id: 'sp-item-4',
        imageUrl: 'https://picsum.photos/seed/sp-pool/110/110',
        label: 'Inflatable Pool',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/sp-pool' } },
      },
      {
        id: 'sp-item-5',
        imageUrl: 'https://picsum.photos/seed/sp-squirt/110/110',
        label: 'Water Squirter',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/sp-squirt' } },
      },
      {
        id: 'sp-item-6',
        imageUrl: 'https://picsum.photos/seed/sp-goggles/110/110',
        label: 'Swim Goggles',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/sp-goggles' } },
      },
    ],
  },
};

const summerPlayhouse: CampaignDefinition = {
  id: 'summer-playhouse',
  name: 'Summer Playhouse',
  injectAfterBlockId: 'blk-06',
  injectBlocks: [summerRow],
  themeOverride: {
    id: 'summer-playhouse',
    colors: {
      background: '#E0F7FA',
      surface: '#B2EBF2',
      surfaceVariant: '#80DEEA',
      primary: '#006064',
      primaryForeground: '#FFFFFF',
      secondary: '#FF7043',
      secondaryForeground: '#FFFFFF',
      text: '#004D40',
      textSecondary: '#00695C',
      textMuted: '#4DB6AC',
      border: '#B2DFDB',
      error: '#E53E3E',
      success: '#38A169',
    },
    spacing: defaultSpacing,
    typography: defaultTypography,
    radii: defaultRadii,
  },
  overlay: {
    id: 'overlay-summer-playhouse',
    type: 'image',
    animation_url: 'https://cdn.kiddo.in/overlays/summer-splash.webp',
    loop: false,
    autoPlay: true,
    backdropOpacity: 0.15,
    autoDismissMs: 3500,
  },
};

// ─── Mystery Gift Carnival ────────────────────────────────────────────────────

const mysteryRow: DynamicCollectionBlock = {
  id: 'blk-camp-mystery-picks',
  type: 'DYNAMIC_COLLECTION',
  data: {
    title: 'Mystery Gift Picks',
    layout: 'horizontal_scroll',
    showViewAll: false,
    items: [
      {
        id: 'mg-item-1',
        imageUrl: 'https://picsum.photos/seed/mg-box1/110/110',
        label: 'Mystery Box Lv.1',
        action: {
          type: 'APPLY_MYSTERY_GIFT_COUPON',
          payload: {
            couponCode: 'MYSTERY-BOX-1',
            campaignId: 'mystery-gift-carnival',
            expiresAt: '2026-07-15T23:59:59+05:30',
          },
        },
      },
      {
        id: 'mg-item-2',
        imageUrl: 'https://picsum.photos/seed/mg-box2/110/110',
        label: 'Mystery Box Lv.2',
        action: {
          type: 'APPLY_MYSTERY_GIFT_COUPON',
          payload: {
            couponCode: 'MYSTERY-BOX-2',
            campaignId: 'mystery-gift-carnival',
            expiresAt: '2026-07-15T23:59:59+05:30',
          },
        },
      },
      {
        id: 'mg-item-3',
        imageUrl: 'https://picsum.photos/seed/mg-toy/110/110',
        label: 'Surprise Toy Pack',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/mg-toy' } },
      },
      {
        id: 'mg-item-4',
        imageUrl: 'https://picsum.photos/seed/mg-lucky/110/110',
        label: 'Lucky Dip Bundle',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/mg-lucky' } },
      },
      {
        id: 'mg-item-5',
        imageUrl: 'https://picsum.photos/seed/mg-snack/110/110',
        label: 'Mystery Snack Kit',
        action: { type: 'DEEP_LINK', payload: { url: 'kiddo://product/mg-snack' } },
      },
    ],
  },
};

const mysteryGiftCarnival: CampaignDefinition = {
  id: 'mystery-gift-carnival',
  name: 'Mystery Gift Carnival',
  injectAfterBlockId: 'blk-15',
  injectBlocks: [mysteryRow],
  themeOverride: {
    id: 'mystery-gift-carnival',
    colors: {
      background: '#FFF5F5',
      surface: '#FFEBEE',
      surfaceVariant: '#FFCDD2',
      primary: '#C62828',
      primaryForeground: '#FFFFFF',
      secondary: '#FFD600',
      secondaryForeground: '#1A1A1A',
      text: '#B71C1C',
      textSecondary: '#C62828',
      textMuted: '#EF9A9A',
      border: '#FFCDD2',
      error: '#E53E3E',
      success: '#38A169',
    },
    spacing: defaultSpacing,
    typography: defaultTypography,
    radii: defaultRadii,
  },
  overlay: {
    id: 'overlay-mystery-carnival',
    type: 'lottie',
    animation_url: 'https://cdn.kiddo.in/lottie/carnival-confetti.json',
    loop: false,
    autoPlay: true,
    backdropOpacity: 0.3,
    autoDismissMs: 4000,
  },
};

export const CAMPAIGNS: readonly CampaignDefinition[] = [
  backToSchool,
  summerPlayhouse,
  mysteryGiftCarnival,
];
