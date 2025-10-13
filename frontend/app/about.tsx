import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-blue-600 text-lg mb-4">Pantalla About</Text>
      <Pressable
        className="px-4 py-2 bg-red-500 rounded"
        onPress={() => router.back()} 
      >
        <Text className="text-red">Volver a Home</Text>
      </Pressable>
    </View>
  );
}
