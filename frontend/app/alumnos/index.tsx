import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import Qr from 'components/QrGenerator';
import Button from 'components/Button';
export default function AlumnosHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<any>("")
  const [qrValue, setQrValue] =useState<string>("hola   ")

  const fetchUser = async () => {
    const userData = await fetchData({
      url: 'http://localhost:4000/usuarioLog',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Persona: 'alumno',
      },
    });
    console.log(token)
    return userData
  };
    const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  async function getUser():Promise<void> {
    const userData = await fetchUser();
      setEmail(userData)
      console.log(userData);
  }

  function generarQr():void {
    getUser();
    setQrValue(email)
    console.log(email) 
  } 

  return (
    <view>
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
      </Pressable>
      <Qr  
        value={qrValue}
        size={128 }
        color="#0f0f0f'"
        backgroundColor="#f0f0f0"
        >
      </Qr>
      <Button label="generar qr" onPress={()=>{generarQr()}}></Button>
    </view>
  );
}



// const { token, rango, logout } = useAuth();
