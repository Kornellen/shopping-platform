import AppRoutes from "./routes/index";
import { ThemeProvider } from "./context/themeContext";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
