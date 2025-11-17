import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from "hooks/useSocket";
import { Pressable, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { respuestaAlumno } from 'types';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import InAttendanceTable from 'components/TablaInasistencia';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function AlumnosAsistencia() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const [fecha, setFecha] = useState<Array<string|null>>([])
  const [falta, setFalta] = useState<Array<number>>([])
  const [arrayFaltas, setArrayFaltas] = useState<Array<string | number>>([])
  const [faltasJustificadas, setFaltasJustificadas] = useState<number>(0)
  const [faltasNoJustificadas, setFaltasNoJustificadas] = useState<number>(0)
  const [faltasTotales, setFaltasTotales] = useState<number>(0)
  const [estaFecheado, setEstaFecheado] = useState<Boolean>(false)
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
        url: 'http://localhost:4000/usuarioLog',
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
      setEstaFecheado(true)
    };
    const handleLogout = async () => {
      await logout();
      router.replace('/');
    };
  // useEffect(() => {
    // console.log("array de faltas", arrayFaltas)
    // console.log("array de faltas", falta)
    // console.log("array de fecha", fecha)
  // }, [arrayFaltas]);
  useEffect(() => {
    fetchAsistencias(email);
  }, [email]);
  async function fetchAsistencias(correo: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:4000/traerAsistencias?correo_electronico=${correo}&falta>0`
      );
      const data = await response.json();
      console.log("Data crudo ", data)
      let faltaJus = 0
      let faltaNoJus = 0
      for (let i = 0; i < data.message.length; i++) {
        const fechaSoloDia = new Date(data.message[i].horario_de_entrada)
          .toISOString()
          .split('T')[0]; // → "2025-10-22"
        const faltaActual = data.message[i].falta;
        setFecha(prev => [...prev, fechaSoloDia])
        setFalta(prev => [...prev, faltaActual])
        
        setArrayFaltas(prev => [...prev, fechaSoloDia, faltaActual]);
        if (data.message[i].esta_justificada === 0) {
          faltaNoJus=faltaNoJus+faltaActual
        } else {
          faltaJus=faltaJus+faltaActual
        }
      }
      setFaltasJustificadas(faltaJus)
      setFaltasNoJustificadas(faltaNoJus)
      setFaltasTotales(faltaJus+faltaNoJus)
    } catch (error) {
      console.error("Error al traer las asistencias:", error);
    }
  }
  return (
    <SafeAreaProvider className="flex-1 bg-white">
      <View className="flex-1 items-center justify-start bg-white px-4 sm:px-6 md:px-8 py-6 pt-10 sm:pt-12 md:pt-16">
        {!estaFecheado &&
          <Pressable onPress={fetchUser} className="self-center bg-blue-600 px-4 py-2 rounded-md mb-4">
          <Text className="text-white text-sm sm:text-base md:text-base">Mostrar Tabla de Inasistencias</Text>
        </Pressable>
        } 
        <View className="w-full max-w-3xl mx-auto bg-white rounded-lg overflow-hidden">
          <InAttendanceTable fechas={fecha} faltas={falta}></InAttendanceTable>
        </View>
        
        { estaFecheado &&
        <View className="w-full max-w-3xl mx-auto mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
          <Text className="text-base sm:text-lg md:text-lg text-gray-800">Faltas Totales: {faltasTotales}</Text>
          <Text className="text-base sm:text-lg md:text-lg text-gray-800">Faltas No Justificadas: {faltasNoJustificadas}</Text>
          <Text className="text-base sm:text-lg md:text-lg text-gray-800">Faltas Justificadas: {faltasJustificadas}</Text>
        </View>
        }
      </View>
    </SafeAreaProvider>
  );
}
