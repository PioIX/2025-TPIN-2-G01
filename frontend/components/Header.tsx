import { View, Text } from "react-native";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-indigo-700">{title}</Text>
    </View>
  );
}
