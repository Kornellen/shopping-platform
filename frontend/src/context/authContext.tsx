import {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
} from "react";

interface AuthContextInterface {
  auth: string;
  userID: string | null;
  login: (newAuth: string, newUserID: string | null) => void;
  logout: () => void;
}

interface AuthContextProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  auth: "false",
  userID: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [auth, setAuth] = useState(
    () => window.localStorage.getItem("auth") ?? "false"
  );

  const [userID, setUserID] = useState(() => {
    return window.localStorage.getItem("userID");
  });

  const login = (newAuth: string, newUserID: string | null) => {
    setAuth(newAuth);
    setUserID(newUserID);
  };

  const logout = () => {
    setAuth("false");
    setUserID(null);
  };

  useEffect(() => {
    window.localStorage.setItem("auth", auth);
    if (userID !== null) {
      window.localStorage.setItem("userID", userID);
    } else {
      window.localStorage.removeItem("userID");
    }
  }, [auth, userID]);

  return (
    <AuthContext.Provider value={{ auth, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
