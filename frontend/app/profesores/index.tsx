import { useAuth } from '../context/AuthContext';
import { Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import { RolMessage } from 'types';
export default function ProfesoresHome() {
  const { data, error, loading, fetchData } = useFetch<RolMessage>();
  const { token } = useAuth();
  const [message,setMessage] = useState<string>("")
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const userData = await fetchData({
        url: 'http://localhost:4000/usuarioLog',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Persona: 'profesor',
        },
      });

      if (userData?.message) {
        setMessage(`Hola ${userData.message.nombre} como esta tu día `)
        
      } 
    };

    fetchUser();
  }, [token]);



  return (
  <>
    <View className="flex-1 items-center justify-center bg-gray-100 px-4 sm:px-6 md:px-8 py-6">
      <View className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
        <Text className="text-base sm:text-lg md:text-xl text-gray-800 text-center">
          {message}
        </Text>
      </View>
    </View>
  </>
  );
}

