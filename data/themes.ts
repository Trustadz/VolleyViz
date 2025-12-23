
import { ThemeConfig } from '../types';

export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Classic Slate',
  primary: "#1e293b", // Team A (Dark Slate)
  away: "#dc2626", // Team B (Red)
  secondary: "#ffffff", // Text
  accent: "#f59e0b", // Gold/Amber (Ball)
  courtBg: "#e5e7eb", // Light Gray Court
  courtLines: "#ffffff", // White Lines
};

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Midnight Blue',
  primary: "#3b82f6", // Team A (Blue)
  away: "#ef4444", // Team B (Red)
  secondary: "#ffffff",
  accent: "#fbbf24",
  courtBg: "#0f172a", // Dark Court
  courtLines: "#334155",
};

export const themes = [defaultTheme, darkTheme];
