import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  variant?: 'default' | 'rounded';
}

const Input: React.FC<InputProps> = ({ variant = 'default', className, ...props }) => {
  const baseStyles = "bg-white text-gray-800";
  const variantStyles = variant === 'rounded' 
    ? "p-4 rounded-full border-2 border-gray-300"
    : "p-4 rounded-xl border border-gray-200";

  return (
    <TextInput 
      className={`${baseStyles} ${variantStyles} ${className || ''}`}
      placeholderTextColor="#9CA3AF"
      {...props} 
    />
  );
};

export default Input;
