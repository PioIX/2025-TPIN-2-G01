import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, Switch } from "react-native";
import Scanner from "components/camera";
import { useSocket } from "hooks/useSocket";
import useFetch from "hooks/useFetch";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ScannerScreen() {
  const [justificado, setJustificado] = useState<boolean>(false);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [alumnoData, setAlumnoData] = useState<any>(null);
  const { socket, isConnected } = useSocket();
  const { fetchData: registrarAsistencia } = useFetch();

  function unirme(data: string) {
    socket?.emit("unirme", { value: data });
  }

  const emitirAsistencia = async (data: string) => {
    if (data) {
      await marcarAsistencia(data);
      socket?.emit("MandarAsistencia", { value: data });
    }
  };

  async function marcarAsistencia(data: string) {
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
      if (scannedData) {
        emitirAsistencia(scannedData);
      }
    });

    return () => {
      socket.off("mensajitoSala");
    };
  }, [socket, scannedData]);

  const handleScan = (data: string) => {
    setScannedData(data);
    setScanning(false);
    unirme(data);
    
    // Simular datos del alumno (en producción vendrían del backend)
    setAlumnoData({
      nombre: "Alumno Escaneado",
      curso: "3°B Informática",
      dni: "47233474"
    });
    
    Alert.alert("QR Escaneado", `Email: ${data}`);
  };

  const handleToggleScan = () => {
    setScannedData(null);
    setAlumnoData(null);
    setScanning(prev => !prev);
  };

  const handleCancel = () => {
    setScanning(false);
    setScannedData(null);
    setAlumnoData(null);
  };

  return (
    <SafeAreaProvider className="flex-1 bg-aparcs-bg">
      {/* Header */}
      <View className="px-6 py-4 bg-aparcs-bg">
        <Text className="text-2xl font-bold italic text-aparcs-text-dark text-center">
          Scanner
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center bg-aparcs-bg px-6">
        {scanning ? (
          /* Camera View */
          <View className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-4 border-aparcs-primary shadow-lg">
            <Scanner active={true} onScan={handleScan} />
          </View>
        ) : alumnoData ? (
          /* Foto y datos del alumno después del escaneo */
          <View className="items-center w-full">
            {/* Foto del alumno (placeholder) */}
            <View className="w-48 h-48 bg-gray-300 rounded-2xl mb-6 items-center justify-center overflow-hidden shadow-lg">
              <Text className="text-gray-500">Foto del alumno</Text>
            </View>
            
            {/* Datos del alumno */}
            <View className="w-full max-w-xs space-y-3">
              <View className="bg-white p-3 rounded-lg border border-gray-200">
                <Text className="text-gray-700 text-center">{alumnoData.nombre}</Text>
              </View>
              <View className="bg-white p-3 rounded-lg border border-gray-200">
                <Text className="text-gray-700 text-center">{alumnoData.curso}</Text>
              </View>
              <View className="bg-white p-3 rounded-lg border border-gray-200">
                <Text className="text-gray-700 text-center">{alumnoData.dni}</Text>
              </View>
            </View>
          </View>
        ) : (
          /* Estado inicial */
          <View className="items-center">
            <View className="w-64 h-64 bg-gray-200 rounded-2xl items-center justify-center mb-4">
              <Text className="text-gray-400 text-center px-4">
                Presiona "Activar Cámara" para escanear
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="px-6 py-6 bg-aparcs-bg">
        {/* Botones Ver Datos y Escanear QR */}
        {alumnoData && (
          <View className="mb-4 space-y-3">
            <TouchableOpacity
              className="w-full bg-aparcs-primary py-3 rounded-xl border-2 border-aparcs-primary-dark"
              onPress={() => Alert.alert("Ver Datos", "Mostrando datos del alumno...")}
            >
              <Text className="text-white font-semibold text-center">
                Ver Datos del Alumno
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Toggle Justificar Falta */}
        <View className="flex-row items-center justify-between bg-aparcs-primary/20 p-3 rounded-full mb-4">
          <Switch
            value={justificado}
            onValueChange={setJustificado}
            trackColor={{ false: '#D1D5DB', true: '#1E90FF' }}
            thumbColor={justificado ? '#FFFFFF' : '#F3F4F6'}
          />
          <Text className="text-aparcs-text-dark font-medium flex-1 ml-3">
            Justificar falta
          </Text>
        </View>

        {/* Botón principal */}
        <TouchableOpacity
          className="w-full bg-aparcs-primary py-4 rounded-xl shadow-lg"
          onPress={handleToggleScan}
          style={{ backgroundColor: '#1E90FF' }}
        >
          <Text className="text-white font-bold text-center text-lg">
            {scanning ? "Escanear" : alumnoData ? "Escanear Otro" : "Activar Cámara"}
          </Text>
        </TouchableOpacity>

        {/* Botón cancelar si está escaneando o hay datos */}
        {(scanning || alumnoData) && (
          <TouchableOpacity
            className="w-full bg-aparcs-ausente py-3 rounded-xl mt-3"
            onPress={handleCancel}
          >
            <Text className="text-white font-semibold text-center">
              Cancelar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaProvider>
  );
}
