import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getSystemPrefersDark(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyThemeClass(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initialDark = stored ? stored === 'dark' : getSystemPrefersDark();
    setIsDark(initialDark);
    applyThemeClass(initialDark);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      const hasStored = !!localStorage.getItem('theme');
      if (!hasStored) {
        setIsDark(e.matches);
        applyThemeClass(e.matches);
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    applyThemeClass(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className="relative"
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}


