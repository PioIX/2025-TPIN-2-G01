import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthContextType } from "types"; // Importa la interfaz de TypeScript que define token, rango, login y logout

//  Creamos el contexto con valores por defecto
const AuthContext = createContext<AuthContextType>({
  token: null,          // Token JWT por defecto nulo
  rango: null,          // Rango de usuario por defecto nulo
  login: async () => {}, // Función login vacía por defecto
  logout: async () => {}, // Función logout vacía por defecto
});

//  Provider que envuelve toda la app y provee el contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null); // Estado local del token
  const [rango, setRango] = useState<string | null>(null); // Estado local del rango

  //  useEffect que se ejecuta al iniciar la app para cargar token y rango desde AsyncStorage
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("jwt"); // Buscamos el token guardado
      const storedRango = await AsyncStorage.getItem("rango"); // Buscamos el rango guardado
      if (storedToken) setToken(storedToken); // Si existe, lo guardamos en el estado
      if (storedRango) setRango(storedRango); // Si existe, lo guardamos en el estado
    })();
  }, []);

  // Función para hacer login: guarda token y rango en estado y AsyncStorage
  const login = async (newToken: string, userRango: string) => {
    setToken(newToken); // Guardamos token en estado
    setRango(userRango); // Guardamos rango en estado
    await AsyncStorage.setItem("jwt", newToken); // Guardamos token en AsyncStorage
    await AsyncStorage.setItem("rango", userRango); // Guardamos rango en AsyncStorage
  };

  //  Función para cerrar sesión: limpia token y rango en estado y AsyncStorage
  const logout = async () => {
    setToken(null); // Limpiamos token del estado
    setRango(null); // Limpiamos rango del estado
    await AsyncStorage.removeItem("jwt"); // Eliminamos token de AsyncStorage
    await AsyncStorage.removeItem("rango"); // Eliminamos rango de AsyncStorage
  };

  //  Retornamos el proveedor con los valores y funciones que queremos compartir
  return (
    <AuthContext.Provider value={{ token, rango, login, logout }}>
      {children} {/* Renderizamos los hijos envueltos por el contexto */}
    </AuthContext.Provider>
  );
};

// 🔹 Hook personalizado para usar el contexto en cualquier pantalla
export const useAuth = () => useContext(AuthContext);
