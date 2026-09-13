import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth';
import { saveSession, loadSession, clearSession } from '../storage';

const AuthContext = createContext(null);

function toUser({ nome, email, role, tutorId, veterinarioId }) {
  return { nome, email, role, tutorId, veterinarioId };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    loadSession().then((session) => {
      if (session) setUser(session.user);
      setInitializing(false);
    });
  }, []);

  const signup = useCallback(async ({ email, password, nome, telefone, cpf }) => {
    const response = await authApi.register({
      nome, email, telefone, cpf, senha: password, confirmarSenha: password,
    });
    const nextUser = toUser(response);
    await saveSession(response.token, nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login(email, password);
    const nextUser = toUser(response);
    await saveSession(response.token, nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
