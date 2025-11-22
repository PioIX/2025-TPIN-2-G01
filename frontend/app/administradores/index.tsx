import { useAuth } from '../context/AuthContext';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import { RolMessage } from 'types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AdminHome() {
  const { fetchData } = useFetch<RolMessage>();
  const { token } = useAuth();
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const userData = await fetchData({
        url: 'http://localhost:4000/usuarioLog',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Persona: 'admin',
        },
      });

      if (userData?.message) {
        setMessage(`Hola ${userData.message.nombre}, ¿cómo está tu día?`)
      }
    };

    fetchUser();
  }, [token]);

  return (
    <SafeAreaProvider className="flex-1 bg-aparcs-bg">
      <View className="flex-1 items-center justify-center bg-aparcs-bg px-6">
        <View className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-lg">
          <Text className="text-xl text-gray-800 text-center font-medium">
            {message || "Cargando..."}
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
