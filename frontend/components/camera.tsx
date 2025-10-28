import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-2.5">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView className="flex-1" facing={facing} />
      <View className="absolute bottom-16 flex-row bg-transparent w-full px-16">
        <TouchableOpacity className="flex-1 items-center" onPress={toggleCameraFacing}>
          <Text className="text-2xl font-bold text-white">Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}