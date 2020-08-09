import create from "zustand";

export const DARK_THEME = "bp3-dark";
export const LIGHT_THEME = "bp3-light";
type ThemeName = typeof DARK_THEME | typeof LIGHT_THEME;

interface Theme {
  isDark: boolean;
  theme: ThemeName;
}

interface Store {
  isDark: boolean;
  theme: typeof DARK_THEME | typeof LIGHT_THEME;
  toggleTheme: () => void;
}

export const [useStore] = create<Store>((set) => ({
  ...loadTheme(),
  toggleTheme: () =>
    set((state) => {
      const isDark = !state.isDark;
      const theme = isDark ? DARK_THEME : LIGHT_THEME;
      saveTheme(theme);
      return { isDark, theme };
    }),
}));

function loadTheme(): Theme {
  if (localStorage.getItem("theme") === LIGHT_THEME) {
    return { isDark: false, theme: LIGHT_THEME };
  }

  saveTheme(DARK_THEME);
  return { isDark: true, theme: DARK_THEME };
}

function saveTheme(theme: ThemeName) {
  localStorage.setItem("theme", theme);
}
