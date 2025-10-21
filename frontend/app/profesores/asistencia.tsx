import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { RolMessage, CursosProfe, AlumnosResponse } from 'types';
import { useAuth } from 'app/context/AuthContext';
import useFetch from 'hooks/useFetch';
import { SelectCursos } from 'components/selectCursos';
import AttendanceTable, { Alumno as AlumnoTabla } from 'components/Tabla';

export default function ProfesoresAsistencia() {
  const { token } = useAuth();

  const [idProfesor, setIdProfesor] = useState<number>(0);
  const [cursos, setCursos] = useState<CursosProfe>([]);
  const [selectedCurso, setSelectedCurso] = useState<string | number | null>(null);
  const [alumnos, setAlumnos] = useState<AlumnoTabla[]>([]);
  const [loadingCursos, setLoadingCursos] = useState<boolean>(true);

  const { fetchData: fetchProfesor } = useFetch<RolMessage>();
  const { fetchData: fetchCursos } = useFetch<CursosProfe>();
  const { fetchData: fetchAlumnos } = useFetch<AlumnosResponse>();

  // Obtener id del profesor
  useEffect(() => {
    if (!token) return;

    const getProfesor = async () => {
      try {
        const profesor = await fetchProfesor({
          url: 'http://localhost:4000/usuarioLog',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Persona: 'profesor',
          },
        });

        if (profesor?.message?.id_profesor) {
          setIdProfesor(profesor.message.id_profesor);
        }
      } catch (error) {
        console.error('Error al obtener profesor:', error);
      }
    };

    getProfesor();
  }, [token]);

  // Obtener cursos del profesor
  useEffect(() => {
    if (!token || idProfesor === 0) return;

    const getCursos = async () => {
      try {
        setLoadingCursos(true);
        const cursosData = await fetchCursos({
          url: `http://localhost:4000/cursos?id_profesor=${idProfesor}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cursosData && 'message' in cursosData && Array.isArray(cursosData.message)) {
          setCursos(cursosData.message);
        } else if (Array.isArray(cursosData)) {
          setCursos(cursosData);
        } else {
          setCursos([]);
        }
      } catch (error) {
        console.error('Error al obtener cursos:', error);
        setCursos([]);
      } finally {
        setLoadingCursos(false);
      }
    };

    getCursos();
  }, [token, idProfesor]);

  const buscarAlumnos = async () => {
    if (!selectedCurso) return;

    try {
      const alumnosData = await fetchAlumnos({
        url: `http://localhost:4000/alumnos?id_curso=${selectedCurso}`,
        method: 'GET',
      });
      console.log(alumnosData);
      if (alumnosData && 'message' in alumnosData && Array.isArray(alumnosData.message)) {
        const alumnosMapped: AlumnoTabla[] = alumnosData.message.map((a: any, index: number) => ({
          id: index + 1,
          nombre: `${a.Nombre ?? ''} ${a.apellido ?? ''}`.trim(),
          presente: false,
          ausente: false,
          tarde: false,
        }));
        setAlumnos(alumnosMapped);
      } else {
        setAlumnos([]);
      }
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      setAlumnos([]);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-6">
      {loadingCursos ? (
        <Text>Cargando cursos...</Text>
      ) : cursos.length > 0 && alumnos.length === 0 ? (
        <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <Text className="mb-6 text-center text-2xl font-bold text-blue-700">
            Página de asistencia
          </Text>

          <View className="mb-6">
            <Text className="mb-2 text-base text-gray-700">Seleccioná un curso</Text>
            <SelectCursos
              props={cursos}
              value={selectedCurso}
              onValueChange={(val) => setSelectedCurso(val)}
            />
          </View>

          <Pressable
            className="rounded-xl bg-blue-600 py-3 shadow-md active:bg-blue-700"
            onPress={buscarAlumnos}>
            <Text className="text-center text-base font-semibold text-white">Buscar Curso</Text>
          </Pressable>
        </View>
      ) : alumnos.length > 0 ? (
        <ScrollView className="mt-6 w-full">
          <AttendanceTable alumnos={alumnos} />
        </ScrollView>
      ) : (
        <Text>No hay cursos disponibles.</Text>
      )}
    </View>
  );
}
