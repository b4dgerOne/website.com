import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import * as Brightness from 'expo-brightness';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChessTimer } from '@/hooks/useChessTimer';
import { formatTime } from '@/constants/utils';
import { themes, type ThemeName } from '@/constants/themes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const ChessTimer = () => {
  const { width, height } = useWindowDimensions();
  const [theme, setTheme] = useState<ThemeName>('classic');
  const [minutes, setMinutes] = useState('5');
  const [showSetup, setShowSetup] = useState(true);
  const [originalBrightness, setOriginalBrightness] = useState<number | null>(null);
  const timer = useChessTimer(parseInt(minutes) || 5);

  const currentTheme = themes[theme];

  useEffect(() => {
    const setupScreen = async () => {
      try {
        const brightness = await Brightness.getBrightnessAsync();
        setOriginalBrightness(brightness);
        await Brightness.setBrightnessAsync(0.7);
      } catch (e) {
        console.log('Brightness control not available');
      }
    };

    setupScreen();

    return () => {
      if (originalBrightness !== null) {
        Brightness.setBrightnessAsync(originalBrightness).catch(() => {});
      }
    };
  }, []);

  const handleStartGame = () => {
    timer.reset(parseInt(minutes) || 5);
    setShowSetup(false);
  };

  const whiteTimeStr = formatTime(timer.whiteTime);
  const blackTimeStr = formatTime(timer.blackTime);

  const timerSize = Math.min(width, height) * 0.25;
  const fontSize = timerSize * 0.4;
  const controlFontSize = timerSize * 0.15;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
      <Modal visible={showSetup} animationType="fade" transparent={false}>
        <SafeAreaView style={[styles.setupContainer, { backgroundColor: '#1a1a1a' }]}>
          <View style={styles.setupContent}>
            <Text style={styles.setupTitle}>Chess Timer</Text>

            <View style={styles.settingGroup}>
              <Text style={styles.label}>Time per side (minutes):</Text>
              <TextInput
                style={styles.input}
                placeholder="5"
                placeholderTextColor="#666"
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.settingGroup}>
              <Text style={styles.label}>Theme:</Text>
              <View style={styles.themeGrid}>
                {(Object.keys(themes) as ThemeName[]).map((themeName) => (
                  <Pressable
                    key={themeName}
                    style={[
                      styles.themeButton,
                      theme === themeName && styles.themeButtonActive,
                    ]}
                    onPress={() => setTheme(themeName)}
                  >
                    <View
                      style={[
                        styles.themePreview,
                        {
                          flexDirection: 'row',
                          gap: 2,
                        },
                      ]}
                    >
                      <View
                        style={[
                          { flex: 1 },
                          { backgroundColor: themes[themeName].white },
                        ]}
                      />
                      <View
                        style={[
                          { flex: 1 },
                          { backgroundColor: themes[themeName].black },
                        ]}
                      />
                    </View>
                    <Text style={styles.themeName}>{themes[themeName].name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              style={[styles.startButton, { backgroundColor: '#4a9eff' }]}
              onPress={handleStartGame}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {!showSetup && (
        <>
          {/* White timer */}
          <Pressable
            style={[
              styles.timerHalf,
              {
                backgroundColor: currentTheme.white,
                transform: timer.activePlayer === 'white' ? [{ scale: 1 }] : [{ scale: 0.95 }],
              },
            ]}
            onPress={() => timer.tapTimer('white')}
          >
            <View style={styles.timerContent}>
              <Text style={[styles.playerLabel, { color: '#333' }]}>White</Text>
              <Text style={[styles.timerDisplay, { color: '#333', fontSize }]}>
                {whiteTimeStr}
              </Text>
              {timer.activePlayer === 'white' && (
                <Text style={[styles.indicator, { color: '#333' }]}>● Running</Text>
              )}
            </View>
          </Pressable>

          {/* Black timer */}
          <Pressable
            style={[
              styles.timerHalf,
              {
                backgroundColor: currentTheme.black,
                transform: timer.activePlayer === 'black' ? [{ scale: 1 }] : [{ scale: 0.95 }],
              },
            ]}
            onPress={() => timer.tapTimer('black')}
          >
            <View style={styles.timerContent}>
              <Text style={[styles.playerLabel, { color: '#ccc' }]}>Black</Text>
              <Text style={[styles.timerDisplay, { color: '#ccc', fontSize }]}>
                {blackTimeStr}
              </Text>
              {timer.activePlayer === 'black' && (
                <Text style={[styles.indicator, { color: '#ccc' }]}>● Running</Text>
              )}
            </View>
          </Pressable>

          {/* Controls */}
          <View style={styles.controlsOverlay}>
            {timer.isRunning && (
              <Pressable style={styles.controlButton} onPress={timer.pause}>
                <Text style={styles.controlText}>Pause</Text>
              </Pressable>
            )}
            {!timer.isRunning && timer.activePlayer && (
              <Pressable style={styles.controlButton} onPress={timer.resume}>
                <Text style={styles.controlText}>Resume</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.controlButton, { backgroundColor: '#d32f2f' }]}
              onPress={() => {
                setShowSetup(true);
              }}
            >
              <Text style={styles.controlText}>Reset</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  timerHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
    gap: 20,
  },
  playerLabel: {
    fontSize: 24,
    fontWeight: '600',
  },
  timerDisplay: {
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  indicator: {
    fontSize: 14,
    fontWeight: '500',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  controlText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  setupContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  setupContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 30,
  },
  setupTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingGroup: {
    gap: 12,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    minWidth: '45%',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeButtonActive: {
    borderColor: '#4a9eff',
    backgroundColor: 'rgba(74, 158, 255, 0.1)',
  },
  themePreview: {
    width: '100%',
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
  },
  themeName: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
  startButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
