import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  label: string;
  onPress?: () => void;
};

export default function Button({ label, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-indigo-500 px-5 py-3 rounded-lg active:bg-indigo-600"
    >
      <Text className="text-white text-base font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
