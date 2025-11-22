import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from "hooks/useSocket";
import { Pressable, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import Qr from 'components/QrGenerator';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import type { CursoNuevo } from 'types'
import { respuestaAlumno } from 'types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AlumnosHome() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [email, setEmail] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);

  const [qrValue, setQrValue] = useState<string>("")
  const [horarioEntrada, setHorarioEntrada] = useState<string>("")
  const [cursoNuevo, setCursoNuevo] = useState<CursoNuevo>({
    año: 0,
    carrera: "",
    division: "",
  });

  const { socket, isConnected } = useSocket();
  const { fetchData: fetchAlumno } = useFetch<respuestaAlumno>()

  // Timer para el QR
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (qrGenerated && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setQrGenerated(false);
      setTimeLeft(60);
    }
    return () => clearInterval(timer);
  }, [qrGenerated, timeLeft]);

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
      console.log(generico.message)
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

  async function fetchCursoAlumno(correo: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:4000/getCursoAlumno?correo_electronico=${correo}`
      );
      const data = await response.json();

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

      if (data.horario_entrada) {
        setHorarioEntrada(data.horario_entrada);
      } else {
        setHorarioEntrada("No encontrado");
      }
    } catch (error) {
      console.error("Error al traer horario:", error);
      setHorarioEntrada("Error");
    }
  }

  useEffect(() => {
    if (email) {
      fetchCursoAlumno(email);
    }
  }, [email]);

  async function generarQr(): Promise<void> {
    await fetchUser()
    setQrGenerated(true);
    setTimeLeft(60);
  }

  useEffect(() => {
    fetchHorarioEntrada(cursoNuevo);
  }, [cursoNuevo])

  return (
    <SafeAreaProvider className="flex-1 bg-aparcs-bg">
      <View className="flex-1 items-center justify-center bg-aparcs-bg px-6">
        
        {/* Timer */}
        {qrGenerated && (
          <Text className="text-aparcs-text-dark font-bold text-lg mb-2">
            {timeLeft} segundos restantes
          </Text>
        )}

        {/* QR Code Container */}
        <View className="bg-white p-4 rounded-2xl shadow-lg mb-6">
          {email && qrGenerated ? (
            <Qr
              value={email}
              size={220}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          ) : (
            <View className="w-[220px] h-[220px] bg-gray-100 rounded-xl items-center justify-center">
              <Text className="text-gray-400 text-center">
                Presiona "Generar QR" para mostrar tu código
              </Text>
            </View>
          )}
        </View>

        {/* Botón Generar QR */}
        <Pressable
          className="w-full max-w-xs bg-aparcs-primary py-4 rounded-xl shadow-lg mb-6"
          onPress={generarQr}
          style={({ pressed }) => [
            { backgroundColor: pressed ? '#0077B6' : '#1E90FF' }
          ]}
        >
          <Text className="text-white text-center font-bold text-lg">
            Generar QR
          </Text>
        </Pressable>

        {/* Info Cards */}
        <View className="w-full max-w-xs space-y-3">
          {/* Curso */}
          <View className="bg-white p-4 rounded-full border-2 border-gray-200">
            <Text className="text-gray-700 text-center">
              Curso: {cursoNuevo.año > 0 
                ? `${cursoNuevo.año}° ${cursoNuevo.division} ${cursoNuevo.carrera}` 
                : "Cargando..."}
            </Text>
          </View>

          {/* Horario de entrada */}
          <View className="bg-white p-4 rounded-full border-2 border-gray-200">
            <Text className="text-gray-700 text-center">
              Horario de entrada: {horarioEntrada || "Cargando..."}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
