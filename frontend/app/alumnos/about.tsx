import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

import { Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import Button from 'components/Button';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
export default function AlumnosAsistencia(){
const { data, error, loading, fetchData } = useFetch();
const router = useRouter();
const { token, logout } = useAuth();
const [email, setEmail] = useState<string>("")
const [fecha, setFecha] = useState<Date | null>(null)
const [falta, setFalta] = useState<Float>(0)
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
    setEmail(userData.message.correo_electronico)
    console.log(typeof (userData.message.correo_electronico))
    console.log("email", email)
  };

  useEffect(()=>{
    fetchUser();
    fetchAsistencias(fecha,falta);
  },[])

  useEffect(()=>{
    
  },[])

  async function fetchAsistencias(date: Date | null, nonAttendace: GLfloat): Promise<void> {
    const response = await fetch(
        `http://localhost:4000/traerAsistencias?0<=${falta}`
      );
      const data = await response.json();
      console.log("Data::: ", data.message[0]);

      setFecha(data.date)
      setFalta(data.nonAttendace)


  }

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };



   return (
    <View>
      <Pressable onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
        </Pressable>
    </View>
   );
}