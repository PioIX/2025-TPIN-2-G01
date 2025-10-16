import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { CursosProfe } from "types";

interface SelectProps {
  props: CursosProfe; 
}

export const Select = ({ props }: SelectProps) => {
  return (
    <RNPickerSelect
      onValueChange={(value) => console.log(value)}
      items={props.map((curso) => ({
        label: `${curso.carrera} - ${curso.año}º ${curso.division} `,  
        value: curso.id_curso.toString(), 
      }))}
    />
  );
};
