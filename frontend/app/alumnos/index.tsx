import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from "hooks/useSocket";
import { Pressable, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import Qr from 'components/QrGenerator';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import type {CursoNuevo} from 'types'
import { respuestaAlumno } from 'types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function AlumnosHome() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")

  const [qrValue, setQrValue] = useState<string>("")
  const [horarioEntrada, setHorarioEntrada] = useState<string>("")
  const [cursoNuevo, setCursoNuevo] = useState<CursoNuevo>({
    año: 0,
    carrera: "",
    division: "",
  });
  /**
   * trae la info del usuario logeado
   * @returns {message:{datosEstudiantes}}
   */

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
        console.log(generico.message)
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



  async function fetchCursoAlumno(correo: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:4000/getCursoAlumno?correo_electronico=${correo}`
      );
      const data = await response.json();

      console.log("Data::: ", data.message[0]);

      if (data.message && data.message.length > 0) {
        const c = data.message[0];
        setCursoNuevo({
          año: c.año,
          division: c.division,
          carrera: c.carrera
        })
      } 
    } catch (error) {
      console.error("Error al traer curso:", error);
    }
  }

  async function fetchHorarioEntrada(cursoNuevo: CursoNuevo): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:4000/getHorarioEntrada?carrera=${cursoNuevo.carrera}&año=${cursoNuevo.año}&division=${cursoNuevo.division}`
      );
      const data = await response.json();
      console.log("Respuesta completa del backend:", data);

      if (data.horario_entrada) {
        setHorarioEntrada(data.horario_entrada);
        console.log("Horario de entrada:", data.horario_entrada);
      } else {
        setHorarioEntrada("No se encontró horario");
        console.log("No se encontró horario para el curso");
      }
    } catch (error) {
      console.error("Error al traer horario:", error);
      setHorarioEntrada("Error al cargar horario");
    }
  }

  useEffect(() => {
    if (email) {
      fetchCursoAlumno(email);

    }
  }, [email]);



  async function generarQr(): Promise<void> {
    await fetchUser()
  }

  useEffect(()=>{
    fetchHorarioEntrada(cursoNuevo);
  },[cursoNuevo])



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
      <Text className="w-full p-3 rounded-xl border border-gray-400 bg-gray-50 text-black mb-6">Curso: {`${cursoNuevo.año}° ${cursoNuevo.division} ${cursoNuevo.carrera}` || "Cargando..."}</Text>
      <Text className="w-full p-3 rounded-xl border border-gray-400 bg-gray-50 text-black mb-6">Horario de entrada: {horarioEntrada || "Cargando..."} </Text>

     </View>
    </SafeAreaProvider>
  );
}



