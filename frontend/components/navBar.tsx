import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { NavBarProps } from "types";

export default function NavBar({
  props,
  onPress,
  styleText,
  stylePresable,
  styleView
}: NavBarProps) {
  const router = useRouter();

  return (
    <View
      style={styleView || {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E90FF",
        paddingVertical: 12,
        borderRadius: 12,
      }}
    >
      {props.map((item, index) => (
        <Pressable
          key={index}
          onPress={onPress}
          style={stylePresable || {
            backgroundColor: "white",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            marginHorizontal: 4,
          }}
        >
          <Text style={styleText || { color: "#1E90FF", fontWeight: "bold" }}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
