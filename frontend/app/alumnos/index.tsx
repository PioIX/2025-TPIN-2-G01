import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

import { Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import Qr from 'components/QrGenerator';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
export default function AlumnosHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const 
  const [qrValue, setQrValue] = useState<string>("")
  useEffect(() => {
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
  }, [])

  /**
   * trae la info del usuario logeado
   * @returns {message:{datosEstudiantes}}
   */

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };


  async function generarQr(): Promise<void> {
    await fetchUser()
    console.log("pipo", email)
    setQrValue(email)
    console.log("pepe", qrValue)
  }

  return (
    <View>
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>

      </Pressable>
      {email && <Qr
        value={""}
        size={256}
        color="#0f0f0f"
        backgroundColor="#f0f0f0"
      >
      </Qr>
      }

      <Button label="generar qr" onPress={() => { generarQr() }}></Button>
    </View>
  );
}
// const { token, rango, logout } = useAuth();
