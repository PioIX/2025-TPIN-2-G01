import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { RolMessage, CursosProfe, AlumnosResponse } from 'types';
import { useAuth } from 'app/context/AuthContext';
import useFetch from 'hooks/useFetch';
import { SelectCursos } from 'components/selectCursos';
import AttendanceTable, { Alumno as AlumnoTabla } from 'components/Tabla';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ProfesoresAsistencia() {
  const { token } = useAuth();
  const [checked, setChecked] = useState<boolean>(false)
  const [idProfesor, setIdProfesor] = useState<number>(0);
  const [cursos, setCursos] = useState<CursosProfe>([]);
  const [selectedCurso, setSelectedCurso] = useState<string | number | null>(null);
  const [alumnos, setAlumnos] = useState<AlumnoTabla[]>([]);
  const [loadingCursos, setLoadingCursos] = useState<boolean>(true);

  const { fetchData: fetchProfesor } = useFetch<RolMessage>();
  const { fetchData: fetchCursos } = useFetch<CursosProfe>();
  const { fetchData: fetchAlumnos } = useFetch<AlumnosResponse>();

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

        if (Array.isArray(cursosData)) {
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

      if (alumnosData && 'message' in alumnosData && Array.isArray(alumnosData.message)) {
        const alumnosMapped: AlumnoTabla[] = alumnosData.message.map((a: any, index: number) => {
          const nombreCompleto = `${a.Nombre ?? ''} ${a.apellido ?? ''}`.trim();
          const partes = nombreCompleto.split(' ');
          const apellido = partes.pop() || '';
          const nombre = partes.join(' ');
          return {
            id: index + 1,
            nombreCompleto,
            nombre,
            apellido,
            presente: false,
            ausente: false,
          };
        });
        setAlumnos(alumnosMapped);
        setChecked(true)
      } else {
        setAlumnos([]);
      }
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      setAlumnos([]);
    }
  };

  return (
    <SafeAreaProvider className="flex-1 bg-aparcs-bg">
      <View className="flex-1 bg-aparcs-bg px-6 py-6">
        {loadingCursos ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-aparcs-text-dark text-lg">Cargando cursos...</Text>
          </View>
        ) : cursos.length > 0 && alumnos.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-lg">
              <Text className="text-2xl font-bold italic text-aparcs-text-dark text-center mb-6">
                Página de asistencia
              </Text>

              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Seleccioná un curso</Text>
                <SelectCursos
                  props={cursos}
                  value={selectedCurso}
                  onValueChange={(val) => setSelectedCurso(val)}
                />
              </View>

              <Pressable
                className="w-full bg-aparcs-primary py-4 rounded-xl shadow-lg"
                onPress={buscarAlumnos}
                style={({ pressed }) => [
                  { backgroundColor: pressed ? '#0077B6' : '#1E90FF' }
                ]}
              >
                <Text className="text-white text-center font-bold text-lg">Buscar Curso</Text>
              </Pressable>
            </View>
          </View>
        ) : alumnos.length > 0 && checked ? (
          <ScrollView className="flex-1">
            <AttendanceTable alumnos={alumnos} />
            <Pressable
              className="w-full bg-aparcs-ausente py-4 rounded-xl mt-4"
              onPress={() => {
                setChecked(false)
                setAlumnos([])
              }}
            >
              <Text className="text-white text-center font-bold">Cancelar</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No hay cursos disponibles.</Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}
