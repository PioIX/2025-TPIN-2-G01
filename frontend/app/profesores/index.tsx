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
    <View>
      <Text>{message}</Text>
    </View>
  </>
  );
}

