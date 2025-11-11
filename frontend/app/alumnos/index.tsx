import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from "hooks/useSocket";
import { Pressable, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import Qr from 'components/QrGenerator';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import { respuestaAlumno } from 'types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function AlumnosHome() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const { socket, isConnected } = useSocket();
  const {fetchData: fetchAlumno} = useFetch<respuestaAlumno>()
  
    function metermeSala(){
      console.log(email)
      socket?.emit("unirme", { value: email });  
    }

    useEffect(()=>{
      if (email != "") {
        metermeSala()
      }
    }, [email])
  
    useEffect(() => {
    if (!socket) return;
      socket.on("mensajitoSala", (generico)=>{
        Alert.alert(generico.message)
      })
      socket.on("NotificacionAlumno", (generico)=>{
        Alert.alert(generico.message)
      })
      
    }, [socket]);

  async function fetchUser(): Promise<void> {
    const userData = await fetchAlumno({
      url: 'https://lithographically-soppiest-lonnie.ngrok-free.dev/usuarioLog',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Persona: 'alumno',
      },
    });
    console.log(userData?.message)
    if (userData?.message?.correo_electronico) {
      setEmail(userData.message.correo_electronico)
      console.log(typeof (userData.message.correo_electronico))
      console.log("email", email)
    }
  };
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };


  async function generarQr(): Promise<void> {
    await fetchUser()
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



