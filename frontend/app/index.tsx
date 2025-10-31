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
      url: `https://huge-streets-brake.loca.lt/login?correo_electronico=${user.Email}&contraseña=${user.Contraseña}`,
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
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg">Cargando...</Text>
      </View>
    );
  }

  return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-6">
    <View className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
      <Text className="text-2xl font-bold text-center text-blue-700 mb-6">
        Iniciar sesión
      </Text>

      <Text className="text-gray-700 text-base mb-2">Email</Text>
      <Input
        className={`w-full p-3 rounded-xl border ${
          MsgError && !validarEmail(user.Email)
            ? "border-red-500"
            : "border-gray-400"
        } bg-gray-50 text-black mb-4`}
        placeholder="Ingrese su email"
        value={user.Email}
        onChangeText={(text) => handleChange("Email", text)}
      />

      <Text className="text-gray-700 text-base mb-2">Contraseña</Text>
      <Input
        className="w-full p-3 rounded-xl border border-gray-400 bg-gray-50 text-black mb-6"
        placeholder="Ingrese su contraseña"
        secureTextEntry
        value={user.Contraseña}
        onChangeText={(text) => handleChange("Contraseña", text)}
      />

      <Pressable
        className={`bg-blue-600 py-3 rounded-xl shadow-md ${
          loading ? "opacity-70" : "opacity-100"
        }`}
        onPress={handlePress}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Text>
      </Pressable>
    </View>
  </View>
  );
}
