import { Pressable, Text, View, Modal } from 'react-native';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LogOut() {
  const { logout } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };
  
  return (
    <View className="flex-1 justify-center items-center bg-aparcs-bg px-6 pb-20">
      <View className="w-full max-w-sm p-8">
        
        <Text className="text-2xl font-bold italic text-aparcs-text-dark text-center mb-8">
          Configuración
        </Text>

        <View className="w-full p-4 rounded-full border-2 border-gray-300 bg-white mb-4">
          <Text className="text-gray-700 text-center">
            usuario@pioix.edu.ar
          </Text>
        </View>

        <View className="w-full p-4 rounded-full border-2 border-gray-300 bg-white mb-8">
          <Text className="text-gray-700 text-center">
            ••••••••
          </Text>
        </View>

        <Pressable
          onPress={() => setShowModal(true)}
          className="w-full bg-red-600 py-4 rounded-full shadow-lg"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Cerrar Sesión
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-gray-900 rounded-2xl p-8 mx-6 w-full max-w-sm">
            <Text className="text-white text-2xl font-bold text-center mb-8">
              ¿Estás seguro?
            </Text>
            
            <View className="flex-row justify-center">
              <Pressable
                onPress={handleLogout}
                className="flex-1 bg-green-500 py-4 rounded-full mr-2"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Si
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setShowModal(false)}
                className="flex-1 bg-red-600 py-4 rounded-full ml-2"
              >
                <Text className="text-white text-center font-bold text-lg">
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}