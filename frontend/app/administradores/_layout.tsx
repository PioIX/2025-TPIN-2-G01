import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Layout() {
  return (
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
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              size={24}
              color={focused ? 'tomato' : 'gray'}  
            />
          ),
        }}
      />
      <Tabs.Screen
        name="funciones"
        options={{ title: "funciones" }}
      />
      <Tabs.Screen
        name="cerrar sesion"
        options={{ title: "cerrar sesion" }}
      />
    </Tabs>
  );
}
