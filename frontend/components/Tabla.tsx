import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { Checkbox } from 'react-native-paper';

export interface Alumno {
  id: number;
  nombre: string;
}

export interface Person extends Alumno {
  presente: boolean;
  ausente: boolean;
  tarde: boolean;
}

interface AttendanceTableProps {
  alumnos: Alumno[];
  selectedCurso?: string | number;
  onSubmit?: (attendance: Person[]) => void;
}


const AttendanceTable: React.FC<AttendanceTableProps> = ({ alumnos, onSubmit }) => {
  const [attendance, setAttendance] = useState<Person[]>([]);

  useEffect(() => {
    setAttendance(
      alumnos.map((alumno) => ({
        ...alumno,
        presente: false,
        ausente: false,
        tarde: false,
      }))
    );
  }, [alumnos]);

  const handleCheckboxChange = (personId: number, status: 'presente' | 'ausente' | 'tarde') => {
    setAttendance((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              presente: status === 'presente' ? !person.presente : false,
              ausente: status === 'ausente' ? !person.ausente : false,
              tarde: status === 'tarde' ? !person.tarde : false,
            }
          : person
      )
    );
  };

  const sendAttendance = () => {
    console.log('Asistencia enviada:', attendance);
    alert('Asistencia enviada con éxito');
    if (onSubmit) onSubmit(attendance);
  };

  return (
    <ScrollView className="p-5">
      <Text className="text-2xl font-bold mb-5">Toma de Asistencia</Text>
      <View className="flex-row mb-3">
        <Text className="w-32 font-bold">Alumno</Text>
        <Text className="w-24 text-center font-bold">Presente</Text>
        <Text className="w-24 text-center font-bold">Ausente</Text>
        <Text className="w-24 text-center font-bold">Tarde</Text>
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
          <View className="w-24 items-center">
            <Checkbox
              status={person.tarde ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange(person.id, 'tarde')}
            />
          </View>
        </View>
      ))}
      <Button title="Enviar Asistencia" onPress={sendAttendance} />
    </ScrollView>
  );
};

export default AttendanceTable;
