import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 5 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="home" size={24} color={focused ? 'tomato' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="asistencia"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="playlist-edit"
              size={24}
              color={focused ? 'tomato' : 'gray'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Ionicons name="settings" size={24} color={focused ? 'tomato' : 'gray'} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="sign-out"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="sign-out" size={24}
            color={ focused ? "tomato" : "gray"} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
