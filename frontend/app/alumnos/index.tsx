import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text } from 'react-native';
import { useEffect } from 'react';
import useFetch from 'hooks/useFetch';
import QRCode from 'react-native-qrcode-svg';
import Button from 'components/Button';
export default function AlumnosHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const GenerarQr = ()=>{
    console.log()
  }

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      const userData = await fetchData({
        url: 'http://localhost:4000/usuarioLog',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Persona: 'alumno',
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
    <view>
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
      </Pressable>
        <QRCode></QRCode>
        <Button label='Generar Qr' onPress={GenerarQr}></Button>
    </view>
  );
}

// const { token, rango, logout } = useAuth();
