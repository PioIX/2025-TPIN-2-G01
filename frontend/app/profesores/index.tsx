import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text } from 'react-native';
import { useEffect } from 'react';
import useFetch from 'hooks/useFetch';

export default function ProfesoresHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
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
    };
    fetchUser();
  }, [token]);
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <Pressable onPress={handleLogout}>
      <Text>Cerrar sesión</Text>
    </Pressable>
  );
}

// const { token, rango, logout } = useAuth();
