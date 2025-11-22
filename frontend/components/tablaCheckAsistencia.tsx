import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
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

  const getFaltaDisplay = (falta: number) => {
    if (falta === 1) return '1';
    if (falta === 0.5) return '1/2';
    if (falta === 0.25) return '1/4';
    return '0';
  };

  return (
    <View className="bg-white rounded-3xl p-4 shadow-lg">
      {/* Header */}
      <Text className="text-xl font-bold text-aparcs-text-dark text-center mb-4">
        Registro de Faltas
      </Text>

      {/* Table Header */}
      <View className="flex-row mb-3 pb-2 border-b border-gray-200">
        <Text className="flex-1 font-bold text-gray-700">Alumno</Text>
        <Text className="w-14 text-center font-bold text-gray-600 text-xs">0.25</Text>
        <Text className="w-14 text-center font-bold text-gray-600 text-xs">0.50</Text>
        <Text className="w-14 text-center font-bold text-gray-600 text-xs">1.00</Text>
        <Text className="w-14 text-center font-bold text-aparcs-presente text-xs">Just.</Text>
      </View>

      {/* Table Rows */}
      <ScrollView className="max-h-80">
        {faltas.map((alumno, index) => (
          <View
            key={index}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <Text className="flex-1 text-gray-800 text-sm">
              {alumno.nombre} {alumno.apellido}
            </Text>

            {/* 0.25 */}
            <View className="w-14 items-center">
              <View className={`w-8 h-8 rounded-md items-center justify-center ${
                alumno.falta === 0.25 ? 'bg-aparcs-tarde' : 'bg-gray-200'
              }`}>
                {alumno.falta === 0.25 && (
                  <Text className="text-white font-bold text-xs">✓</Text>
                )}
              </View>
            </View>

            {/* 0.50 */}
            <View className="w-14 items-center">
              <View className={`w-8 h-8 rounded-md items-center justify-center ${
                alumno.falta === 0.5 ? 'bg-aparcs-tarde' : 'bg-gray-200'
              }`}>
                {alumno.falta === 0.5 && (
                  <Text className="text-white font-bold text-xs">✓</Text>
                )}
              </View>
            </View>

            {/* 1.00 */}
            <View className="w-14 items-center">
              <View className={`w-8 h-8 rounded-md items-center justify-center ${
                alumno.falta === 1 ? 'bg-aparcs-ausente' : 'bg-gray-200'
              }`}>
                {alumno.falta === 1 && (
                  <Text className="text-white font-bold text-xs">✓</Text>
                )}
              </View>
            </View>

            {/* Justificada */}
            <View className="w-14 items-center">
              <View className={`w-8 h-8 rounded-md items-center justify-center ${
                alumno.esta_justificada ? 'bg-aparcs-presente' : 'bg-gray-200'
              }`}>
                {alumno.esta_justificada && (
                  <Text className="text-white font-bold text-xs">✓</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FaltasTable;
