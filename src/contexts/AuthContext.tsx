import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('shopmini_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopmini_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopmini_user');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Giả lập xử lý đăng nhập, password = "123456"
    if (password === '123456') {
      const newUser: User = { username: username.trim() || 'Người dùng' };
      setUser(newUser);
      return { success: true };
    }
    return { success: false, message: 'Mật khẩu không chính xác! (Mật khẩu đúng: 123456)' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
