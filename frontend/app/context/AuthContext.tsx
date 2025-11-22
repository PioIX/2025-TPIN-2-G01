import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthContextType } from "types";

const AuthContext = createContext<AuthContextType>({
  token: null,
  rango: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [rango, setRango] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("jwt");
      const storedRango = await AsyncStorage.getItem("rango");
      if (storedToken) setToken(storedToken);
      if (storedRango) setRango(storedRango);
    })();
  }, []);

  const login = async (newToken: string, userRango: string) => {
    setToken(newToken);
    setRango(userRango);
    await AsyncStorage.setItem("jwt", newToken);
    await AsyncStorage.setItem("rango", userRango);
  };

  const logout = async () => {
    setToken(null);
    setRango(null);
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("rango");
  };

  return (
    <AuthContext.Provider value={{ token, rango, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;