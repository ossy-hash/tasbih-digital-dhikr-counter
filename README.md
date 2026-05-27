# Tasbih Digital Dhikr Counter

A React Native mobile app for digital tasbih (dhikr) counting, built with Expo SDK 52.

## Features

- 5 built-in dhikr presets (Subhanallah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Astaghfirullah)
- Custom phrase creation with target goals
- Tap-to-count counter with circular SVG progress ring
- Per-phrase and total-cycle tracking
- History log with timestamps
- Undo / reset per session
- 7 themes (Emerald, Obsidian, Sapphire, Amethyst Night, Desert Ember, Arctic Frost, Pearl Light)
- Completion celebration banner

## Tech Stack

- **Expo SDK 52** (managed workflow)
- **React Native 0.76.9**
- **NativeWind v4** (Tailwind CSS for RN)
- **TypeScript**
- **expo-router** (file-based navigation)
- **react-native-svg** (circular progress)
- **@react-native-async-storage/async-storage** (persistence)

## Getting Started

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your Android/iOS device.

## Build APK

```bash
cd mobile
eas build -p android --profile preview
```

## Project Structure

```
mobile/
├── app/              # Expo Router screens
│   ├── _layout.tsx   # Root layout (fonts, providers)
│   └── index.tsx     # Main counter screen
├── components/       # Reusable UI components
│   ├── CounterDial.tsx
│   ├── PhraseList.tsx
│   ├── TargetSelector.tsx
│   ├── HistoryLog.tsx
│   ├── AddPhraseModal.tsx
│   └── CompletionBanner.tsx
├── constants/        # Presets and theme definitions
│   ├── presets.ts
│   └── themes.ts
├── utils/            # Storage hook
│   └── storage.ts
├── assets/           # App icon
├── scripts/          # Icon generation
└── app.json          # Expo config
```
