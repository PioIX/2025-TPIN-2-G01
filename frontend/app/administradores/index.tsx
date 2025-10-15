import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text } from 'react-native';
import { useEffect } from 'react';
import NavBar from 'components/navBar';
import useFetch from 'hooks/useFetch';
export default function AdministradorHome() {
  const menuItems = ["Inicio", "Perfil", "Ajustes"]; 
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };
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
    };
    fetchUser();
  }, [token]);
  return (
    <>
    
    <Pressable onPress={handleLogout}>
      <Text>Cerrar sesión</Text>
    </Pressable>
     {/* <NavBar props={menuItems} /> */}
    </>
  );
}
