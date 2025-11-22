import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
}

export default function Button({ 
  label, 
  onPress, 
  variant = 'primary',
  className,
  ...props 
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-aparcs-ausente';
      case 'success':
        return 'bg-aparcs-presente';
      case 'warning':
        return 'bg-aparcs-tarde';
      default:
        return 'bg-aparcs-primary';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${getVariantStyles()} px-6 py-4 rounded-xl shadow-lg active:opacity-80 ${className || ''}`}
      {...props}
    >
      <Text className="text-white text-base font-bold text-center">{label}</Text>
    </TouchableOpacity>
  );
}
