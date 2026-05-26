import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import type { Theme } from '../constants/themes';

interface Props {
  visible: boolean;
  theme: Theme;
  onClose: () => void;
  onSave: (english: string, arabic: string, meaning: string) => boolean;
}

export default function AddPhraseModal({ visible, theme, onClose, onSave }: Props) {
  const [english, setEnglish] = useState('');
  const [arabic, setArabic] = useState('');
  const [meaning, setMeaning] = useState('');

  const handleSave = () => {
    const saved = onSave(english, arabic, meaning);
    if (saved) {
      setEnglish('');
      setArabic('');
      setMeaning('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      >
        <View
          className="w-[90%] max-w-sm rounded-[24px] p-6"
          style={{
            backgroundColor: theme.bg,
            borderColor: theme.surfaceBorder,
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            elevation: 12,
          }}
        >
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="p-1.5 rounded-lg" style={{ backgroundColor: theme.accentDim }}>
                <Plus size={16} color={theme.accent} />
              </View>
              <Text className="text-sm font-black tracking-[2px] uppercase" style={{ color: theme.textPrimary }}>
                New Dhikr
              </Text>
            </View>
            <Pressable onPress={onClose} className="p-1.5 rounded-lg active:opacity-60" style={{ backgroundColor: theme.itemBg }}>
              <X size={18} color={theme.textMuted} />
            </Pressable>
          </View>

          <View className="gap-4">
            <View className="gap-1.5">
              <Text className="text-[11px] uppercase font-black tracking-[2px]" style={{ color: theme.textMuted }}>
                English Transliteration
              </Text>
              <TextInput
                className="rounded-[12px] px-3.5 py-3 text-sm"
                placeholder="e.g. Subhanallahul Azim"
                placeholderTextColor={theme.textMuted}
                value={english}
                onChangeText={setEnglish}
                style={{ backgroundColor: theme.itemBg, borderColor: theme.surfaceBorder, borderWidth: 1, color: theme.textPrimary }}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-[11px] uppercase font-black tracking-[2px]" style={{ color: theme.textMuted }}>
                Arabic Calligraphy
              </Text>
              <TextInput
                className="rounded-[12px] px-3.5 py-3 text-sm"
                placeholder="e.g. سُبْحَانَ اللَّه الْعَظِيم"
                placeholderTextColor={theme.textMuted}
                value={arabic}
                onChangeText={setArabic}
                textAlign="right"
                style={{ backgroundColor: theme.itemBg, borderColor: theme.surfaceBorder, borderWidth: 1, color: theme.textPrimary }}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-[11px] uppercase font-black tracking-[2px]" style={{ color: theme.textMuted }}>
                Translation Meaning
              </Text>
              <TextInput
                className="rounded-[12px] px-3.5 py-3 text-sm"
                placeholder="e.g. Glory be to Allah, the Magnificent"
                placeholderTextColor={theme.textMuted}
                value={meaning}
                onChangeText={setMeaning}
                style={{ backgroundColor: theme.itemBg, borderColor: theme.surfaceBorder, borderWidth: 1, color: theme.textPrimary }}
              />
            </View>

            <Pressable
              onPress={handleSave}
              className="w-full mt-2 py-3.5 rounded-[12px] items-center active:opacity-80"
              style={{
                backgroundColor: theme.buttonBg,
                shadowColor: theme.accent,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="font-black text-sm tracking-wide" style={{ color: theme.buttonText }}>
                Save Phrase
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
