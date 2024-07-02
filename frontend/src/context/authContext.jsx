import { createContext, useEffect, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const lastAuth = window.localStorage.getItem("auth");

    return lastAuth || false;
  });

  const [userID, setUserID] = useState(() => {
    return window.localStorage.getItem("userID");
  });

  const changeAuth = (newAuth, newUserID = null) => {
    setAuth(newAuth);
    if (newUserID !== null) {
      setUserID(newUserID);
    }
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
    <AuthContext.Provider value={{ auth, userID, changeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
