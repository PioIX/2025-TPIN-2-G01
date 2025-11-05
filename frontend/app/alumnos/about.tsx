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
const [palabra, setPalabra] = useState<string>("")
const [email, setEmail] = useState<string>("")
const [fecha, setFecha] = useState<Date | null>(null)
const [falta, setFalta] = useState<number>(0)
const [arrayFaltas, setArrayFaltas] = useState<Array<Date|number>>([])
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
  }, [email] );
  

  async function fetchAsistencias(correo: string): Promise<void> {
    try{
    const response = await fetch(
        `http://localhost:4000/traerAsistencias?correo_electronico=toclur@pioix.edu.ar&falta>=0`
      );
      const data = await response.json();
      console.log("correo ",correo)
      console.log("Data crudo ", data)
      console.log("Data::: ", data.message[0]);

      for (let i = 0; i<data.message.length; i++) {
        setFecha(data.message[i].horario_de_entrada)
        setFalta(data.message[i].falta)
        setArrayFaltas((prevArray)=>[...prevArray, data.message[i].horario_de_entrada, data.message[i].falta])
      }
      console.log(arrayFaltas)
      }catch(error){
        console.error("Error al traer las asistencias:", error);
      }

  }

  function testeo () {
    setPalabra("palabra de testeo")
    console.log("email desde testeo", email)
    console.log("esto es el testeo")
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
      <Pressable onPress={testeo}>
        <Text>boton de testeo</Text>
      </Pressable>
    </View>
   );
}