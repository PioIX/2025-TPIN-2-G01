import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Checkbox } from 'react-native-paper';
import useFetch from 'hooks/useFetch';
import { Asistencia } from 'types';

export interface Alumno {
  id: number;
  nombreCompleto: string;
}

export interface Person extends Alumno {
  nombre: string;
  apellido: string;
  presente: boolean;
  ausente: boolean;
}

interface AttendanceTableProps {
  alumnos: Alumno[];
  selectedCurso?: string | number;
  onSubmit?: (attendance: Person[]) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ alumnos, onSubmit }) => {
  const [attendance, setAttendance] = useState<Person[]>([]);
  const { fetchData: fetchAsistencia } = useFetch<Asistencia>();

  async function postAsistencia(data: Person[]) {
    const payload = data.map(({ id, nombre, apellido, presente, ausente }) => ({
      id,
      nombre,
      apellido,
      presente,
      ausente,
    }));

    await fetchAsistencia({
      url: 'http://localhost:4000/lista',
      method: 'POST',
      body: payload,
    });
  }

  useEffect(() => {
    setAttendance(
      alumnos.map((alumno) => {
        const partes = alumno.nombreCompleto.trim().split(' ');
        const apellido = partes.pop() || '';
        const nombre = partes.join(' ');
        return {
          id: alumno.id,
          nombreCompleto: alumno.nombreCompleto,
          nombre,
          apellido,
          presente: false,
          ausente: false,
        };
      })
    );
  }, [alumnos]);

  const handleCheckboxChange = (personId: number, status: 'presente' | 'ausente') => {
    setAttendance((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              presente: status === 'presente' ? !person.presente : false,
              ausente: status === 'ausente' ? !person.ausente : false,
            }
          : person
      )
    );
  };

  const sendAttendance = () => {
    const incompletos = attendance.filter((p) => !p.presente && !p.ausente);

    if (incompletos.length > 0) {
      alert('Faltan selecciones. Por favor, marca Presente o Ausente para cada alumno.');
      return;
    }

    postAsistencia(attendance);
    alert('Asistencia enviada con éxito.');
    if (onSubmit) onSubmit(attendance);
  };

  return (
    <View className="bg-white rounded-3xl p-4 shadow-lg">
      {/* Header */}
      <Text className="text-xl font-bold text-aparcs-text-dark text-center mb-4">
        Toma de Asistencia
      </Text>

      {/* Table Header */}
      <View className="flex-row mb-3 pb-2 border-b border-gray-200">
        <Text className="flex-1 font-bold text-gray-700">Alumno</Text>
        <Text className="w-20 text-center font-bold text-aparcs-presente">P</Text>
        <Text className="w-20 text-center font-bold text-aparcs-ausente">A</Text>
      </View>

      {/* Table Rows */}
      <ScrollView className="max-h-96">
        {attendance.map((person) => (
          <View 
            key={person.id} 
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <Text className="flex-1 text-gray-800">{person.nombreCompleto}</Text>

            <View className="w-20 items-center">
              <Pressable
                onPress={() => handleCheckboxChange(person.id, 'presente')}
                className={`w-10 h-10 rounded-lg items-center justify-center ${
                  person.presente ? 'bg-aparcs-presente' : 'bg-gray-200'
                }`}
              >
                {person.presente && (
                  <Text className="text-white font-bold">✓</Text>
                )}
              </Pressable>
            </View>

            <View className="w-20 items-center">
              <Pressable
                onPress={() => handleCheckboxChange(person.id, 'ausente')}
                className={`w-10 h-10 rounded-lg items-center justify-center ${
                  person.ausente ? 'bg-aparcs-ausente' : 'bg-gray-200'
                }`}
              >
                {person.ausente && (
                  <Text className="text-white font-bold">✓</Text>
                )}
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <Pressable
        className="bg-aparcs-primary py-4 rounded-xl mt-4 shadow-lg"
        onPress={sendAttendance}
        style={({ pressed }) => [
          { backgroundColor: pressed ? '#0077B6' : '#1E90FF' }
        ]}
      >
        <Text className="text-white text-center font-bold text-lg">
          Enviar Asistencia
        </Text>
      </Pressable>
    </View>
  );
};

export default AttendanceTable;
