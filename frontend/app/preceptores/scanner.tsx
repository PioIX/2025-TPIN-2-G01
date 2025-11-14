import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import Scanner from "components/camera";
import { useSocket } from "hooks/useSocket";
import useFetch from "hooks/useFetch";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [justificado, setJustificado] = useState<boolean>(false);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();
  const { fetchData: registrarAsistencia } = useFetch();

  function unirme(data: string) {
    socket?.emit("unirme", { value: data });
  }

  const emitirAsistencia = async (data: string) => {
    console.log("Estoy mandando asistencia con data:", data);

    if (data) {
      // Llamamos a marcar la asistencia con el QR escaneado (data)
      await marcarAsistencia(data);

      // Emisión de asistencia al socket
      socket?.emit("MandarAsistencia", { value: data });
    }
  };

  async function marcarAsistencia(data: string) {
    console.log("llama a marcarAsistencia")
    await registrarAsistencia({
      url: 'http://localhost:4000/asistencia',
      method: 'POST',
      body: { email: data },
      headers: {
        justificacion: `${justificado}`
      },
    });
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("mensajitoSala", (data) => {
      console.log(data);
      console.log("Estoy mandando asistencia");
      if (scannedData) {
        emitirAsistencia(scannedData);
      }
    });

    return () => {
      socket.off("mensajitoSala");
    };
  }, [socket, scannedData]); // Aquí depende de scannedData también

  const handleScan = (data: string) => {
    setScannedData(data);  // Actualizamos el estado con el QR escaneado
    setScanning(false);     // Detenemos el escaneo
    unirme(data);           // El usuario se une a la sala

    alert(`QR Escaneado: ${data}`);
  };

  const handleToggleScan = () => {
    setScannedData(null);
    setScanning(prev => !prev);
  };

  const handleCancel = () => {
    setScanning(false);
    setScannedData(null);
  };

  return (
    <>
    <SafeAreaProvider>

      <View className="w-full px-4 sm:px-6 md:px-8 py-3 bg-gray-50 border-b border-gray-200">
        <Text className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">
          Scanner
        </Text>
      </View>

      <View className="flex-1 items-center justify-center bg-white px-4 sm:px-6 md:px-8 pt-6">
        {scanning ? (
          <View className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square rounded-2xl overflow-hidden border-2 border-gray-300">
            <Scanner active={true} onScan={handleScan} />
          </View>
        ) : (
          <View className="items-center px-4">
            <Text className="text-gray-500 mb-4 text-sm sm:text-base md:text-lg">
              La cámara está desactivada
            </Text>
          </View>
        )}
      </View>

      <View className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200">
        <View className="flex-row w-full max-w-lg mx-auto justify-between mb-4 gap-3">
          <TouchableOpacity
            className="flex-1 bg-red-500 px-3 py-2 sm:px-4 sm:py-3 rounded-lg items-center justify-center"
            onPress={handleCancel}
            >
            <Text className="text-white font-semibold text-sm sm:text-base">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-green-600 px-3 py-2 sm:px-4 sm:py-3 rounded-lg items-center justify-center"
            onPress={() => setJustificado(!justificado)}
            >
            <Text className="text-white font-semibold text-sm sm:text-base">Justificar Falta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-600 w-full max-w-lg mx-auto py-3 sm:py-3 md:py-4 rounded-lg"
          onPress={handleToggleScan}
          >
          <Text className="text-white font-semibold text-center text-base sm:text-lg md:text-xl">
            {scanning ? "Escanear" : "Activar Cámara"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
    </>
  );
}