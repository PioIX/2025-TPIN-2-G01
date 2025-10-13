import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-red-600 text-lg mb-4">Pantalla Home</Text>
      <Pressable
        className="px-4 py-2 bg-blue-500 rounded"
        onPress={() => router.push("/about?id=1")}
      >
        <Text className="text-red-950">Ir a About</Text>
      </Pressable>
    </View>
  );
}
