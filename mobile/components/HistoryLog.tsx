import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import type { Theme } from '../constants/themes';

interface HistoryItem {
  id: string;
  phrase: string;
  count: number;
  timestamp: string;
}

interface Props {
  history: HistoryItem[];
  theme: Theme;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export default function HistoryLog({ history, theme, onClear, onDelete }: Props) {
  const handleClear = () => {
    Alert.alert('Clear History', 'Are you sure you want to clear all history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: onClear },
    ]);
  };

  return (
    <View
      className="rounded-[20px] p-3 min-h-[240px]"
      style={{
        backgroundColor: theme.surfaceBg,
        borderColor: theme.surfaceBorder,
        borderWidth: 1,
      }}
    >
      <View className="flex-row justify-between items-center mb-2 pb-2" style={{ borderBottomWidth: 1, borderBottomColor: theme.surfaceBorder }}>
        <View className="flex-row items-center gap-2">
          <Clock size={16} color={theme.accent} />
          <Text className="text-base font-black tracking-[2px] uppercase" style={{ color: theme.textPrimary }}>
            History
          </Text>
        </View>
        {history.length > 0 && (
          <Pressable
            onPress={handleClear}
            className="px-3 py-1 rounded-lg active:opacity-70"
            style={{ backgroundColor: theme.errorBg, borderColor: theme.errorBorder, borderWidth: 1 }}
          >
            <Text className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.resetText }}>
              Clear All
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1 max-h-[240px]" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {history.length === 0 ? (
          <View className="py-12 items-center justify-center">
            <Clock size={28} color={theme.accent} style={{ opacity: 0.15 }} />
            <Text className="text-base font-black uppercase tracking-[2px] mt-3" style={{ color: theme.textMuted }}>
              No History Yet
            </Text>
            <Text className="text-sm text-center max-w-[220px] leading-relaxed mt-1" style={{ color: theme.textMuted }}>
              Complete a target to record your achievement here
            </Text>
          </View>
        ) : (
          history.map(item => (
            <View
              key={item.id}
              className="p-3 rounded-[12px] flex-row items-center justify-between gap-2"
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.surfaceBorder,
                borderWidth: 1,
                borderLeftWidth: 2.5,
                borderLeftColor: theme.accent,
              }}
            >
              <View className="flex-1 min-w-0">
                <Text className="font-extrabold text-sm leading-tight" style={{ color: theme.textPrimary }} numberOfLines={1}>
                  {item.phrase}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-xs font-mono" style={{ color: theme.textMuted }}>
                    {item.timestamp}
                  </Text>
                  <View className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: theme.textMuted }} />
                  <Text className="text-xs font-mono font-extrabold" style={{ color: theme.accent }}>
                    {item.count}×
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => onDelete(item.id)}
                className="p-1.5 rounded-lg active:opacity-60"
                style={{ backgroundColor: theme.itemBg }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={14} color={theme.textMuted} />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
