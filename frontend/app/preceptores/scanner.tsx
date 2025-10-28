import { Text } from "react-native";
import { View } from "react-native";
import Scanner from "components/camera";
export default function App({}){
     return (
    <>
      <View className="w-full px-4 py-3 md:px-8 md:py-4 bg-gray-50 border-b border-gray-200">
        <View className="max-w-7xl mx-auto w-full">
          <Text className="text-xl md:text-2xl font-bold text-gray-800">
            Scanner
          </Text>
        </View>
      </View>

      <View className="flex-1">
        <Scanner />
      </View>

      <View className="w-full px-4 py-4 md:px-8 md:py-6 bg-gray-50 border-t border-gray-200">
        <View className="max-w-7xl mx-auto w-full">
          <Text className="text-base md:text-lg text-gray-600 text-center">
            Hola
          </Text>
        </View>
      </View>
    </>
  );
}