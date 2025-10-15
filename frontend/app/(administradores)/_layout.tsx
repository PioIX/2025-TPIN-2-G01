// app/layout.tsx
import { Tabs } from "expo-router";
// import { AuthProvider } from "./context/AuthContext";

export default function Layout() {
  return (
    // <AuthProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { height: 60, paddingBottom: 5 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: "P1" }}
        />
        <Tabs.Screen
          name="about"
          options={{ title: "P2" }}
        />
      </Tabs>
    // </AuthProvider>
  );
}