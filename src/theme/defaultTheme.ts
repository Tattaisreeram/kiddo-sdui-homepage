import type { SpacingTokens, TypographyTokens, RadiiTokens } from '../types/sdui';

export const defaultSpacing: SpacingTokens = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48,
};

export const defaultTypography: TypographyTokens = {
  fontFamilyRegular: 'Nunito-Regular',
  fontFamilyBold: 'Nunito-Bold',
  sizeXs: 11, sizeSm: 13, sizeMd: 15, sizeLg: 18, sizeXl: 22, size2Xl: 28,
  lineHeightBody: 1.5, lineHeightHeading: 1.2,
};

export const defaultRadii: RadiiTokens = {
  sm: 4, md: 8, lg: 16, full: 9999, card: 12, button: 24,
};
