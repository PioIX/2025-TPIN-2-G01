import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {}

const Input: React.FC<InputProps> = (props) => {
  return <TextInput {...props} />;
};

export default Input;
