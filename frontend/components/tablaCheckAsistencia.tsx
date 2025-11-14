import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { Checkbox } from 'react-native-paper';
import useFetch from 'hooks/useFetch';
import type { faltasCurso, FaltasAlumnos } from 'types';

export type FaltaValue = 0 | 0.25 | 0.5 | 1;

interface FaltasTableProps {
  data: faltasCurso;               
  onSubmit?: (faltas: FaltasAlumnos[]) => void;
}

const FaltasTable: React.FC<FaltasTableProps> = ({ data, onSubmit }) => {
  const [faltas, setFaltas] = useState<FaltasAlumnos[]>([]);
  const { fetchData: postFaltasRequest } = useFetch();

  useEffect(() => {
    if (data?.message) {
      setFaltas(data.message);
    }
  }, [data]);

  const handleFaltaChange = (index: number, value: FaltaValue) => {
    setFaltas((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, falta: p.falta === value ? 0 : value }
          : p
      )
    );
  };

  const enviar = async () => {
    await postFaltasRequest({
      url: 'http://localhost:4000/faltasAlumnos',
      method: 'POST',
      body: faltas,
    });

    console.log("Faltas enviadas:", faltas);
    alert("Éxito. Faltas enviadas.");

    if (onSubmit) onSubmit(faltas);
  };

  return (
    <ScrollView className="p-5">
      <Text className="text-2xl font-bold mb-5">Registro de Faltas</Text>

      <View className="flex-row mb-3">
        <Text className="w-32 font-bold">Alumno</Text>
        <Text className="w-20 text-center font-bold">0.25</Text>
        <Text className="w-20 text-center font-bold">0.50</Text>
        <Text className="w-20 text-center font-bold">1.00</Text>
        <Text className="w-24 text-center font-bold">Justificada</Text>
      </View>

      {faltas.map((alumno, index) => (
        <View key={index} className="flex-row items-center mb-3">
          <Text className="w-32">
            {alumno.nombre} {alumno.apellido}
          </Text>

          {/* Falta 0.25 */}
          <View className="w-20 items-center">
            <Checkbox
              status={alumno.falta === 0.25 ? 'checked' : 'unchecked'}
              onPress={() => handleFaltaChange(index, 0.25)}
              disabled
            />
          </View>

          <View className="w-20 items-center">
            <Checkbox
              status={alumno.falta === 0.5 ? 'checked' : 'unchecked'}
              onPress={() => handleFaltaChange(index, 0.5)}
              disabled
            />
          </View>

          {/* Falta 1 */}
          <View className="w-20 items-center">
            <Checkbox
              status={alumno.falta === 1 ? 'checked' : 'unchecked'}
              onPress={() => handleFaltaChange(index, 1)}
              disabled
            />
          </View>

          <View className="w-24 items-center">
            <Checkbox
              status={alumno.esta_justificada ? 'checked' : 'unchecked'}
              disabled
            />
          </View>
        </View>
      ))}

      {/* <Button title="Enviar Faltas" onPress={enviar} /> */}
    </ScrollView>
  );
};

export default FaltasTable;
