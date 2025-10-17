import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { CursosProfe } from 'types';

interface SelectProps {
  props: CursosProfe;
  value?: string | number;
  onValueChange?: (value: string | number, index: number) => void;
}

export const SelectCursos = ({ props, value, onValueChange }: SelectProps) => {
  return (
    <View className="border border-black rounded-lg px-3 py-2">

    <RNPickerSelect
      
      value={value}
      onValueChange={(val, index) => {
        if (onValueChange) onValueChange(val, index); 
      }}
      placeholder={{
        label: 'Seleccione un curso', 
        value: null,
        color: '#6b7280', 
      }}
      items={props.map((curso) => ({
        label: `${curso.carrera} - ${curso.año}º ${curso.division}`,
        value: curso.id_curso,
      }))}
      />
      </View>
  );
};
