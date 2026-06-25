import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRecyclingState } from '@shopify/flash-list';
import type { Block, Product } from '../../types/sdui';
import { isProductGrid2x2Block } from '../../types/sdui';
import { handleAction } from '../../actions/dispatcher';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../theme/ThemeContext';

// Re-render isolation:
// - React.memo: ProductGrid2x2 never re-renders from cart changes, so props are stable
// - selector returns a primitive so only the matching product triggers a re-render
// - useRecyclingState resets localQty synchronously on cell recycle (no stale count flash)
const ProductCard = React.memo(function ProductCard({ product }: { readonly product: Product }) {
  const { theme } = useTheme();

  // ── selector: re-renders ONLY when this product's cart qty changes ────────
  const cartQty = useCartStore((s) => s.items[product.id] ?? 0);

  // ── local stepper: resets to 0 when FlashList recycles this cell ─────────
  const [localQty, setLocalQty] = useRecyclingState<number>(0, [product.id]);

  // ── render-count log: confirms sibling cards stay silent ─────────────────
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  if (__DEV__) {
    console.log(`[render] ProductCard ${product.id} #${renderCount.current}  cartQty=${cartQty}  localQty=${localQty}`);
  }

  const handleAdd = () => {
    useCartStore.getState().addToCart(product.id);
    setLocalQty((q) => q + 1);
    handleAction(product.addToCartAction);
  };

  const inCartLabel = cartQty > 0 ? ` (${cartQty} in cart)` : '';

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.card,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleAction(product.tapAction)}
      accessibilityRole="button"
      accessibilityLabel={product.name}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          contentFit="cover"
        />
        {product.badge !== undefined && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primary, borderRadius: theme.radii.sm },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: theme.colors.primaryForeground,
                  fontSize: theme.typography.sizeXs,
                  fontFamily: theme.typography.fontFamilyBold,
                },
              ]}
            >
              {product.badge}
            </Text>
          </View>
        )}
        {!product.inStock && (
          <View
            style={[
              styles.outOfStock,
              { borderRadius: theme.radii.card },
            ]}
          >
            <Text
              style={[
                styles.outOfStockText,
                {
                  color: theme.colors.primaryForeground,
                  fontSize: theme.typography.sizeSm,
                  fontFamily: theme.typography.fontFamilyBold,
                },
              ]}
            >
              Out of Stock
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.cardBody, { padding: theme.spacing.sm }]}>
        <Text
          style={[
            styles.brand,
            {
              color: theme.colors.textMuted,
              fontSize: theme.typography.sizeXs,
              fontFamily: theme.typography.fontFamilyRegular,
            },
          ]}
          numberOfLines={1}
        >
          {product.brand}
        </Text>
        <Text
          style={[
            styles.name,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizeSm,
              fontFamily: theme.typography.fontFamilyBold,
            },
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              {
                color: theme.colors.primary,
                fontSize: theme.typography.sizeMd,
                fontFamily: theme.typography.fontFamilyBold,
              },
            ]}
          >
            {'₹'}{product.priceInr}
          </Text>
          {product.originalPriceInr !== undefined && (
            <Text
              style={[
                styles.originalPrice,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizeXs,
                  fontFamily: theme.typography.fontFamilyRegular,
                },
              ]}
            >
              {'₹'}{product.originalPriceInr}
            </Text>
          )}
        </View>
        {product.inStock && (
          <Pressable
            style={[
              styles.addBtn,
              {
                backgroundColor: localQty > 0
                  ? theme.colors.success
                  : theme.colors.primary,
                borderRadius: theme.radii.button,
              },
            ]}
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart${inCartLabel}`}
          >
            <Text
              style={[
                styles.addBtnText,
                {
                  color: theme.colors.primaryForeground,
                  fontSize: theme.typography.sizeSm,
                  fontFamily: theme.typography.fontFamilyBold,
                },
              ]}
            >
              {localQty === 0 ? 'Add' : `${localQty} Added`}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});

const ProductGrid2x2 = React.memo(function ProductGrid2x2({ block }: { readonly block: Block }) {
  const { theme } = useTheme();
  if (!isProductGrid2x2Block(block)) return null;
  const { data } = block;

  const visibleProducts = data.products.slice(0, 4);
  const { viewAllAction } = data;

  return (
    <View style={[styles.container, { padding: theme.spacing.md }]}>
      {data.title !== undefined && (
        <View style={styles.header}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizeLg,
                fontFamily: theme.typography.fontFamilyBold,
              },
            ]}
          >
            {data.title}
          </Text>
          {viewAllAction !== undefined && (
            <Pressable
              onPress={() => handleAction(viewAllAction)}
              accessibilityRole="link"
              accessibilityLabel="View all products"
            >
              <Text
                style={[
                  styles.viewAll,
                  {
                    color: theme.colors.primary,
                    fontSize: theme.typography.sizeSm,
                    fontFamily: theme.typography.fontFamilyBold,
                  },
                ]}
              >
                View All
              </Text>
            </Pressable>
          )}
        </View>
      )}
      <View style={[styles.grid, { gap: theme.spacing.sm }]}>
        {visibleProducts.map((product) => (
          <View key={product.id} style={styles.gridCell}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </View>
  );
});

export default ProductGrid2x2;

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {},
  viewAll: {},
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridCell: { width: '50%' },
  card: { overflow: 'hidden', borderWidth: 1 },
  imageWrap: {},
  productImage: { width: '100%', aspectRatio: 1 },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {},
  outOfStock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {},
  cardBody: {},
  brand: { marginBottom: 2 },
  name: { marginBottom: 6 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  price: {},
  originalPrice: { textDecorationLine: 'line-through' },
  addBtn: { alignItems: 'center', paddingVertical: 6 },
  addBtnText: {},
});
