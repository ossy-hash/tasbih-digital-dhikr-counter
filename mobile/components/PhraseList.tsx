import { View, Text, Pressable, ScrollView } from 'react-native';
import { BookOpen, Plus, Trash2 } from 'lucide-react-native';
import type { Dhikr } from '../constants/presets';
import type { Theme } from '../constants/themes';

interface Props {
  presets: Dhikr[];
  currentIndex: number;
  counts: Record<string, number>;
  target: number;
  theme: Theme;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onAddPress: () => void;
}

export default function PhraseList({
  presets, currentIndex, counts, target, theme,
  onSelect, onDelete, onAddPress,
}: Props) {
  return (
    <View
      className="rounded-[20px] p-3"
      style={{
        backgroundColor: theme.surfaceBg,
        borderColor: theme.surfaceBorder,
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center justify-between mb-2 pb-2" style={{ borderBottomWidth: 1, borderBottomColor: theme.surfaceBorder }}>
        <View className="flex-row items-center gap-2">
          <BookOpen size={16} color={theme.accent} />
          <Text className="text-base font-black tracking-[2px] uppercase" style={{ color: theme.textPrimary }}>
            Dhikr Phrases
          </Text>
        </View>

        <Pressable
          onPress={onAddPress}
          className="px-3 py-1.5 rounded-lg flex-row items-center gap-1.5 active:opacity-70"
          style={{ backgroundColor: theme.accentDim, borderColor: theme.borderAccent, borderWidth: 1 }}
        >
          <Plus size={14} color={theme.accent} />
          <Text className="text-sm font-extrabold tracking-wide" style={{ color: theme.accent }}>
            Add
          </Text>
        </Pressable>
      </View>

      <ScrollView className="max-h-[200px]" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {presets.map((item, idx) => {
          const selected = idx === currentIndex;
          const progVal = counts[item.english] || 0;
          const progPct = Math.min((progVal / target) * 100, 100);

          return (
            <Pressable
              key={item.english}
              onPress={() => onSelect(idx)}
              className="p-3 rounded-[12px] relative overflow-hidden"
              style={{
                backgroundColor: selected ? theme.activeCardBg : theme.itemBg,
                borderColor: selected ? theme.accent : theme.surfaceBorder,
                borderWidth: 1,
              }}
            >
              {progPct > 0 && (
                <View
                  className="absolute left-0 top-0 bottom-0 rounded-l-[11px]"
                  style={{ width: `${Math.max(progPct, 2)}%` as any, backgroundColor: theme.accentDim }}
                />
              )}

              {selected && (
                <View
                  className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              )}

              <View className="flex-row justify-between items-start gap-2 relative z-10">
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-sm font-bold tracking-wide"
                      style={{ color: selected ? theme.textPrimary : theme.textSecondary }}
                      numberOfLines={1}
                    >
                      {item.english}
                    </Text>
                    {item.isCustom && (
                      <View className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.accentDim }}>
                        <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.accent }}>
                          Custom
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs mt-0.5" style={{ color: theme.textMuted }} numberOfLines={1}>
                    {item.meaning}
                  </Text>
                </View>

                <View className="items-end shrink-0">
                  <Text className="text-lg font-black tracking-wide" style={{ color: theme.accent }}>
                    {item.arabic}
                  </Text>
                  <View className="flex-row items-center gap-1.5 mt-0.5">
                    <Text className="text-xs font-bold font-mono" style={{ color: selected ? theme.accent : theme.textMuted }}>
                      {progVal}/{target}
                    </Text>
                    {item.isCustom && (
                      <Pressable
                        onPress={() => onDelete(idx)}
                        className="p-1 active:opacity-60"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={13} color={theme.textMuted} />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
