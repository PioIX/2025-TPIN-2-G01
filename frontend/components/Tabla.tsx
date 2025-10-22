import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { Checkbox } from 'react-native-paper';
import useFetch from 'hooks/useFetch';
import { Asistencia } from 'types';

export interface Alumno {
  id: number;
  nombre: string;
}

export interface Person extends Alumno {
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
    await fetchAsistencia({
      url: 'http://localhost:4000/lista',
      method: 'POST',
      body: data,
    });
  }

  useEffect(() => {
    setAttendance(
      alumnos.map((alumno) => ({
        ...alumno,
        presente: false,
        ausente: false,
      }))
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
      console.log('faltan selecciones');
      alert(
        'Faltan selecciones. Por favor, marca al menos una opción (Presente o Ausente) por alumno antes de enviar.'
      );
      return;
    }

    postAsistencia(attendance);
    console.log('Asistencia enviada:', attendance);
    alert('Éxito. Asistencia enviada con éxito.');

    if (onSubmit) onSubmit(attendance);
  };

  return (
    <ScrollView className="p-5">
      <Text className="text-2xl font-bold mb-5">Toma de Asistencia</Text>

      <View className="flex-row mb-3">
        <Text className="w-32 font-bold">Alumno</Text>
        <Text className="w-24 text-center font-bold">Presente</Text>
        <Text className="w-24 text-center font-bold">Ausente</Text>
      </View>

      {attendance.map((person) => (
        <View key={person.id} className="flex-row items-center mb-3">
          <Text className="w-32">{person.nombre}</Text>

          <View className="w-24 items-center">
            <Checkbox
              status={person.presente ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange(person.id, 'presente')}
            />
          </View>

          <View className="w-24 items-center">
            <Checkbox
              status={person.ausente ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange(person.id, 'ausente')}
            />
          </View>
        </View>
      ))}

      <Button title="Enviar Asistencia" onPress={sendAttendance} />
    </ScrollView>
  );
};

export default AttendanceTable;
