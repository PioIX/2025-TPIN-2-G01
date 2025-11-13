import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

import { Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import AttendanceTable from 'components/Tabla';
import InAttendanceTable from 'components/TablaInasistencia';
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
    console.log(token);
    console.log("userData ", userData)
    setEmail(userData.message.correo_electronico)
    console.log(typeof (userData.message.correo_electronico))
    console.log("email", email)
  };
    const handleLogout = async () => {
    await logout();
    router.replace('/');
  };


  // useEffect(() => {
  //   fetchUser();
  // }, [])

  useEffect(() => {
    fetchAsistencias(email);
  }, [email]);


  // useEffect(() => {
    // console.log("array de faltas", arrayFaltas)
    // console.log("array de faltas", falta)
    // console.log("array de fecha", fecha)
  // }, [arrayFaltas]);


  async function fetchAsistencias(correo: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:4000/traerAsistencias?correo_electronico=${correo}&falta>=0`
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
    <View>
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
      </Pressable>
      <Pressable onPress={fetchUser}>
        <Text>Mostrar Tabla de Inasistencias</Text>
      </Pressable>
    
      <InAttendanceTable fechas={fecha} faltas={falta}></InAttendanceTable>
      
      <Text>Faltas Totales: {faltasTotales}</Text>
      <Text>Faltas No Justificadas: {faltasNoJustificadas}</Text>
      <Text>Faltas Justificadas: {faltasJustificadas}</Text>
    
    </View>
  );
}