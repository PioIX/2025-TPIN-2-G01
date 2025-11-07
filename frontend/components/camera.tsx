import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Scanner({
  active,
  onScan,
}: {
  active: boolean;
  onScan: (data: string) => void;
}) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission) {
    return <View className="flex-1 bg-gray-100" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-center pb-2.5 text-gray-800">
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    onScan(data);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={{ flex: 1 }}
        facing={facing}
        onBarcodeScanned={active ? handleBarcodeScanned : undefined}
      />
    </View>
  );
}
