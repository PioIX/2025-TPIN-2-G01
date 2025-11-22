import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { CursosProfe } from 'types';

interface SelectProps {
  props: CursosProfe;
  value?: string | number | null;
  onValueChange?: (value: string | number, index: number) => void;
}

export const SelectCursos = ({ props, value, onValueChange }: SelectProps) => {
  return (
    <View className="border-2 border-gray-300 rounded-xl px-4 py-2 bg-white">
      <RNPickerSelect
        value={value}
        onValueChange={(val, index) => {
          if (onValueChange) onValueChange(val, index);
        }}
        placeholder={{
          label: 'Seleccione un curso',
          value: null,
          color: '#9CA3AF',
        }}
        items={props.map((curso) => ({
          label: `${curso.carrera} - ${curso.año}º ${curso.division}`,
          value: curso.id_curso,
        }))}
        style={{
          inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            color: '#374151',
          },
          inputAndroid: {
            fontSize: 16,
            paddingVertical: 8,
            color: '#374151',
          },
          placeholder: {
            color: '#9CA3AF',
          },
        }}
      />
    </View>
  );
};
