import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import QRCode from 'react-native-qrcode-svg';
import Button from 'components/Button';
export default function AlumnosHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<any>("")
  const [label, setLabel] =useState<string>("")


  const fetchUser = async () => {
    const userData = await fetchData({
      url: 'http://localhost:4000/usuarioLog',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Persona: 'alumno',
      },
    });
    return userData
  };
  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUser();
      setEmail(userData);
    };
    getUser();
  }, []);
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  function generarQr():void {
    setLabel(email)
  } 


  return (
    <view>
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
      </Pressable>
      <Qrcode ty>

      </Qrcode>
      <Button label="generar qr"  onPress={()=>{generarQr}}></Button>
    </view>
  );
}



// const { token, rango, logout } = useAuth();
