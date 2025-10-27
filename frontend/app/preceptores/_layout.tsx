import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
        name="scanner"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
           <MaterialIcons name="qr-code-scanner" size={24} color={focused ? 'tomato' : 'gray'} />
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

    </Tabs>
  );
}
