# Manki Expo Reference

Fresh Expo SDK 56 reference app for iOS and Android development builds.

## Commands

```sh
mise install
bun install
bun run start
bun run ios
bun run android
bun run prebuild:clean
bun run lint
bun run format
bun run check
bun run typecheck
```

`bun run start` starts Metro for a development build, not Expo Go.

`bun run ios` and `bun run android` build and launch the native development app from the generated `ios/` and `android/` projects.

Run `bun run prebuild:clean` after changing native app config or installing native modules so the generated projects stay in sync.

This app intentionally uses `tsgo` from `@typescript/native-preview` instead of depending on the JavaScript TypeScript compiler package.
