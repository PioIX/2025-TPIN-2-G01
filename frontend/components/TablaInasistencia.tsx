import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type InAttendanceTableProps = {
  fechas: Array<string | null>;
  faltas: Array<number>;
};

const InAttendanceTable: React.FC<InAttendanceTableProps> = ({ fechas, faltas }) => {
  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{fechas[index]}</Text>
      <Text style={styles.cell}>{faltas[index]}</Text>
    </View>
  );

  return (
    <View style={styles.tableContainer}>
      <View style={styles.header}>
        <Text style={styles.cell}>Fecha</Text>
        <Text style={styles.cell}>Falta</Text>
      </View>
      <FlatList
        data={fechas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    fontSize: 16,
    fontWeight: 'normal',
  },
});

export default InAttendanceTable;