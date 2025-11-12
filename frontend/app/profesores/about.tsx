import { Pressable, Text, View } from 'react-native';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function About() {
  const {logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };
  return (
    <>
    <SafeAreaProvider>
      
      <Pressable onPress={handleLogout}>
        <Text>cerrar</Text>
      </Pressable>
      <View>
        <Text>hola</Text>
      </View>
    </SafeAreaProvider>
    </>
  );
}
