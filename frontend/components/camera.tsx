import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  console.log('Permission status:', permission); // Debug

  if (!permission) {
    return <View className="flex-1 bg-red-500" />; // Debug: fondo rojo
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center px-5 bg-blue-500"> {/* Debug: fondo azul */}
        <Text className="text-center pb-2.5 text-white text-xl">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View className="flex-1 bg-green-500"> {/* Debug: fondo verde */}
      <CameraView 
        style={{ flex: 1 }} 
        facing={facing} 
      />
      <View className="absolute bottom-16 flex-row w-full px-16">
        <TouchableOpacity className="flex-1 items-center bg-black/50 py-4 rounded-lg" onPress={toggleCameraFacing}>
          <Text className="text-2xl font-bold text-white">Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}