import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { useTheme } from '../theme/ThemeContext';

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
