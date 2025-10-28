import { Pressable, Text, View, SafeAreaView, Platform } from 'react-native';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'expo-router';

export default function About() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };
  
  return (
    <>
      <View className="w-full px-4 py-3 md:px-8 md:py-4 bg-gray-50 border-b border-gray-200">
        <View className="max-w-7xl mx-auto w-full flex-row justify-between items-center">
          <Text className="text-xl md:text-2xl font-bold text-gray-800">
            About
          </Text>
          <Pressable 
            onPress={handleLogout}
            className="px-4 py-2 md:px-6 md:py-2.5 bg-cyan-500 rounded-lg active:bg-red-600"
          >
            <Text className="text-white font-semibold text-sm md:text-base">
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </>
);
}