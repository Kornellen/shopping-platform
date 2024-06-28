import { createContext, useEffect, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const lastTheme = window.localStorage.getItem("theme");

    return lastTheme || "light";
  });

  const changeTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
