import React from 'react';
import { View, Text, FlatList } from 'react-native';

type InAttendanceTableProps = {
  fechas: Array<string | null>;
  faltas: Array<number>;
};

const InAttendanceTable: React.FC<InAttendanceTableProps> = ({ fechas, faltas }) => {
  
  const getFaltaDisplay = (falta: number) => {
    if (falta === 1) return '1';
    if (falta === 0.5) return '1/2';
    if (falta === 0.25) return '1/4';
    return '0';
  };

  const getFaltaColor = (falta: number) => {
    if (falta === 1) return 'bg-aparcs-ausente';
    if (falta === 0.5) return 'bg-aparcs-tarde';
    if (falta === 0.25) return 'bg-aparcs-ausente';
    return 'bg-aparcs-presente';
  };

  const renderItem = ({ item, index }: { item: string | null; index: number }) => (
    <View className="flex-row items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <View className="bg-gray-200 px-4 py-2 rounded-lg flex-1 mr-3">
        <Text className="text-gray-700 text-center">{item}</Text>
      </View>
      <View className={`${getFaltaColor(faltas[index])} px-4 py-2 rounded-lg min-w-[50px] items-center`}>
        <Text className="text-white font-bold">
          {getFaltaDisplay(faltas[index])}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="bg-aparcs-primary rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <View className="flex-row bg-aparcs-primary-dark px-4 py-3">
        <Text className="flex-1 text-white font-bold text-center">Fecha</Text>
        <Text className="w-20 text-white font-bold text-center">Falta</Text>
      </View>
      
      {/* Content */}
      {fechas.length > 0 ? (
        <FlatList
          data={fechas}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      ) : (
        <View className="px-4 py-8 bg-gray-50">
          <Text className="text-gray-400 text-center">
            No hay faltas registradas
          </Text>
        </View>
      )}
    </View>
  );
};

export default InAttendanceTable;
