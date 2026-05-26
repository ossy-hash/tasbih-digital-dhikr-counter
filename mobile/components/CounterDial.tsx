import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Undo2, RotateCcw } from 'lucide-react-native';
import type { Dhikr } from '../constants/presets';
import type { Theme } from '../constants/themes';

interface Props {
  dhikr: Dhikr;
  count: number;
  target: number;
  progress: number;
  celebration: boolean;
  theme: Theme;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export default function CounterDial({
  dhikr, count, target, progress, celebration, theme,
  onIncrement, onDecrement, onReset,
}: Props) {
  const countScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    countScale.setValue(0.82);
    Animated.spring(countScale, {
      toValue: 1,
      friction: 3,
      tension: 130,
      useNativeDriver: true,
    }).start();
  }, [count, countScale]);

  useEffect(() => {
    ringScale.setValue(0.92);
    Animated.spring(ringScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [progress, ringScale]);

  useEffect(() => {
    if (celebration) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.15, duration: 700, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      glowOpacity.setValue(0);
    }
  }, [celebration, glowOpacity]);

  const size = 270;
  const cx = size / 2;
  const cy = size / 2;
  const r = 115;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);
  const isNear = progress >= 0.8 && !celebration;

  return (
    <View
      className="w-full rounded-[32px] p-4 items-center relative overflow-hidden"
      style={{
        backgroundColor: theme.counterBg,
        borderColor: theme.surfaceBorder,
        borderWidth: 1,
      }}
    >
      <View
        className="absolute top-0 left-0 w-32 h-32 rounded-br-[48px]"
        style={{ backgroundColor: theme.accentDim }}
      />
      <View
        className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-[40px]"
        style={{ backgroundColor: theme.accentDim }}
      />

      <View className="w-full flex-row justify-between pb-2 border-b z-10" style={{ borderColor: theme.surfaceBorder }}>
        <Text className="text-xs tracking-[3px] font-black" style={{ color: theme.labelDim }}>
          ACTIVE SESSION
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
          <Text className="text-xs font-black tracking-[2px]" style={{ color: theme.accent }}>
            COUNTING
          </Text>
        </View>
      </View>

      <View key={dhikr.english} className="w-full pt-3 pb-2 border-b items-center" style={{ borderColor: theme.surfaceBorder }}>
        <View className="items-center gap-1">
          <Text
            className="text-3xl font-black tracking-wide text-center leading-tight"
            style={{ color: theme.textPrimary, fontFamily: 'NotoNaskhArabic_400Regular' }}
          >
            {dhikr.arabic}
          </Text>
          <Text className="text-base font-black tracking-[3px] uppercase" style={{ color: theme.accent }}>
            {dhikr.english}
          </Text>
          <View className="px-4 py-1.5 rounded-full" style={{ backgroundColor: theme.badgeBg }}>
            <Text className="text-sm font-medium" style={{ color: theme.textSecondary }} numberOfLines={1}>
              {dhikr.meaning}
            </Text>
          </View>
        </View>
      </View>

      <Pressable onPress={onIncrement} className="my-5 items-center justify-center active:scale-95">
        {celebration && (
          <Animated.View
            className="absolute w-[280px] h-[280px] rounded-full"
            style={{ backgroundColor: theme.accent, opacity: glowOpacity }}
          />
        )}

        {isNear && (
          <View
            className="absolute w-[250px] h-[250px] rounded-full"
            style={{ backgroundColor: theme.accent, opacity: 0.06 }}
          />
        )}

        <Animated.View style={{ transform: [{ scale: ringScale }] }}>
          <Svg width={size - 16} height={size - 16} viewBox={`0 0 ${size} ${size}`}>
            <Circle
              cx={cx} cy={cy} r={r + 8}
              stroke={celebration ? '#fbbf24' : theme.accent}
              strokeWidth="3"
              fill="transparent"
              opacity={0.1}
              strokeLinecap="round"
            />
            <Circle
              cx={cx} cy={cy} r={r}
              stroke={theme.accent}
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              strokeLinecap="round"
              opacity={0.06}
            />
            <Circle
              cx={cx} cy={cy} r={r}
              stroke={celebration ? '#fbbf24' : theme.accent}
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        <View
          className="absolute w-[195px] h-[195px] rounded-full items-center justify-center gap-1.5"
          style={{
            backgroundColor: theme.innerPlateVia,
            borderColor: theme.surfaceBorder,
            borderWidth: 1,
            shadowColor: celebration ? theme.accent : '#000',
            shadowOffset: { width: 0, height: celebration ? 0 : 4 },
            shadowOpacity: celebration ? 0.6 : 0.15,
            shadowRadius: celebration ? 32 : 12,
            elevation: 8,
          }}
        >
          <Animated.Text
            className="text-6xl font-black font-mono tracking-tight"
            style={{
              color: celebration ? '#fbbf24' : theme.textPrimary,
              transform: [{ scale: countScale }],
              textShadowColor: celebration ? theme.accentGlow : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: celebration ? 24 : 0,
            }}
          >
            {count}
          </Animated.Text>

          <View
            className="px-3.5 py-1 rounded-full flex-row items-center gap-1.5"
            style={{ backgroundColor: theme.badgeBg, borderColor: theme.surfaceBorder, borderWidth: 1 }}
          >
            <View
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: celebration ? '#fbbf24' : theme.accent }}
            />
            <Text className="text-xs uppercase font-black tracking-[2px]" style={{ color: celebration ? '#fbbf24' : theme.textMuted }}>
              Target: {target}
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="w-full flex-row items-center justify-between gap-3 z-10">
        <Pressable
          onPress={onDecrement}
          disabled={count === 0}
          className="flex-1 py-3.5 px-3 rounded-2xl flex-row items-center justify-center gap-2 border active:scale-95"
          style={{
            backgroundColor: count > 0 ? theme.undoBg : theme.itemBg,
            borderColor: count > 0 ? theme.undoBorder : theme.surfaceBorder,
            opacity: count > 0 ? 1 : 0.4,
          }}
        >
          <Undo2 size={16} color={count > 0 ? theme.accent : theme.textMuted} />
          <Text className="text-sm font-bold uppercase tracking-[1.5px]" style={{ color: count > 0 ? theme.accent : theme.textMuted }}>
            Undo
          </Text>
        </Pressable>

        <Pressable
          onPress={onReset}
          disabled={count === 0}
          className="flex-1 py-3.5 px-3 rounded-2xl flex-row items-center justify-center gap-2 border active:scale-95"
          style={{
            backgroundColor: count > 0 ? theme.resetBg : theme.itemBg,
            borderColor: count > 0 ? theme.resetBorder : theme.surfaceBorder,
            opacity: count > 0 ? 1 : 0.4,
          }}
        >
          <RotateCcw size={16} color={count > 0 ? theme.resetText : theme.textMuted} />
          <Text className="text-sm font-bold uppercase tracking-[1.5px]" style={{ color: count > 0 ? theme.resetText : theme.textMuted }}>
            Reset
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
