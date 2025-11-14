import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Input from "components/input";
import { useAuth } from "./context/AuthContext";
import type { formData, LoginFetchResponse } from "types";
import useFetch from "hooks/useFetch";

export default function HomeScreen() {
  const router = useRouter();
  const { token, rango, login } = useAuth(); 
  const { data, error, loading, fetchData } = useFetch<LoginFetchResponse>();

  const [user, setUser] = useState<formData>({
    Email: "",
    Contraseña: "",
  });

  const [MsgError, setMsgError] = useState<string | null>(null);

  useEffect(() => {
    if (token && rango) {
      switch (rango) {
        case "owner":
          router.replace("/administradores");
          break;
        case "preceptor":
          router.replace("/preceptores");
          break;
        case "alumno":
          router.replace("/alumnos");
          console.log("este es el token",token)
          break;
        case "profesor":
          router.replace("/profesores");
          break;
        default:
          console.log("Rango desconocido");
          break;
      }
    }
  }, [token, rango]);

  const handleChange = (field: keyof formData, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    if (field === "Email") setMsgError(null);
  };
  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlePress = () => {
    if (!validarEmail(user.Email)) {
      alert("Error, Ingresa un email válido");
      return;
    }

    if (user.Contraseña.trim() === "") {
      alert("Error, Ingresa una contraseña válida");
      return;
    }

    handleLogin(user);
  };
  // poner tunnel
  const handleLogin = async (user: formData) => {
    const data = await fetchData({
      url: `http://localhost:4000/login?correo_electronico=${user.Email}&contraseña=${user.Contraseña}`,
      method: "GET",
    });

    if (!data) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
      return;
    }

    if (data.key && data.rango) {
      await login(data.key, data.rango); 
    }

    switch (data.rango) {
      case "owner":
        router.push("/administradores");
        break;
      case "preceptor":
        router.push("/preceptores");
        break;
      case "alumno":
        router.push("/alumnos");
        break;
      case "profesor":
        router.push("/profesores");
        break;
      default:
        Alert.alert("Error", "Rango no reconocido");
        break;
    }
  };

  if (token && rango) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-4 sm:px-6 md:px-8">
        <Text className="text-base sm:text-lg md:text-xl">Cargando...</Text>
      </View>
    );
  }

  return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-4 sm:px-6 md:px-8">
    <View className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
      <Text className="text-lg sm:text-xl md:text-2xl font-bold text-center text-blue-700 mb-4 sm:mb-6">
        Iniciar sesión
      </Text>

      <Text className="text-gray-700 text-sm sm:text-base mb-2">Email</Text>
      <Input
        className={`w-full p-3 sm:p-4 md:p-5 rounded-xl border bg-gray-50 text-black mb-4 ${MsgError && !validarEmail(user.Email) ? "border-red-500" : "border-gray-400"}`}
        placeholder="Ingrese su email"
        value={user.Email}
        onChangeText={(text) => handleChange("Email", text)}
      />

      <Text className="text-gray-700 text-sm sm:text-base mb-2">Contraseña</Text>
      <Input
        className="w-full p-3 sm:p-4 md:p-5 rounded-xl border border-gray-400 bg-gray-50 text-black mb-6 sm:mb-6 md:mb-8"
        placeholder="Ingrese su contraseña"
        secureTextEntry
        value={user.Contraseña}
        onChangeText={(text) => handleChange("Contraseña", text)}
      />

      <Pressable
        className={`w-full bg-blue-600 py-3 sm:py-3 md:py-4 rounded-xl shadow-md ${loading ? "opacity-70" : "opacity-100"}`}
        onPress={handlePress}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-sm sm:text-base md:text-base">
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Text>
      </Pressable>
    </View>
  </View>
  );
}
