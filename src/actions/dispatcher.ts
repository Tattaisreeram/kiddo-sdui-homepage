import { Alert } from 'react-native';
import type { Action } from '../types/sdui';
import { useHomepageStore } from '../store/homepageStore';

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
      Alert.alert(
        'Mystery Gift Unlocked!',
        `Coupon ${couponCode} applied (campaign ${campaignId}).`,
        [{ text: 'Yay!', style: 'default' }],
      );
      break;
    }
    default:
      assertNever(action);
  }
}
