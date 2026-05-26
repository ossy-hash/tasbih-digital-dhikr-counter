import { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sparkles, Sun, Gem, Flame, Snowflake, SunSnow, Award } from 'lucide-react-native';
import { useStorage } from '../utils/storage';
import { DEFAULT_PRESETS } from '../constants/presets';
import { THEMES, THEME_IDS } from '../constants/themes';
import type { Dhikr } from '../constants/presets';
import type { Theme } from '../constants/themes';
import CounterDial from '../components/CounterDial';
import PhraseList from '../components/PhraseList';
import TargetSelector from '../components/TargetSelector';
import HistoryLog from '../components/HistoryLog';
import AddPhraseModal from '../components/AddPhraseModal';
import CompletionBanner from '../components/CompletionBanner';

interface HistoryItem {
  id: string;
  phrase: string;
  count: number;
  timestamp: string;
}

export default function Home() {
  const [presets, setPresets] = useStorage<Dhikr[]>('tasbih_presets_v2', DEFAULT_PRESETS);
  const [counts, setCounts] = useStorage<Record<string, number>>('tasbih_counts_v2', {});
  const [currentIndex, setCurrentIndex] = useStorage<number>('tasbih_active_idx_v2', 0);
  const [activeTarget, setActiveTarget] = useStorage<number>('tasbih_target_v2', 33);
  const [history, setHistory] = useStorage<HistoryItem[]>('tasbih_history_v2', []);
  const [totalCycles, setTotalCycles] = useStorage<number>('tasbih_cycles_v2', 0);
  const [themeId, setThemeId] = useStorage<string>('tasbih_theme_id_v2', 'emerald');

  const [showAddModal, setShowAddModal] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedThemeId = themeId === 'velvet' ? 'sapphire' : themeId;
  const theme: Theme = THEMES[normalizedThemeId] || THEMES.emerald;
  const activeDhikr = presets[currentIndex] || DEFAULT_PRESETS[0];
  const currentCount = counts[activeDhikr.english] || 0;
  const progress = Math.min(currentCount / activeTarget, 1);

  const cycleTheme = useCallback(() => {
    const idx = THEME_IDS.indexOf(normalizedThemeId as typeof THEME_IDS[number]);
    setThemeId(THEME_IDS[(idx + 1) % THEME_IDS.length]);
  }, [normalizedThemeId, setThemeId]);

  const handleIncrement = useCallback(() => {
    const nextCount = currentCount >= activeTarget ? 1 : currentCount + 1;
    setCounts(prev => ({ ...prev, [activeDhikr.english]: nextCount }));

    if (nextCount === activeTarget) {
      setCelebration(true);
      setTotalCycles(prev => prev + 1);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString([], { day: 'numeric', month: 'short' });
      const log: HistoryItem = {
        id: Math.random().toString(36).substring(2),
        phrase: activeDhikr.english,
        count: activeTarget,
        timestamp: `${dateStr} • ${timeStr}`,
      };
      setHistory(prev => [log, ...prev].slice(0, 15));

      setBanner(`Masha'Allah! Target of ${activeTarget} reached for ${activeDhikr.english}`);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
      bannerTimer.current = setTimeout(() => setBanner(null), 5000);
    } else {
      setCelebration(false);
    }
  }, [currentCount, activeTarget, activeDhikr.english, setCounts, setTotalCycles, setHistory]);

  const handleDecrement = useCallback(() => {
    if (currentCount > 0) {
      setCounts(prev => ({ ...prev, [activeDhikr.english]: currentCount - 1 }));
    }
  }, [currentCount, activeDhikr.english, setCounts]);

  const handleReset = useCallback(() => {
    if (currentCount > 0) {
      Alert.alert(
        'Reset Counter?',
        `Reset the count for ${activeDhikr.english} back to zero?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm Reset',
            style: 'destructive',
            onPress: () => {
              setCounts(prev => ({ ...prev, [activeDhikr.english]: 0 }));
              setCelebration(false);
            },
          },
        ],
      );
    }
  }, [currentCount, activeDhikr.english, setCounts]);

  const handleAddPreset = useCallback((english: string, arabic: string, meaning: string): boolean => {
    if (!english.trim() || !arabic.trim()) return false;

    const exists = presets.some(p => p.english.toLowerCase() === english.trim().toLowerCase());
    if (exists) {
      Alert.alert('Duplicate', 'This phrase already exists.');
      return false;
    }

    const newItem: Dhikr = {
      english: english.trim(),
      arabic: arabic.trim(),
      meaning: meaning.trim() || 'Custom Dhikr Phrase',
      isCustom: true,
    };

    setPresets(prev => [...prev, newItem]);
    setCounts(prev => ({ ...prev, [english.trim()]: 0 }));
    setCurrentIndex(presets.length);
    setShowAddModal(false);
    return true;
  }, [presets, setPresets, setCounts, setCurrentIndex]);

  const handleDeletePreset = useCallback((index: number) => {
    const item = presets[index];
    if (!item?.isCustom) return;

    Alert.alert('Remove Phrase', `Remove custom phrase "${item.english}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updated = presets.filter((_, i) => i !== index);
          setPresets(updated);
          setCounts(prev => {
            const next = { ...prev };
            delete next[item.english];
            return next;
          });
          if (currentIndex >= updated.length) {
            setCurrentIndex(Math.max(0, updated.length - 1));
          }
        },
      },
    ]);
  }, [presets, currentIndex, setPresets, setCounts, setCurrentIndex]);

  const handleSelectPreset = useCallback((index: number) => {
    setCurrentIndex(index);
    setCelebration(false);
  }, [setCurrentIndex]);

  const handleSelectTarget = useCallback((target: number) => {
    setActiveTarget(target);
    setCelebration(false);
  }, [setActiveTarget]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, [setHistory]);

  useEffect(() => {
    return () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const themeIconMap: Record<string, typeof Moon> = {
    emerald: Moon,
    obsidian: Sparkles,
    sapphire: Sun,
    amethyst: Gem,
    ember: Flame,
    frost: Snowflake,
    pearl: SunSnow,
  };
  const ThemeIcon = themeIconMap[normalizedThemeId] || Moon;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.bg }}>
      <CompletionBanner message={banner} theme={theme} onDismiss={() => setBanner(null)} />

      <View
        className="flex-row items-center justify-between px-4 py-2.5 border-b"
        style={{ backgroundColor: theme.headerBg, borderColor: theme.surfaceBorder }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={cycleTheme}
            className="p-2 rounded-xl active:scale-90"
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.surfaceBorder,
              borderWidth: 1,
            }}
          >
            <ThemeIcon size={20} color={theme.accent} />
          </Pressable>
          <View>
            <Text className="text-xs tracking-[3px] font-black uppercase" style={{ color: theme.accent }}>
              Tasbih Suite
            </Text>
            <Text className="text-xl font-black tracking-tight mt-0.5" style={{ color: theme.textPrimary }}>
              Digital Dhikr
            </Text>
          </View>
        </View>

        <View
          className="px-3 py-1.5 rounded-xl flex-row items-center gap-2"
          style={{ backgroundColor: theme.itemBg, borderColor: theme.surfaceBorder, borderWidth: 1 }}
        >
          <Award size={14} color={theme.accent} />
          <View>
            <Text className="text-[10px] font-black uppercase tracking-[2px]" style={{ color: theme.textMuted }}>
              Cycles
            </Text>
            <Text className="font-mono text-sm font-bold" style={{ color: theme.textPrimary }}>
              {totalCycles}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-3 pt-3" contentContainerStyle={{ gap: 10, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <PhraseList
          presets={presets}
          currentIndex={currentIndex}
          counts={counts}
          target={activeTarget}
          theme={theme}
          onSelect={handleSelectPreset}
          onDelete={handleDeletePreset}
          onAddPress={() => setShowAddModal(true)}
        />

        <CounterDial
          dhikr={activeDhikr}
          count={currentCount}
          target={activeTarget}
          progress={progress}
          celebration={celebration}
          theme={theme}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onReset={handleReset}
        />

        <TargetSelector
          target={activeTarget}
          theme={theme}
          onSelect={handleSelectTarget}
        />

        <HistoryLog
          history={history}
          theme={theme}
          onClear={clearHistory}
          onDelete={deleteHistoryItem}
        />

        <View className="py-3 items-center">
          <Text className="text-xs font-mono tracking-wider" style={{ color: theme.textMuted }}>
            Tasbih Suite &bull; 2026
          </Text>
        </View>
      </ScrollView>

      <AddPhraseModal
        visible={showAddModal}
        theme={theme}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPreset}
      />
    </SafeAreaView>
  );
}
