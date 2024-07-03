import AppRoutes from "./routes/index";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, ThemeProvider, UserProvider } from "./context";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
