import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import type { Block } from '../../types/sdui';
import { isBannerHeroBlock } from '../../types/sdui';
import { handleAction } from '../../actions/dispatcher';
import { useTheme } from '../../theme/ThemeContext';

const BannerHero = React.memo(function BannerHero({ block }: { readonly block: Block }) {
  const { theme } = useTheme();
  if (!isBannerHeroBlock(block)) return null;
  const { data } = block;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: data.imageUrl }}
        style={[styles.image, { aspectRatio: data.aspectRatio }]}
        contentFit="cover"
        accessibilityLabel={data.imageAltText}
      />
      {data.hasOverlayGradient && (
        <View style={styles.gradient} pointerEvents="none" />
      )}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.primaryForeground,
              fontFamily: theme.typography.fontFamilyBold,
              fontSize: theme.typography.sizeXl,
              lineHeight: theme.typography.sizeXl * theme.typography.lineHeightHeading,
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
                color: theme.colors.primaryForeground,
                fontFamily: theme.typography.fontFamilyRegular,
                fontSize: theme.typography.sizeMd,
                lineHeight: theme.typography.sizeMd * theme.typography.lineHeightBody,
              },
            ]}
          >
            {data.subtitle}
          </Text>
        )}
        <Pressable
          style={[
            styles.cta,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radii.button,
            },
          ]}
          onPress={() => handleAction(data.ctaAction)}
          accessibilityRole="button"
          accessibilityLabel={data.ctaLabel}
        >
          <Text
            style={[
              styles.ctaText,
              {
                color: theme.colors.primaryForeground,
                fontFamily: theme.typography.fontFamilyBold,
                fontSize: theme.typography.sizeMd,
              },
            ]}
          >
            {data.ctaLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

export default BannerHero;

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden' },
  image: { width: '100%' },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 8,
  },
  title: {},
  subtitle: {},
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  ctaText: { textAlign: 'center' },
});
