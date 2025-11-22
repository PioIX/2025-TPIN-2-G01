import { View, Text } from "react-native";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View className="px-6 py-6 bg-aparcs-bg">
      <Text className="text-2xl font-bold italic text-aparcs-text-dark text-center">
        {title}
      </Text>
    </View>
  );
}
