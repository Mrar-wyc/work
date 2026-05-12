# Mini Games (Expo)

A small collection of full-screen mini games with a shared lobby and Expo Router navigation. The shell UI (titles, lobby, not-found, game list sections) is in **Chinese**. Swipe-based titles use the shared `SwipeSurface` helper (`src/games/components/SwipeSurface.tsx`) so drag gestures map to up/down/left/right without extra on-screen pads.

## Run the app

```bash
npx expo start
```

Then open in Expo Go, an emulator, or the web target from the dev server UI.

## Android APK / AAB（EAS 与本机构建）

中文说明（登录、构建命令、产物目录、本机 Gradle 与签名注意）见 **[android-install/README.md](./android-install/README.md)**。

## How to add a new game

1. **Create a folder** under `src/games/your-game/` with a full-screen React component (for example `YourGameScreen.tsx`) that fills the area below the stack header. Optionally add helpers such as `logic.ts` next to it.
2. **Build the screen** so it uses `flex: 1` on the root view (or equivalent) and handles its own gameplay state. You do not need to add a back button; the stack header provides navigation back to the lobby.
3. **Register the game** in `src/games/registry.ts`: import your screen, append a `GameDefinition` to the `games` array with `id`, `title`, optional `description`, `icon` (an Ionicons glyph name), `component`, and optional **`category`**: `'puzzle' | 'arcade' | 'classic'`. The lobby groups games by category (益智 / 休闲 / 经典). If you omit `category`, the lobby treats the game as **休闲** (`arcade`). The lobby list and `/game/[gameId]` route will pick up the new entry automatically.

## i18n

Shared shell copy lives in `src/i18n/zh.ts`. Individual games can keep in-screen Chinese strings or grow their own locale files as needed.
