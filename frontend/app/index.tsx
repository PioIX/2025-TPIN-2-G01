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
      <View className="flex-1 justify-center items-center bg-aparcs-bg">
        <Text className="text-lg text-aparcs-text-dark">Cargando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-aparcs-bg px-6">
      {/* Card de Login */}
      <View className="w-full max-w-sm bg-aparcs-bg rounded-[30px] p-8">
        {/* Título */}
        <Text className="text-2xl font-bold italic text-aparcs-text-dark text-center mb-8">
          Inicie Sesión
        </Text>

        {/* Input Email */}
        <Input
          className={`w-full p-4 rounded-full border-2 bg-white text-gray-800 mb-4 ${
            MsgError && !validarEmail(user.Email) 
              ? "border-aparcs-ausente" 
              : "border-gray-300"
          }`}
          placeholder="Correo electrónico"
          placeholderTextColor="#9CA3AF"
          value={user.Email}
          onChangeText={(text) => handleChange("Email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Input Contraseña */}
        <Input
          className="w-full p-4 rounded-full border-2 border-gray-300 bg-white text-gray-800 mb-8"
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={user.Contraseña}
          onChangeText={(text) => handleChange("Contraseña", text)}
        />

        {/* Botón Iniciar */}
        <Pressable
          className={`w-full bg-aparcs-primary py-4 rounded-full shadow-lg ${
            loading ? "opacity-70" : "opacity-100"
          }`}
          onPress={handlePress}
          disabled={loading}
          style={({ pressed }) => [
            { backgroundColor: pressed ? '#0077B6' : '#1E90FF' }
          ]}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? "Cargando..." : "Iniciar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
