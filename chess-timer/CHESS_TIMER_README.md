# Chess Timer App

A simple, locally-run chess timer app for Android built with React Native and Expo.

## Features

- **Dual Timer**: Split screen showing two timers (one for White, one for Black)
- **Configurable Time**: Set the time per side before starting (default 5 minutes)
- **Color-Coded Players**: Timers are color-coded by chess piece colors (not solid white/black)
- **Theme Picker**: Multiple theme options:
  - Classic: Traditional chess board colors
  - Ocean: Blue tones
  - Forest: Green tones
  - Sunset: Warm tones
  - Lavender: Cool purple tones
  - Minimal: Clean grayscale
- **Smart Activation**: White side starts first; tap either side to switch active timer
- **Screen Optimization**:
  - Automatic brightness reduction (keeps display readable while reducing eye strain)
  - Notifications disabled during gameplay (no interruptions)
  - Dark UI to reduce brightness overall
- **Controls**: Pause, Resume, and Reset buttons for easy game management

## How to Use

1. **Launch the app** - Opens to the setup screen
2. **Set time** - Enter desired time in minutes (e.g., 5, 10, 15)
3. **Choose theme** - Select your preferred color scheme
4. **Start game** - Tap "Start Game" button
5. **Play** - 
   - White timer starts automatically
   - Tap a timer to switch to the other player
   - Use Pause/Resume to pause the current timer
   - Use Reset to go back to setup

## Running

### Android
```bash
npm run android
```

### Development
```bash
npm start
```

## Build

To build an APK for distribution:
```bash
eas build --platform android
```

(Requires EAS CLI: `npm install -g eas-cli`)

## Technical Details

- Built with React Native + Expo
- Uses `expo-brightness` for screen brightness control
- Uses `expo-notifications` to suppress notifications during gameplay
- Responsive design works on all Android screen sizes
- 100ms timer resolution for accurate timekeeping

## Customization

### Add New Themes
Edit `/src/constants/themes.ts` to add or modify color schemes:

```typescript
export const themes = {
  yourTheme: {
    name: 'Your Theme',
    white: '#XXXXXX',
    black: '#XXXXXX',
  },
  // ... other themes
};
```

### Adjust Default Time
Modify the default in `/src/components/chess-timer.tsx`:
```typescript
const [minutes, setMinutes] = useState('5'); // Change to desired default
```
