import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Preceptor, CursosProfe, faltasCurso, FaltasAlumnos } from 'types';
import { useAuth } from 'app/context/AuthContext';
import useFetch from 'hooks/useFetch';
import { SelectCursos } from 'components/selectCursos';
import AttendanceTable, { Alumno as AlumnoTabla } from 'components/Tabla';
import FaltasTable from 'components/tablaCheckAsistencia';


type AlumnoPartial = FaltasAlumnos & AlumnoTabla

export default function App() {
  const { token } = useAuth();
  const [checked, setChecked] = useState<boolean>(false);
  const [idPreceptor, setIdPreceptor] = useState<number>(0);
  const [cursos, setCursos] = useState<CursosProfe>([]);
  const [selectedCurso, setSelectedCurso] = useState<string | number | null>(null);
  const [alumnos, setAlumnos] = useState<AlumnoPartial[]>([]);
  const [loadingCursos, setLoadingCursos] = useState<boolean>(true);

  const { fetchData: fetchPreceptor } = useFetch<Preceptor>();
  const { fetchData: fetchCursos } = useFetch<CursosProfe>();
  const { fetchData: fetchAlumnos } = useFetch<faltasCurso>();

  useEffect(() => {
    if (!token) return;

    const getPreceptor = async () => {
      try {
        const preceptor = await fetchPreceptor({
          url: 'http://localhost:4000/usuarioLog',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Persona: 'preceptor',
          },
        });

        if (preceptor?.message?.id_administradores) {
          setIdPreceptor(preceptor.message.id_administradores);
        }
      } catch (error) {
        console.error('Error al obtener profesor:', error);
      }
    };

    getPreceptor();
  }, [token]);

  useEffect(() => {
    if (!token || idPreceptor === 0) return;
    const getCursos = async () => {
      try {
        setLoadingCursos(true);
        const cursosData = await fetchCursos({
          url: `http://localhost:4000/preceptoresCursos?id_administrador=${idPreceptor}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(cursosData);

        if (Array.isArray(cursosData) && cursosData.length !== 0) {
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
  }, [token, idPreceptor]);

  const buscarAlumnos = async () => {
    if (!selectedCurso) return;

    try {
      const alumnosData = await fetchAlumnos({
        url: `http://localhost:4000/faltasAlumnos?id_curso=${selectedCurso}`,
        method: 'GET',
      });
      console.log("alumnosData", alumnosData)
      if (alumnosData && 'message' in alumnosData && Array.isArray(alumnosData.message)) {
        const alumnosMapped: AlumnoPartial[] = alumnosData.message.map((a: any) => {
          const nombreCompleto = `${a.nombre ?? ''} ${a.apellido ?? ''}`.trim();

          const apellido = a.apellido;
          const nombre = a.nombre;
          
          return {
            id: a.id_alumno,
            nombreCompleto,
            nombre,
            apellido,
            falta: a.falta ?? 0,
            esta_justificada: a.esta_justificada ?? false,
          };
        });

        console.log(alumnosMapped, "soy un console.log de alumnos mapped");
        setAlumnos(alumnosMapped);
        setChecked(true);
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
      ) : alumnos.length > 0 && checked ? (
        <ScrollView className="mt-6 w-full">
          <FaltasTable data={{message: alumnos}} />
          <Pressable
            className="rounded-xl bg-blue-600 py-3 shadow-md active:bg-blue-700"
            onPress={() => {
              setChecked(!checked);
              setAlumnos([]);
            }}>
            <Text className="text-center text-base font-semibold text-white">Cancelar</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <Text>No hay cursos disponibles.</Text>
      )}
    </View>
  );
}
