export interface Dhikr {
  english: string;
  arabic: string;
  meaning: string;
  isCustom?: boolean;
}

export const DEFAULT_PRESETS: Dhikr[] = [
  { english: "Subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ", meaning: "Glory be to Allah" },
  { english: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", meaning: "Praise be to Allah" },
  { english: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ", meaning: "Allah is the Greatest" },
  { english: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", meaning: "There is no god but Allah" },
  { english: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", meaning: "I seek forgiveness from Allah" },
];

export const STANDARD_TARGETS = [33, 99, 100, 500, 1000];
