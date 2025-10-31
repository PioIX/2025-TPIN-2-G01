import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from "hooks/useSocket";
import { Pressable, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import Qr from 'components/QrGenerator';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function AlumnosHome() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const [qrValue, setQrValue] = useState<string>("")
  const { socket, isConnected } = useSocket();
  /**
   * trae la info del usuario logeado
   * @returns {message:{datosEstudiantes}}
   */

    useEffect(()=>{
      metermeSala()
    },[])
    function metermeSala(){
      socket?.emit("unirme", { value: email });  
    }
  
    useEffect(() => {
    if (!socket) return;
      socket.on("mensajitoSala", (generico)=>{
        // Alert.alert(generico.message)
        Alert.alert(generico.message)
      })
      
    }, [socket]);

  async function fetchUser(): Promise<void> {
    const userData = await fetchData({
      url: 'http://huge-streets-brake.loca.lt/usuarioLog',
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
    <SafeAreaProvider className=''>

     <View className="flex-1 items-center justify-center bg-white">
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
        
      </Pressable>
      {email && <Qr
        value={email}
        size={256}
        color="#0f0f0f"
        backgroundColor="#f0f0f0"
        >
      </Qr>
      }

      <Button label="generar qr" onPress={() => { generarQr() }}></Button>
      </View>
    </SafeAreaProvider>
  );
}



// const { token, rango, logout } = useAuth();
