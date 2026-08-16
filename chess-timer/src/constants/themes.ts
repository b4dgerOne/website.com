export const themes = {
  classic: {
    name: 'Classic',
    white: '#E8D5B7',
    black: '#8B6F47',
  },
  ocean: {
    name: 'Ocean',
    white: '#B8E0F0',
    black: '#2E5F8A',
  },
  forest: {
    name: 'Forest',
    white: '#D4E8D4',
    black: '#3D5F3F',
  },
  sunset: {
    name: 'Sunset',
    white: '#F0D4A8',
    black: '#8B5A3C',
  },
  lavender: {
    name: 'Lavender',
    white: '#E6D5F0',
    black: '#5D4D7F',
  },
  minimal: {
    name: 'Minimal',
    white: '#F5F5F5',
    black: '#333333',
  },
} as const;

export type ThemeName = keyof typeof themes;
