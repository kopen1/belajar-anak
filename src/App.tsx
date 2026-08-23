import { useEffect, useMemo, useState } from 'react';
import type { ModuleId, Progress } from './types';
import { defaultSettings, getEnabledModules } from './data/learning';
import { startBackgroundMusic, stopBackgroundMusic } from './lib/audio';
import { useLocalStorage } from './lib/storage';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ModuleScreen } from './screens/ModuleScreen';
import { DrawScreen } from './screens/DrawScreen';

type Route = { name: 'home' } | { name: 'settings' } | { name: 'draw' } | { name: 'module'; moduleId: ModuleId };

const defaultProgress: Progress = { stars: 0, completed: {} };

export default function App() {
  const [settings, setSettings] = useLocalStorage('belajar.settings.v1', defaultSettings);
  const [progress, setProgress] = useLocalStorage('belajar.progress.v1', defaultProgress);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const modules = useMemo(() => getEnabledModules(settings), [settings]);

  useEffect(() => {
    if (settings.musicEnabled) startBackgroundMusic();
    else stopBackgroundMusic();
    return () => stopBackgroundMusic();
  }, [settings.musicEnabled]);

  function toggleMusic() {
    setSettings((current) => ({ ...current, musicEnabled: !current.musicEnabled }));
  }

  function completeActivity(moduleId: string, earnedStar: boolean) {
    if (!earnedStar) return;
    setProgress((current) => ({
      stars: current.stars + 1,
      completed: { ...current.completed, [moduleId]: (current.completed[moduleId] ?? 0) + 1 },
    }));
  }

  return (
    <div className={`app ${settings.theme} theme-${settings.themePack} ${settings.largeText ? 'large-text' : ''}`}>
      {route.name === 'home' && (
        <HomeScreen
          settings={settings}
          modules={modules}
          progress={progress}
          onOpenModule={(moduleId) => setRoute({ name: 'module', moduleId })}
          onOpenSettings={() => setRoute({ name: 'settings' })}
          onOpenDraw={() => setRoute({ name: 'draw' })}
          onToggleMusic={toggleMusic}
        />
      )}
      {route.name === 'settings' && (
        <SettingsScreen
          settings={settings}
          onChange={setSettings}
          onBack={() => setRoute({ name: 'home' })}
          stars={progress.stars}
        />
      )}
      {route.name === 'draw' && (
        <DrawScreen
          settings={settings}
          onBack={() => setRoute({ name: 'home' })}
          onComplete={completeActivity}
        />
      )}
      {route.name === 'module' && (() => {
        const activeModule = modules.find((module) => module.id === route.moduleId);
        if (!activeModule) return null;
        return (
          <ModuleScreen
            module={activeModule}
            settings={settings}
            onBack={() => setRoute({ name: 'home' })}
            onComplete={completeActivity}
          />
        );
      })()}
    </div>
  );
}
