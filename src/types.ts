export type ModuleId = 'membaca' | 'suara' | 'gambar' | 'menulis' | 'berhitung';

export type ThemeName = 'cerah' | 'lembut';
export type ThemePackId = 'tanpa' | 'hewan' | 'pantai' | 'gunung' | 'angkasa' | 'buah';

export interface AppSettings {
  childName: string;
  ageGroup: 4 | 5 | 6;
  voiceEnabled: boolean;
  soundEffects: boolean;
  musicEnabled: boolean;
  voiceRate: number;
  voicePitch: number;
  largeText: boolean;
  theme: ThemeName;
  themePack: ThemePackId;
  enabledModules: ModuleId[];
}

export interface LearningModule {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  skill: string;
}

export interface LearningItem {
  id: string;
  label: string;
  say: string;
  visual: string;
  options?: string[];
}

export interface Progress {
  stars: number;
  completed: Record<string, number>;
}
