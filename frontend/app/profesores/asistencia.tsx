import { Pressable, Text, View } from 'react-native';
import { RolMessage, CursosProfe, AlumnosResponse } from 'types';
import { useAuth } from 'app/context/AuthContext';
import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import { SelectCursos } from 'components/selectCursos';

export default function ProfesoresAsistencia() {
  const { data, error, loading, fetchData } = useFetch<RolMessage | CursosProfe>();
  const { token, logout } = useAuth();
  const [idProfesor, setIdProfesor] = useState<number>(0);
  const [cursos, setCursos] = useState<CursosProfe>([]);
  const [selectedCurso, setSelectedCurso] = useState<string | number | null>(null); 

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      const userData = await fetchData({
        url: 'http://localhost:4000/usuarioLog',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Persona: 'profesor',
        },
      });

      if (userData && typeof userData === 'object' && 'message' in userData) {
        setIdProfesor(userData.message.id_profesor);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!token || idProfesor === 0) return;
    const fetchCursos = async () => {
      const cursosData = await fetchData({
        url: `http://localhost:4000/cursos?id_profesor=${idProfesor}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(cursosData)) setCursos(cursosData);
    };

    fetchCursos();
  }, [token, idProfesor]);

  async function buscarAlumnos() {
    if (selectedCurso) {
      const alumnosXcurso = await fetchData({
        url: `http://localhost:4000/alumnos?id_curso=${selectedCurso}`,
        method: 'GET',
      });
      console.log(alumnosXcurso);
    }
  }

  return (
    <>
      <View className="flex-1 items-center justify-center bg-gray-100 px-6">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <Text className="mb-6 text-center text-2xl font-bold text-blue-700">
            Página de asistencia
          </Text>

          {cursos.length !== 0 && (
            <View className="mb-6">
              <Text className="mb-2 text-base text-gray-700">Seleccioná un curso</Text>
              <SelectCursos
                props={cursos}
                value={selectedCurso} 
                onValueChange={(val) => setSelectedCurso(val)} 
              />
            </View>
          )}

          <Pressable
            className="rounded-xl bg-blue-600 py-3 shadow-md active:bg-blue-700"
            onPress={buscarAlumnos} 
          >
            <Text className="text-center text-base font-semibold text-white">Buscar Curso</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
