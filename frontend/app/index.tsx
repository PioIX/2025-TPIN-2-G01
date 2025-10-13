import { View, Text, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import type { formData } from "types";
import { useState } from "react";
import Input from "components/input";
export default function HomeScreen() {
  const router = useRouter();
  const [user,setUser] = useState<formData | null>(null)
  const cambiarNombre = (input:string) => {
    setUser()
  }
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-red-600 text-lg mb-4">email</Text>
        <Input className="border border-black p-2 text-black" placeholder="mail"></Input>
      <Text className="text-red-600 text-lg mb-4">Contraseña</Text>
        <TextInput className="border border-black p-2 text-black" value={user?.Email}></TextInput>
     <Pressable
        className="px-4 py-2 bg-blue-500 rounded"
        onPress={() => router.push("/about?id=1")}
        >
        <Text className="text-red-950">Ir a About</Text>
      </Pressable> 
    </View>
  );
}
