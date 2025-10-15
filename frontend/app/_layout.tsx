import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "./context/AuthContext"

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
