// Source - https://stackoverflow.com/q/62366578
// Posted by userNick, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-19, License - CC BY-SA 4.0

import { useState, useEffect, createContext } from "react";
import axios from "axios";
import * as React from "react";
import { instance } from "../api/api";

export interface LayoutProps  { 
   children: React.ReactNode
}

type Auth = {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string ) => void;
  logout: () => void;
}

export const AuthContext = createContext<Auth>({
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children}:LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));

  const isAuth = async () => {
    const savedToken = localStorage.getItem("token");
  
    if (!savedToken) {
      setIsAuthenticated(false);
      return;
    }else{
      setIsAuthenticated(true)
    }

    
  };

  const login = ( accessToken: string, refreshToken: string ) => {
    if (!accessToken || !refreshToken) return;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    isAuth();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
