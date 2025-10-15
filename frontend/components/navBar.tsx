import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { NavBarProps } from "types";

export default function NavBar({ props }: NavBarProps) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2563eb", 
        paddingVertical: 12,
      }}
    >
      {props.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => router.push(`/${item.toLowerCase()}`)}
          style={{
            backgroundColor: "white",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 6,
            marginHorizontal: 4,
          }}
        >
          <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
