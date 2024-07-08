import {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
} from "react";

interface AuthContextInterface {
  auth: boolean;
  userID: string | null;
  login: (newAuth: boolean, newUserID: string | null) => void;
  logout: () => void;
}

interface AuthContextProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  auth: false,
  userID: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(() =>
    Boolean(window.localStorage.getItem("auth"))
  );

  const [userID, setUserID] = useState(() => {
    return window.localStorage.getItem("userID");
  });

  const login = (newAuth: boolean, newUserID: string | null) => {
    setAuth(newAuth);
    setUserID(newUserID);
  };

  const logout = () => {
    setAuth(false);
    setUserID(null);
  };

  useEffect(() => {
    window.localStorage.setItem("auth", String(auth));
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
