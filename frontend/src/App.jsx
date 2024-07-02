import AppRoutes from "./routes/index";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./context";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
