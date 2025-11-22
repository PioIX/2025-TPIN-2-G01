import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from "hooks/useSocket";
import { Pressable, Text, View, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { respuestaAlumno } from 'types';
import useFetch from 'hooks/useFetch';
import InAttendanceTable from 'components/TablaInasistencia';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AlumnosAsistencia() {
  const { data, error, loading, fetchData } = useFetch();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const [fecha, setFecha] = useState<Array<string | null>>([])
  const [falta, setFalta] = useState<Array<number>>([])
  const [arrayFaltas, setArrayFaltas] = useState<Array<string | number>>([])
  const [faltasJustificadas, setFaltasJustificadas] = useState<number>(0)
  const [faltasNoJustificadas, setFaltasNoJustificadas] = useState<number>(0)
  const [faltasTotales, setFaltasTotales] = useState<number>(0)

  const { socket, isConnected } = useSocket();
  const { fetchData: fetchAlumno } = useFetch<respuestaAlumno>()

  function metermeSala() {
    socket?.emit("unirme", { value: email });
  }

  useEffect(() => {
    if (email != "") {
      metermeSala()
    }
  }, [email])

  useEffect(() => {
    if (!socket) return;
    socket.on("mensajitoSala", (generico) => {
      Alert.alert(generico.message)
    })
    socket.on("NotificacionAlumno", (generico) => {
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

    if (userData?.message?.correo_electronico) {
      setEmail(userData.message.correo_electronico)
    }
  };

  useEffect(() => {
    fetchAsistencias(email);
  }, [email]);

  async function fetchAsistencias(correo: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:4000/traerAsistencias?correo_electronico=${correo}&falta>0`
      );
      const data = await response.json();
      let faltaJus = 0
      let faltaNoJus = 0
      for (let i = 0; i < data.message.length; i++) {
        const fechaSoloDia = new Date(data.message[i].horario_de_entrada)
          .toISOString()
          .split('T')[0];
        const faltaActual = data.message[i].falta;
        setFecha(prev => [...prev, fechaSoloDia])
        setFalta(prev => [...prev, faltaActual])
        setArrayFaltas(prev => [...prev, fechaSoloDia, faltaActual]);
        if (data.message[i].esta_justificada === 0) {
          faltaNoJus = faltaNoJus + faltaActual
        } else {
          faltaJus = faltaJus + faltaActual
        }
      }
      setFaltasJustificadas(faltaJus)
      setFaltasNoJustificadas(faltaNoJus)
      setFaltasTotales(faltaJus + faltaNoJus)
    } catch (error) {
      console.error("Error al traer las asistencias:", error);
    }
  }

  // Helper para color del badge según valor de falta
  const getBadgeColor = (falta: number, justificada: boolean) => {
    if (justificada) return 'bg-aparcs-presente';
    if (falta === 1) return 'bg-aparcs-ausente';
    if (falta === 0.5) return 'bg-aparcs-tarde';
    return 'bg-aparcs-ausente';
  };

  return (
    <SafeAreaProvider className="flex-1 bg-aparcs-bg">
      <ScrollView className="flex-1 bg-aparcs-bg">
        <View className="items-center px-4 py-6">
          
          {/* Botón para cargar datos */}
          <Pressable
            onPress={fetchUser}
            className="bg-aparcs-primary px-6 py-3 rounded-xl mb-6 shadow-lg"
            style={({ pressed }) => [
              { backgroundColor: pressed ? '#0077B6' : '#1E90FF' }
            ]}
          >
            <Text className="text-white font-semibold text-base">
              Mostrar Tabla de Inasistencias
            </Text>
          </Pressable>

          {/* Tabla de Inasistencias */}
          <View className="w-full max-w-md bg-aparcs-primary rounded-2xl overflow-hidden shadow-lg mb-6">
            {/* Header de la tabla */}
            <View className="bg-aparcs-primary-dark px-4 py-3">
              <Text className="text-white font-bold text-center text-lg">
                Registro de Faltas
              </Text>
            </View>
            
            {/* Filas de la tabla */}
            {fecha.length > 0 ? (
              fecha.map((f, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200"
                >
                  <View className="bg-gray-200 px-4 py-2 rounded-lg flex-1 mr-3">
                    <Text className="text-gray-700">{f}</Text>
                  </View>
                  <View className={`px-4 py-2 rounded-lg min-w-[50px] items-center ${
                    falta[index] === 1 ? 'bg-aparcs-ausente' : 
                    falta[index] === 0.5 ? 'bg-aparcs-tarde' :
                    falta[index] === 0.25 ? 'bg-aparcs-ausente' : 'bg-aparcs-presente'
                  }`}>
                    <Text className="text-white font-bold">
                      {falta[index] === 1 ? '1' : 
                       falta[index] === 0.5 ? '1/2' : 
                       falta[index] === 0.25 ? '1/4' : '0'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="px-4 py-6 bg-gray-100">
                <Text className="text-gray-500 text-center">
                  Presiona el botón para cargar tus faltas
                </Text>
              </View>
            )}
          </View>

          {/* Resumen de Faltas */}
          <View className="w-full max-w-md">
            <View className="flex-row justify-between space-x-2">
              {/* Totales */}
              <View className="flex-1 items-center">
                <Text className="text-gray-600 text-xs mb-1">Totales</Text>
                <View className="bg-aparcs-ausente w-full py-4 rounded-xl items-center">
                  <Text className="text-white font-bold text-2xl">{faltasTotales}</Text>
                </View>
              </View>
              
              {/* No justificadas */}
              <View className="flex-1 items-center">
                <Text className="text-gray-600 text-xs mb-1">No justificadas</Text>
                <View className="bg-aparcs-tarde w-full py-4 rounded-xl items-center">
                  <Text className="text-white font-bold text-2xl">{faltasNoJustificadas}</Text>
                </View>
              </View>
              
              {/* Justificadas */}
              <View className="flex-1 items-center">
                <Text className="text-gray-600 text-xs mb-1">Justificadas</Text>
                <View className="bg-aparcs-presente w-full py-4 rounded-xl items-center">
                  <Text className="text-white font-bold text-2xl">{faltasJustificadas}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
