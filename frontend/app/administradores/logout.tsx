import { Pressable, Text, View } from 'react-native';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function LogOut() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };
  
  return (
    <SafeAreaProvider className="flex-1 bg-gray-50">
      <View className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
        <View className="w-full max-w-3xl mx-auto flex-col md:flex-row justify-between items-center gap-3">
          <Text className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Configuración
          </Text>
          <Pressable 
            onPress={handleLogout}
            className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-blue-700 rounded-lg active:bg-blue-500"
          >
            <Text className="text-white font-semibold text-sm sm:text-base md:text-base">
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
