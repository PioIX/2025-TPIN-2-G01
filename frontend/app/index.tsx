import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import type { formData } from "types";
import { useState } from "react";
import Input from "components/input";
import type { User } from "types";
import useFetch from "hooks/useFetch";
export default function HomeScreen() {
  const router = useRouter();
  const { data, error, loading, fetchData } = useFetch<User>();
  const [user, setUser] = useState<formData>({
    Email: "",
    Contraseña: "",
  });

  const [MsgError, setMsgError] = useState<string | null>(null);

  // una funcion que recibe el campo que se quiere actualizar, copia lo que ta tenia y actualiza
  const handleChange = (field: keyof formData, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    if (field === "Email") setMsgError(null); // limpiamos error al tipear
  };
  
  // usamos una regex para chequear que ponga un mail
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

    console.log("Datos del usuario:", user);
    handleLogin(user)
    // router.push("/about?id=1");
  };

  const handleLogin = async(user:formData) => {
    console.log(user)
    await fetchData({
      url: `http://localhost:4000/login?correo_electronico=${user.Email}&contraseña=${user.Contraseña}`,
      method: "GET",
    }
    ).then(data=>console.log(data))
  }
  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-100">
      <Text className="text-red-600 text-lg mb-2">Email</Text>
      <Input
        className={`w-full p-3 rounded-xl border ${
          MsgError && !validarEmail(user.Email) ? "border-red-500" : "border-gray-800"
        } bg-white text-black mb-3 shadow-sm`}
        placeholder="Ingrese su email"
        value={user.Email}
        onChangeText={(text) => handleChange("Email", text)}
      />

      <Text className="text-red-600 text-lg mb-2">Contraseña</Text>

      <Input
        className="w-full p-3 rounded-xl border border-gray-800 bg-white text-black mb-6"
        placeholder="Ingrese su contraseña"
        secureTextEntry
        value={user.Contraseña}
        onChangeText={(text) => handleChange("Contraseña", text)}
      />

      <Pressable
        className="bg-blue-600 py-4 px-12 rounded-xl shadow-md"
        onPress={handlePress}
      >
        {({ pressed }) => (
          <Text
            className={`text-white text-center font-semibold text-base ${
              pressed ? "opacity-70" : "opacity-100"
            }`}
          >
            Ir a About
          </Text>
        )}
      </Pressable>
    </View>
  );
}
