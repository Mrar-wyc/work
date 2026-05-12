import type { ComponentType } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export type GameIconName = keyof typeof Ionicons.glyphMap;

export type GameCategory = 'puzzle' | 'arcade' | 'classic';

export type GameDefinition = {
  id: string;
  title: string;
  description?: string;
  icon: GameIconName;
  component: ComponentType;
  category?: GameCategory;
};
