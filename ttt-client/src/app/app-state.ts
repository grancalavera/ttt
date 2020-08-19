import create from "zustand";

export const darkTheme = "bp3-dark";
export const lightTheme = "bp3-light";
type ThemeClass = typeof darkTheme | typeof lightTheme;

interface Theme {
  isDark: boolean;
  themeClass: ThemeClass;
}

interface State {
  toggleTheme: () => void;
}

export const [useAppState] = create<State & Theme>((set) => ({
  ...loadTheme(),
  toggleTheme: () =>
    set((state) => {
      const isDark = !state.isDark;
      const theme = isDark ? darkTheme : lightTheme;
      saveTheme(theme);
      return { isDark, themeClass: theme };
    }),
}));

function loadTheme(): Theme {
  if (localStorage.getItem("theme") === lightTheme) {
    return { isDark: false, themeClass: lightTheme };
  }

  saveTheme(darkTheme);
  return { isDark: true, themeClass: darkTheme };
}

function saveTheme(theme: ThemeClass) {
  localStorage.setItem("theme", theme);
}
