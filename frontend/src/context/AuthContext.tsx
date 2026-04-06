import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  gymName: string | null;
  login: (token: string, gymName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ token: null, gymName: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [gymName, setGymName] = useState<string | null>(localStorage.getItem('gym_name'));

  const login = (newToken: string, name: string) => {
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('gym_name', name);
    setToken(newToken);
    setGymName(name);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('gym_name');
    setToken(null);
    setGymName(null);
  };

  return (
    <AuthContext.Provider value={{ token, gymName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
