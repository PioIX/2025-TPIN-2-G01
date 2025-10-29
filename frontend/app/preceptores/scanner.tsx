import { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import Scanner from "components/camera";

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (data: string) => {
    setScannedData(data);
    setScanning(false); 
    alert(`QR Escaneado ${data}`);
  };

  const handleToggleScan = () => {
    setScannedData(null);
    setScanning(prev => !prev);
  };

  const handleCancel = () => {
    setScanning(false);
    setScannedData(null);
  };

  const handleActionX = () => {
    if (scannedData) {
      Alert.alert("Función X ejecutada con:", scannedData);
    }
  };

  return (
    <>
      <View className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800 text-center">
          Scanner
        </Text>
      </View>

      <View className="flex-1 items-center justify-center bg-white">
        {scanning ? (
          <View className="w-4/5 max-w-[320px] aspect-square rounded-2xl overflow-hidden border-2 border-gray-300">
            <Scanner active={true} onScan={handleScan} />
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-gray-500 mb-4">
              La cámara está desactivada
            </Text>
          </View>
        )}
      </View>

      <View className="w-full px-4 py-4 bg-gray-50 border-t border-gray-200">
        <View className="flex-row justify-around mb-4">
          <TouchableOpacity
            className="bg-red-500 px-4 py-3 rounded-lg"
            onPress={handleCancel}
          >
            <Text className="text-white font-semibold">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-600 px-4 py-3 rounded-lg"
            onPress={handleActionX}
          >
            <Text className="text-white font-semibold">Justificar Falta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-600 w-full py-3 rounded-lg"
          onPress={handleToggleScan}
        >
          <Text className="text-white font-semibold text-center text-lg">
            {scanning ? "Escanear" : "Activar Cámara"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
