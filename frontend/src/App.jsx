import AppRoutes from "./routes/index";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, ThemeProvider, UserProvider } from "./context";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserProvider>
            <ThemeProvider>
              <AppRoutes />
            </ThemeProvider>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
