import type { CampaignDefinition } from '../types/sdui';
import { defaultSpacing, defaultTypography, defaultRadii } from '../theme/defaultTheme';

const backToSchool: CampaignDefinition = {
  id: 'back-to-school',
  name: 'Back to School',
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

const summerPlayhouse: CampaignDefinition = {
  id: 'summer-playhouse',
  name: 'Summer Playhouse',
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

const mysteryGiftCarnival: CampaignDefinition = {
  id: 'mystery-gift-carnival',
  name: 'Mystery Gift Carnival',
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
