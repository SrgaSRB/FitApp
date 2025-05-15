import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  login: (jwt: string) => void;
  logout: () => void;
};

interface JwtPayload {
  exp: number;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const login = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
    window.location.href = "/home";
  };

  useEffect(() => {
    if (!token) return;

    let isActive = true;
    const { exp } = jwtDecode<JwtPayload>(token);
    const ttl = exp * 1000 - Date.now();

    if (ttl <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      if (isActive) logout();
    }, ttl);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
