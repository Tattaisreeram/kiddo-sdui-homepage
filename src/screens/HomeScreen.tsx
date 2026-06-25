import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import type { Block, OverlayContent, Screen } from '../types/sdui';
import { resolveComponent } from '../registry/componentRegistry';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { useHomepageStore } from '../store/homepageStore';
import { CartBadge } from '../components/CartBadge';
import screenDataJson from '../data/homepage.json';

const screen = screenDataJson as unknown as Screen;

const BlockRenderer = React.memo(function BlockRenderer({
  block,
}: {
  readonly block: Block;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (__DEV__) {
    console.log(`[render] ${block.type}:${block.id} #${renderCount.current}`);
  }

  const Component = resolveComponent(block.type);
  if (Component === null) return null;
  return <Component block={block} />;
});

function CampaignOverlay({
  backdropOpacity,
  content,
}: {
  readonly backdropOpacity: number;
  readonly content: OverlayContent;
}) {
  const backdropStyle = { backgroundColor: `rgba(0,0,0,${backdropOpacity})` } as const;

  if (content.kind === 'lottie') {
    return (
      <View style={[StyleSheet.absoluteFill, styles.overlay, backdropStyle]} pointerEvents="none">
        <LottieView
          source={{ uri: content.lottieUrl }}
          autoPlay={content.autoPlay}
          loop={content.loop}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay, backdropStyle]} pointerEvents="none">
      <Image
        source={{ uri: content.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
      />
    </View>
  );
}

function HomeScreenInner() {
  const { setTheme } = useTheme();
  const activeCampaign = useHomepageStore((s) => s.activeCampaign);
  const activateCampaign = useHomepageStore((s) => s.activateCampaign);
  const dismissCampaign = useHomepageStore((s) => s.dismissCampaign);

  useEffect(() => {
    const campaign = screen.campaigns.find((c) => c.triggerOnLoad);
    if (campaign === undefined) return;
    if (new Date(campaign.expiresAt) > new Date()) {
      activateCampaign(campaign);
      setTheme(campaign.themeOverride);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeCampaign === null) return;
    const ms = activeCampaign.overlay.autoDismissMs;
    if (ms === null) return;
    const timer = setTimeout(() => {
      dismissCampaign();
      setTheme(screen.theme);
    }, ms);
    return () => clearTimeout(timer);
  }, [activeCampaign, dismissCampaign, setTheme]);

  const keyExtractor = useCallback((block: Block) => block.id, []);
  const getItemType = useCallback((block: Block) => block.type, []);
  const renderItem = useCallback(
    ({ item }: { item: Block }) => <BlockRenderer block={item} />,
    [],
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={screen.blocks as Block[]}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        renderItem={renderItem}
      />
      <View style={styles.cartBadgeAnchor} pointerEvents="box-none">
        <CartBadge />
      </View>
      {activeCampaign !== null && (
        <CampaignOverlay
          backdropOpacity={activeCampaign.overlay.backdropOpacity}
          content={activeCampaign.overlay.content}
        />
      )}
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ThemeProvider initialTheme={screen.theme}>
      <HomeScreenInner />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { zIndex: 999 },
  cartBadgeAnchor: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 100,
  },
});
