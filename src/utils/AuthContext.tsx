import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, removeToken } from './storage';

type AuthContextValue = {
  session: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      setSession(token);
      setLoading(false);
    })();
  }, []);

  async function signIn(token: string) {
    await saveToken(token);
    setSession(token);
  }

  async function signOut() {
    await removeToken();
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
