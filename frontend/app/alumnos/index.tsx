import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import Qr from 'components/QrGenerator';
import Button from 'components/Button';
export default function AlumnosHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const [qrValue, setQrValue] = useState<string>("")

  /**
   * trae la info del usuario logeado
   * @returns {message:{datosEstudiantes}}
   */
  async function fetchUser(): Promise<void> {
    const userData = await fetchData({
      url: 'http://localhost:4000/usuarioLog',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Persona: 'alumno',
      },
    });
    setEmail(userData.message.correo_electronico)
    console.log(typeof (userData.message.correo_electronico))
    console.log("email", email)
  };
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
        value={"qrValue"}
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
