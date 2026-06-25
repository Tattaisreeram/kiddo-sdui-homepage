import { Alert } from 'react-native';
import type { Action, Screen } from '../types/sdui';
import { useHomepageStore } from '../store/homepageStore';
import screenDataJson from '../data/homepage.json';

const screen = screenDataJson as unknown as Screen;

function assertNever(x: never): never {
  throw new Error(`[dispatcher] unhandled action: ${JSON.stringify(x)}`);
}

export function handleAction(action: Action): void {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId, qty, variantId } = action.payload;
      useHomepageStore.getState().addToCart(productId, qty, variantId);
      break;
    }
    case 'DEEP_LINK': {
      const { url, presentationStyle = 'push' } = action.payload;
      // TODO: replace with expo-router navigate
      console.log(`[DEEP_LINK] ${presentationStyle} -> ${url}`);
      break;
    }
    case 'APPLY_MYSTERY_GIFT_COUPON': {
      const { couponCode, campaignId } = action.payload;
      const campaign = screen.campaigns.find((c) => c.id === campaignId);
      if (campaign !== undefined && new Date(campaign.expiresAt) > new Date()) {
        useHomepageStore.getState().activateCampaign(campaign);
      }
      Alert.alert(
        'Mystery Gift Unlocked!',
        `Coupon ${couponCode} applied!`,
        [{ text: 'Yay!', style: 'default' }],
      );
      break;
    }
    default:
      assertNever(action);
  }
}
