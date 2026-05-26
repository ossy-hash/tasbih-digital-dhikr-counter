import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import type { Theme } from '../constants/themes';

const STANDARD_TARGETS = [33, 99, 100, 500, 1000];

interface Props {
  target: number;
  theme: Theme;
  onSelect: (target: number) => void;
}

export default function TargetSelector({ target, theme, onSelect }: Props) {
  const [customInput, setCustomInput] = useState('');

  const handleCustomSubmit = () => {
    const val = parseInt(customInput);
    if (!isNaN(val) && val > 0) {
      onSelect(val);
      setCustomInput('');
    }
  };

  return (
    <View
      className="rounded-[20px] p-3"
      style={{
        backgroundColor: theme.surfaceBg,
        borderColor: theme.surfaceBorder,
        borderWidth: 1,
      }}
    >
      <Text className="text-base font-black tracking-[2px] uppercase mb-2 pb-2" style={{ color: theme.textPrimary, borderBottomWidth: 1, borderBottomColor: theme.surfaceBorder }}>
        Target Goal
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {STANDARD_TARGETS.map(val => {
          const selected = target === val;
          return (
            <Pressable
              key={val}
              onPress={() => onSelect(val)}
              className="py-2.5 px-4 rounded-[12px] items-center active:scale-90"
              style={{
                backgroundColor: selected ? theme.buttonBg : theme.itemBg,
                borderColor: selected ? 'rgba(255,255,255,0.15)' : theme.surfaceBorder,
                borderWidth: 1,
                minWidth: 64,
              }}
            >
              <Text
                className="text-base font-black"
                style={{ color: selected ? theme.buttonText : theme.textMuted }}
              >
                {val}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-3 pt-3 flex-row items-center gap-2" style={{ borderTopWidth: 1, borderTopColor: theme.surfaceBorder }}>
        <TextInput
          className="flex-1 rounded-[12px] px-3.5 py-2.5 text-sm font-mono"
          placeholder="Custom target"
          placeholderTextColor={theme.textMuted}
          value={customInput}
          onChangeText={setCustomInput}
          onSubmitEditing={handleCustomSubmit}
          keyboardType="number-pad"
          style={{ backgroundColor: theme.itemBg, borderColor: theme.surfaceBorder, borderWidth: 1, color: theme.textPrimary }}
        />
        <Pressable
          onPress={handleCustomSubmit}
          className="px-5 py-2.5 rounded-[12px] items-center active:opacity-80"
          style={{ backgroundColor: theme.buttonBg }}
        >
          <Text className="font-black text-sm tracking-wide" style={{ color: theme.buttonText }}>
            Apply
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
