import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import type { FullScreenOverlay } from '../types/sdui';

/**
 * Switch backends here.
 * true  → lottie-react-native for Lottie JSON (full animation support)
 * false → expo-image for everything (handles animated WebP; renders Lottie as static)
 */
const USE_LOTTIE_BACKEND = true;

interface Props {
  readonly overlay: FullScreenOverlay;
}

export function CampaignOverlay({ overlay }: Props) {
  const backdropStyle = {
    backgroundColor: `rgba(0,0,0,${overlay.backdropOpacity})`,
  } as const;

  const content =
    overlay.type === 'lottie' && USE_LOTTIE_BACKEND ? (
      <LottieView
        source={{ uri: overlay.animation_url }}
        autoPlay={overlay.autoPlay}
        loop={overlay.loop}
        style={StyleSheet.absoluteFill}
      />
    ) : (
      <Image
        source={{ uri: overlay.animation_url }}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    );

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.overlay, backdropStyle]}
      pointerEvents="none"
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { zIndex: 999 },
});
