export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLORS: Record<Theme, string> = { dark: '#07080c', light: '#f3f5f9' };

/** The theme currently applied to the page (set before first paint by the script in index.html) */
export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** The saved choice, or null when the visitor hasn't picked one (then the system setting rules) */
export function savedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** Apply a theme to the page. `persist` records it as an explicit choice. */
export function applyTheme(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode: the choice just won't outlive the tab */
    }
  }
}
