import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import Scanner from "components/camera";
import { useSocket } from "hooks/useSocket";
import useFetch from "hooks/useFetch";

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

    // Emitimos la asistencia directamente con el valor escaneado (data)
    // if (data) {
    //   emitirAsistencia(data);  // Llamamos a la función con el valor escaneado
    // }
    // Parece que por este if se ejecutaba 2 veces
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
            onPress={() => setJustificado(!justificado)}
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
