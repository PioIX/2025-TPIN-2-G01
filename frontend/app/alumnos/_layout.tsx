import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E90FF",  // Azul APARCS cuando está activo
        tabBarInactiveTintColor: "#9CA3AF", // Gris cuando está inactivo
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#1E90FF', // Fondo azul APARCS
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          display: 'none', // Sin labels, solo iconos
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              size={28}
              color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Octicons 
              name="checklist" 
              size={26} 
              color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="settings" 
              size={26} 
              color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
