import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#1E90FF',
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
        tabBarLabelStyle: {
          display: 'none',
        },
      }}>
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
        name="scanner"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="qr-code-scanner" 
              size={28} 
              color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="verificarAsistencia"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <AntDesign 
              name="contacts" 
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
