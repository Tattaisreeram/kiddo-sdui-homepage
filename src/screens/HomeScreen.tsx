import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { Block, Screen } from '../types/sdui';
import { resolveComponent } from '../registry/componentRegistry';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { useHomepageStore } from '../store/homepageStore';
import { CartBadge } from '../components/CartBadge';
import { BlockErrorBoundary } from '../components/BlockErrorBoundary';
import { CampaignOverlay } from '../campaign/CampaignOverlay';
import { CAMPAIGNS } from '../campaigns/campaignData';
import screenDataJson from '../data/homepage.json';

const screen = screenDataJson as unknown as Screen;

const BlockRenderer = React.memo(function BlockRenderer({
  block,
}: {
  readonly block: Block;
}) {
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  if (__DEV__) {
    console.log(`[render] ${block.type}:${block.id} #${renderCount.current}`);
  }

  const Component = resolveComponent(block.type);
  if (Component === null) return null;
  // BlockErrorBoundary catches render crashes so one corrupt block cannot
  // unmount the entire feed.
  return (
    <BlockErrorBoundary block={block}>
      <Component block={block} />
    </BlockErrorBoundary>
  );
});

// Visible only in development builds; zero production bundle impact.
function DevCampaignPanel() {
  const activateCampaign = useHomepageStore((s) => s.activateCampaign);
  const dismissCampaign = useHomepageStore((s) => s.dismissCampaign);

  return (
    // box-none so the list under the panel remains fully tappable
    <View style={devStyles.panel} pointerEvents="box-none">
      {CAMPAIGNS.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => activateCampaign(c)}
          style={[devStyles.btn, { backgroundColor: c.themeOverride.colors.primary }]}
          accessibilityRole="button"
          accessibilityLabel={`Activate ${c.name} campaign`}
        >
          <Text style={devStyles.btnText} numberOfLines={1}>
            {c.name}
          </Text>
        </Pressable>
      ))}
      <Pressable
        onPress={dismissCampaign}
        style={[devStyles.btn, devStyles.resetBtn]}
        accessibilityRole="button"
        accessibilityLabel="Reset campaign"
      >
        <Text style={devStyles.btnText}>Reset</Text>
      </Pressable>
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTheme(activeCampaign !== null ? activeCampaign.themeOverride : screen.theme);
  }, [activeCampaign, setTheme]);

  useEffect(() => {
    if (activeCampaign === null) return;
    const ms = activeCampaign.overlay.autoDismissMs;
    if (ms === null) return;
    const timer = setTimeout(() => dismissCampaign(), ms);
    return () => clearTimeout(timer);
  }, [activeCampaign, dismissCampaign]);

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
      <View style={styles.cartAnchor} pointerEvents="box-none">
        <CartBadge />
      </View>
      {activeCampaign !== null && (
        <CampaignOverlay overlay={activeCampaign.overlay} />
      )}
      {__DEV__ && <DevCampaignPanel />}
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
  cartAnchor: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 100,
  },
});

const devStyles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 24,
    left: 8,
    right: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    zIndex: 500,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    opacity: 0.92,
  },
  resetBtn: { backgroundColor: '#555' },
  btnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
});
