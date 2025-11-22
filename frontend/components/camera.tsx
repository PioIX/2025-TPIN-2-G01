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
    return <View className="flex-1 bg-aparcs-bg" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-aparcs-bg p-6">
        <Text className="text-center pb-4 text-aparcs-text-dark text-lg">
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-aparcs-primary px-6 py-3 rounded-xl"
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
