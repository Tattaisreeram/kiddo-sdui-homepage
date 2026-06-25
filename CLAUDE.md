@AGENTS.md

# SDUI Homepage — Architecture Reference

## Stack

| Package | Version | Notes |
|---|---|---|
| expo | ~56.0.12 | New Architecture enabled |
| @shopify/flash-list | ^2.3.2 | JS-only build; New Architecture; **no `estimatedItemSize`** |
| zustand | ^5.0.14 | Global state (blocks, campaign) |
| expo-image | ^56.0.11 | All image rendering |
| lottie-react-native | ^7.3.8 | Animation blocks |
| TypeScript | ~6.0.3 | `strict: true` — no exceptions |

---

## Core Rendering Model

A **single vertical FlashList** at the root renders a `Block[]` array fetched from the server. Each item in the array is a typed "block" object:

```
{ type: string; id: string; [key: string]: unknown }
```

The list is the only scroll container in the app. Blocks must never nest scroll views.

---

## ComponentRegistry (factory hash-map)

The registry is a plain `Record<string, BlockFactory>` — **not a switch statement**.

```
type BlockFactory = (block: Block, ctx: RenderContext) => React.ReactElement | null;

const ComponentRegistry: Record<string, BlockFactory> = {
  hero:      (b, ctx) => <HeroBlock      block={b} ctx={ctx} />,
  banner:    (b, ctx) => <BannerBlock    block={b} ctx={ctx} />,
  carousel:  (b, ctx) => <CarouselBlock  block={b} ctx={ctx} />,
  lottie:    (b, ctx) => <LottieBlock    block={b} ctx={ctx} />,
  text:      (b, ctx) => <TextBlock      block={b} ctx={ctx} />,
  spacer:    (b, ctx) => <SpacerBlock    block={b} ctx={ctx} />,
};
```

**Unknown type → `null`**: the render function looks up `ComponentRegistry[block.type]`. If the key is absent, it returns `null`. The FlashList item renders nothing and takes no space.

---

## Action System

Every tap anywhere in the app calls one central dispatcher:

```
handleAction(action: Action): void
```

`Action` is a discriminated union:

```
type Action =
  | { type: 'NAVIGATE';    payload: { screen: string; params?: Record<string, unknown> } }
  | { type: 'DEEP_LINK';   payload: { url: string } }
  | { type: 'ADD_TO_CART'; payload: { productId: string; qty: number } }
  | { type: 'CAMPAIGN';    payload: { campaignId: string } }
  | { type: 'DISMISS' };
```

Block components receive `onAction: (a: Action) => void` via `RenderContext` (or directly as a prop). They never import `handleAction` directly — the dispatcher is injected at the list root. This keeps blocks pure and testable.

---

## Theme System

Theme is provided via React Context (`ThemeContext`). All blocks read colors, spacing, and typography exclusively from `useTheme()` — no hardcoded values in block files.

```
interface Theme {
  colors: { background: string; surface: string; primary: string; text: string; /* … */ };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  typography: { headingSize: number; bodySize: number; fontFamily: string };
  radii: { card: number; button: number };
}
```

A `ThemeProvider` wraps the entire app. The campaign engine updates the active theme by calling a setter exposed by the provider — **not** by remounting the provider.

---

## Campaign Engine

The campaign engine activates via an `Action` of type `CAMPAIGN` reaching `handleAction`.

It does two things simultaneously:
1. **Theme swap** — calls `setTheme(campaignTheme)` on the `ThemeContext` provider, replacing tokens app-wide without a re-mount.
2. **Full-screen overlay** — renders a `<CampaignOverlay />` positioned absolutely over the entire screen with `pointerEvents="none"`. The overlay is decorative only (sparkles, confetti Lottie, tinted scrim). It never captures touches.

Campaign state (active campaign id, overlay visibility) lives in the **zustand store** so it survives navigation events and can be read by any component.

---

## Zustand Store Shape

```
interface HomepageStore {
  blocks: Block[];
  isLoading: boolean;
  activeCampaignId: string | null;
  overlayVisible: boolean;
  setBlocks: (blocks: Block[]) => void;
  activateCampaign: (id: string) => void;
  dismissCampaign: () => void;
}
```

Blocks are fetched once on mount and stored here. The FlashList reads `store.blocks` via a selector.

---

## Proposed `/src` Folder Structure

```
src/
│
├── types/
│   ├── Block.ts            # discriminated union for all server block shapes
│   ├── Action.ts           # Action discriminated union
│   └── Theme.ts            # Theme interface
│
├── registry/
│   └── ComponentRegistry.ts   # Record<string, BlockFactory>; imports all blocks
│
├── blocks/                    # one file per block type
│   ├── HeroBlock.tsx
│   ├── BannerBlock.tsx
│   ├── CarouselBlock.tsx
│   ├── LottieBlock.tsx
│   ├── TextBlock.tsx
│   └── SpacerBlock.tsx
│
├── actions/
│   └── handleAction.ts        # central dispatcher; reads zustand store
│
├── theme/
│   ├── ThemeContext.tsx        # createContext + ThemeProvider + useTheme hook
│   ├── defaultTheme.ts        # base token values
│   └── campaignThemes.ts      # keyed map of campaign-specific Theme overrides
│
├── campaign/
│   └── CampaignOverlay.tsx    # pointerEvents="none" absolute overlay; Lottie / scrim
│
├── store/
│   └── homepageStore.ts       # zustand store (blocks, campaign state)
│
├── components/
│   └── HomepageList.tsx       # FlashList root; wires registry + handleAction + overlay
│
└── api/
    └── fetchBlocks.ts         # HTTP fetch → Block[]; called once on mount
```

---

## Key Constraints (enforce in code review)

- **No `estimatedItemSize`** on FlashList — flash-list v2 New Architecture infers sizes automatically.
- **No nested scroll views** — carousels use horizontal FlatList with `scrollEnabled` or a custom pager; they do not nest a FlashList.
- **No `switch` in the registry** — always hash-map lookup.
- **No hardcoded colors/spacing in blocks** — always `useTheme()`.
- **No direct store imports in blocks** — blocks receive all data and callbacks as props.
- **`pointerEvents="none"` on overlay** — never block user interaction with the list.
- **TypeScript strict** — no `any`, no `!` non-null assertions without a comment explaining why.
