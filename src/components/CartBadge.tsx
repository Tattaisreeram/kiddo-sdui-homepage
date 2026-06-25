import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { useTheme } from '../theme/ThemeContext';

/**
 * Subscribes ONLY to totalCount via a Zustand selector.
 * When individual items change but totalCount does not (impossible with addToCart,
 * but safe by design), this component will not re-render. The primitive selector
 * return value is compared with === so Zustand skips the re-render when the
 * number hasn't changed.
 */
export const CartBadge = React.memo(function CartBadge() {
  const totalCount = useCartStore((s) => s.totalCount);
  const { theme } = useTheme();

  if (totalCount === 0) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radii.full,
          borderColor: theme.colors.surface,
        },
      ]}
      accessibilityLabel={`${totalCount} items in cart`}
    >
      <Text
        style={[
          styles.count,
          {
            color: theme.colors.primaryForeground,
            fontFamily: theme.typography.fontFamilyBold,
            fontSize: theme.typography.sizeXs,
          },
        ]}
      >
        {totalCount > 99 ? '99+' : totalCount}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: { lineHeight: 14 },
});
