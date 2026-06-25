# Kiddo SDUI Homepage

A **Server-Driven UI** (SDUI) homepage renderer for the Kiddo baby-products app. The server owns the layout: it sends a typed `Block[]` array and the client renders it without a code push.

---

## What is SDUI?

In a traditional app, layout decisions live in the client binary. Changing which sections appear, their order, or their content requires a release cycle. SDUI inverts this: the server sends a structured payload describing *what* to render (a "block" array), and the client is a pure rendering engine. The product team can reorder, add, or remove homepage sections by changing the server response — no app update needed.

---

## Architecture

```
Server JSON
    │
    ▼
fetchBlocks()          ← src/api/fetchBlocks.ts  (HTTP → Block[])
    │
    ▼
homepageStore          ← src/store/homepageStore.ts  (zustand)
    │  blocks[], activeCampaign
    ▼
HomeScreen             ← src/screens/HomeScreen.tsx
    │
    ├─ ThemeProvider   ← src/theme/ThemeContext.tsx
    │       │  theme tokens (colors, spacing, typography, radii)
    │       └─ setTheme()  ← called by campaign engine on activation
    │
    ├─ FlashList (single vertical scroll — no nested ScrollViews)
    │       │
    │       └─ BlockErrorBoundary  ← src/components/BlockErrorBoundary.tsx
    │               │  catches render errors, logs & skips corrupt blocks
    │               └─ ComponentRegistry.resolveComponent(block.type)
    │                       │  hash-map lookup → null for unknown types
    │                       ├─ BannerHero
    │                       ├─ ProductGrid2x2
    │                       └─ DynamicCollection
    │
    ├─ CartBadge       ← floats top-right, reads cartStore.totalCount
    │
    ├─ CampaignOverlay ← src/campaign/CampaignOverlay.tsx
    │       pointerEvents="none" — never blocks list interaction
    │
    └─ DevCampaignPanel  (DEV builds only — 3 buttons to switch campaigns)
```

---

## Component Registry (factory hash-map)

```
type BlockFactory = React.ComponentType<{ block: Block }>;

const registry: Record<KnownBlockType, BlockFactory> = {
  BANNER_HERO:         BannerHero,
  PRODUCT_GRID_2X2:   ProductGrid2x2,
  DYNAMIC_COLLECTION: DynamicCollection,
};

resolveComponent(type: string): BlockFactory | null
  → registry[type] if known, null otherwise
```

Rules:
- Always a `Record<string, BlockFactory>` hash-map — never a `switch`.
- Unknown block types return `null`; the `FlashList` item renders nothing.
- Adding a new block type = create the component + add one line to `registry`.

---

## Action Dispatcher

Every interactive element in every block calls one central function:

```
handleAction(action: Action): void
```

`Action` is a discriminated union:

```ts
type Action =
  | { type: 'ADD_TO_CART';              payload: { productId; qty; variantId? } }
  | { type: 'DEEP_LINK';                payload: { url; presentationStyle? } }
  | { type: 'APPLY_MYSTERY_GIFT_COUPON'; payload: { couponCode; campaignId; expiresAt } }
```

Blocks import `handleAction` from `src/actions/dispatcher.ts`. They never touch the store directly. This keeps blocks pure and the dispatch path testable in isolation.

When `APPLY_MYSTERY_GIFT_COUPON` fires, the dispatcher looks up the campaign by id in the screen payload, calls `homepageStore.activateCampaign(campaign)`, and the reactive `useEffect` in `HomeScreen` swaps the theme and mounts the overlay automatically.

---

## FlashList v2 Performance Strategy

| Technique | Location | Purpose |
|---|---|---|
| `getItemType` | `HomeScreen` | Tells FlashList to maintain separate recycle pools per block type, avoiding cross-type view reuse |
| `React.memo` | Every block component | Prevents re-render when sibling blocks change (e.g. cart update) |
| `useRecyclingState` | `ProductCard` | Resets local stepper qty synchronously when FlashList recycles the cell — no stale count flash |
| Selector per product | `ProductCard` | `useCartStore(s => s.items[id])` — re-renders only the card whose product qty changed |
| Horizontal `FlashList` | `DynamicCollection` | Nested horizontal scrollable inside the vertical list; uses its own recycle pool; `scrollEnabled` only on the inner list |
| No `estimatedItemSize` | All lists | Flash-list v2 on New Architecture measures sizes automatically |
| No nested `ScrollView` | All blocks | Carousels use horizontal `FlashList`, never a nested `ScrollView` |

---

## Campaign & Theme Engine

### How it works

1. A campaign carries a `themeOverride: Theme` and a `FullScreenOverlay { type, animation_url }`.
2. Activation (from load trigger or user tap) calls `homepageStore.activateCampaign(campaign)`.
3. A `useEffect` in `HomeScreen` watches `activeCampaign` and calls `ThemeContext.setTheme(campaign.themeOverride)` — every block re-reads tokens from context, swapping colors/spacing instantly without unmounting anything.
4. `CampaignOverlay` mounts over the entire screen with `pointerEvents="none"`, so the user can still interact with the list underneath.
5. `autoDismissMs` triggers a `setTimeout` that calls `dismissCampaign()`, resetting the theme to the screen's base theme.

### Overlay rendering backend

`CampaignOverlay.tsx` exposes a compile-time flag:

```ts
const USE_LOTTIE_BACKEND = true;
```

| Flag | Lottie content | Image content |
|---|---|---|
| `true` | `lottie-react-native` (full animation) | `expo-image` |
| `false` | `expo-image` (static first frame) | `expo-image` |

Flip the flag to switch backends for the entire app without touching any other file.

### Code-defined campaigns (`src/campaigns/campaignData.ts`)

| Campaign | Primary | Secondary | Overlay |
|---|---|---|---|
| Back to School | Deep Blue `#1565C0` | Golden Yellow `#F9A825` | Animated WebP burst |
| Summer Playhouse | Ocean Teal `#006064` | Coral `#FF7043` | Animated WebP splash |
| Mystery Gift Carnival | Carnival Red `#C62828` | Gold `#FFD600` | Lottie confetti |

---

## Error Resilience

- **Unknown block type** (`NEW_COMPONENT_V2`): `resolveComponent` returns `null`; `BlockRenderer` renders nothing. The rest of the feed is unaffected.
- **Corrupt block** (crashes during render): `BlockErrorBoundary` (class component) catches the error, logs it in dev, and renders `null` for that slot. The list continues normally.
- **Missing product fields** (`name`, `inStock` omitted): `ProductCard` guards with runtime checks (`typeof product.name === 'string'`) and falls back to safe defaults.

---

## How to Run

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo`
- For device testing: [Expo Go](https://expo.dev/go) app on iOS or Android

### Start

```bash
npm install
npm start          # opens Expo dev server + QR code
```

Scan the QR code with **Expo Go** on your phone to see the app immediately.

### Emulators

```bash
npm run android    # requires Android Studio + emulator
npm run ios        # requires Xcode + simulator (macOS only)
```

### Dev campaign switcher

In development builds, a floating row of buttons appears at the bottom of the screen. Tap any campaign name to activate it instantly — the theme swaps and the overlay mounts. Tap **Reset** to return to the base theme.
