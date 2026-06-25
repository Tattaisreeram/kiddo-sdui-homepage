import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import type { Block, CollectionItem } from '../../types/sdui';
import { isDynamicCollectionBlock } from '../../types/sdui';
import { handleAction } from '../../actions/dispatcher';
import { useTheme } from '../../theme/ThemeContext';

const CollectionItemCard = React.memo(function CollectionItemCard({
  item,
}: {
  readonly item: CollectionItem;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      style={[styles.itemCard, { marginRight: theme.spacing.sm }]}
      onPress={() => handleAction(item.action)}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.itemImage, { borderRadius: theme.radii.card }]}
        contentFit="cover"
      />
      <Text
        style={[
          styles.itemLabel,
          {
            color: theme.colors.text,
            fontSize: theme.typography.sizeSm,
            fontFamily: theme.typography.fontFamilyRegular,
          },
        ]}
        numberOfLines={2}
      >
        {item.label}
      </Text>
    </Pressable>
  );
});

const DynamicCollection = React.memo(function DynamicCollection({
  block,
}: {
  readonly block: Block;
}) {
  const { theme } = useTheme();
  if (!isDynamicCollectionBlock(block)) return null;
  const { data } = block;
  const { viewAllAction } = data;

  const keyExtractor = React.useCallback((item: CollectionItem) => item.id, []);
  const renderItem = React.useCallback(
    ({ item }: { item: CollectionItem }) => <CollectionItemCard item={item} />,
    [],
  );

  return (
    <View style={[styles.container, { paddingVertical: theme.spacing.md }]}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
        ]}
      >
        <View style={styles.titleBlock}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizeLg,
                fontFamily: theme.typography.fontFamilyBold,
              },
            ]}
          >
            {data.title}
          </Text>
          {data.subtitle !== undefined && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizeSm,
                  fontFamily: theme.typography.fontFamilyRegular,
                },
              ]}
            >
              {data.subtitle}
            </Text>
          )}
        </View>
        {data.showViewAll && viewAllAction !== undefined && (
          <Pressable
            onPress={() => handleAction(viewAllAction)}
            accessibilityRole="link"
            accessibilityLabel="View all"
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
      <FlashList
        horizontal
        data={data.items as CollectionItem[]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

export default DynamicCollection;

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleBlock: { flex: 1, marginRight: 8 },
  title: {},
  subtitle: { marginTop: 2 },
  viewAll: {},
  itemCard: { width: 110 },
  itemImage: { width: 110, height: 110 },
  itemLabel: { marginTop: 6, textAlign: 'center' },
});
