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
const [falta, setFalta] = useState<number>(0)
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
  },[])

  useEffect(() => {
      fetchAsistencias(email); 
  }, [] );
  

  async function fetchAsistencias(correo: string): Promise<void> {
    try{
    const response = await fetch(
        `http://localhost:4000/traerAsistencias?correo_electronico=toclur@pioix.edu.ar&falta>=0`
      );
      const data = await response.json();
      console.log("Data crudo ", data)
      console.log("Data::: ", data.message[0]);

      console.log("fecha antes del set", fecha)
      console.log("falta antes del set", falta)
      setFecha(data.fecha)
      setFalta(data.falta)
      console.log("fecha despues del set", fecha)
      console.log("falta despues del set", falta)
      
      }catch(error){
        console.error("Error al traer las asistencias:", error);
      }

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