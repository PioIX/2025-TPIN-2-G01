import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CursosProfe, faltasCurso, FaltasAlumnos, RespuestaPreceptor } from 'types';
import { useAuth } from 'app/context/AuthContext';
import useFetch from 'hooks/useFetch';
import { SelectCursos } from 'components/selectCursos';
import FaltasTable from 'components/tablaCheckAsistencia';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function VerificarAsistencia() {
  const { token } = useAuth();
  const [checked, setChecked] = useState<boolean>(false);
  const [idPreceptor, setIdPreceptor] = useState<number>(0);
  const [cursos, setCursos] = useState<CursosProfe>([]);
  const [selectedCurso, setSelectedCurso] = useState<string | number | null>(null);
  const [alumnos, setAlumnos] = useState<FaltasAlumnos[]>([]);
  const [loadingCursos, setLoadingCursos] = useState<boolean>(true);

  const { fetchData: fetchPreceptor } = useFetch<RespuestaPreceptor>();
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
        console.error('Error al obtener preceptor:', error);
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

      if (alumnosData && 'message' in alumnosData && Array.isArray(alumnosData.message)) {
        setAlumnos(alumnosData.message);
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
                Verificar Asistencia
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
                <Text className="text-white text-center font-bold text-lg">
                  Buscar Curso
                </Text>
              </Pressable>
            </View>
          </View>
        ) : alumnos.length > 0 && checked ? (
          <ScrollView className="flex-1">
            <FaltasTable data={{ message: alumnos }} />
            <Pressable
              className="w-full bg-aparcs-ausente py-4 rounded-xl mt-4"
              onPress={() => {
                setChecked(false);
                setAlumnos([]);
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
