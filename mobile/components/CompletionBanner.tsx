import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Sparkles, X } from 'lucide-react-native';
import type { Theme } from '../constants/themes';

interface Props {
  message: string | null;
  theme: Theme;
  onDismiss: () => void;
}

export default function CompletionBanner({ message, theme, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      opacity.setValue(0);
      translateY.setValue(-50);
      scale.setValue(0.7);

      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      ]).start();

      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(shine, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(shine, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [message, opacity, translateY, scale, shine]);

  if (!message) return null;

  const shineOpacity = shine.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Animated.View
      className="absolute top-4 left-4 right-4 z-50 rounded-[20px] p-4 flex-row items-center justify-between"
      style={{
        opacity,
        transform: [{ translateY }, { scale }],
        backgroundColor: theme.bannerFrom,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(2,6,23,0.1)' }}>
          <Sparkles size={20} color="#020617" />
        </View>
        <View className="flex-1">
          <Text className="text-[9px] font-black uppercase tracking-[2px]" style={{ color: 'rgba(2,6,23,0.6)' }}>
            Milestone Reached
          </Text>
          <Animated.Text
            className="text-xs font-black mt-0.5 leading-tight"
            style={{ color: '#020617', opacity: shineOpacity }}
            numberOfLines={2}
          >
            {message}
          </Animated.Text>
        </View>
      </View>
      <Pressable onPress={onDismiss} className="p-1.5 rounded-lg active:opacity-60">
        <X size={16} color="#020617" />
      </Pressable>
    </Animated.View>
  );
}
