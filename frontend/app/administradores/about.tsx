import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View, TextInput } from 'react-native';
import { useAuth } from 'app/context/AuthContext';
import useFetch from 'hooks/useFetch';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type TabType = 'Modificar' | 'Borrar' | 'Agregar';

export default function AdminCRUD() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('Modificar');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const tabs: TabType[] = ['Modificar', 'Borrar', 'Agregar'];

  return (
    <SafeAreaProvider className="flex-1 bg-aparcs-bg">
      <View className="flex-1 bg-aparcs-bg">
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold italic text-aparcs-text-dark text-center">
            Preceptores
          </Text>
        </View>

        {/* Main Card */}
        <View className="flex-1 mx-4">
          <View className="bg-aparcs-primary rounded-3xl overflow-hidden shadow-lg flex-1">
            {/* Tabs */}
            <View className="flex-row bg-aparcs-primary">
              {tabs.map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-4 ${
                    activeTab === tab 
                      ? 'bg-aparcs-primary-dark border-b-2 border-white' 
                      : 'bg-aparcs-primary'
                  }`}
                >
                  <Text className={`text-center font-semibold ${
                    activeTab === tab ? 'text-white' : 'text-white/70'
                  }`}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Content Area */}
            <View className="flex-1 bg-aparcs-bg-light p-6">
              {activeTab === 'Modificar' && (
                <View>
                  {/* Selector de preceptor */}
                  <View className="bg-white rounded-lg p-4 border border-gray-200">
                    <Text className="text-gray-500 text-center">
                      Seleccionar Preceptor
                    </Text>
                  </View>
                  
                  {selectedUser && (
                    <View className="mt-4 space-y-3">
                      <TextInput
                        className="bg-white p-4 rounded-lg border border-gray-200"
                        placeholder="Nombre"
                      />
                      <TextInput
                        className="bg-white p-4 rounded-lg border border-gray-200"
                        placeholder="Apellido"
                      />
                      <TextInput
                        className="bg-white p-4 rounded-lg border border-gray-200"
                        placeholder="Email"
                      />
                      <Pressable className="bg-aparcs-primary py-4 rounded-xl mt-4">
                        <Text className="text-white text-center font-bold">
                          Guardar Cambios
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'Borrar' && (
                <View>
                  <View className="bg-white rounded-lg p-4 border border-gray-200">
                    <Text className="text-gray-500 text-center">
                      Seleccionar Preceptor
                    </Text>
                  </View>
                  
                  <Pressable className="bg-aparcs-ausente py-4 rounded-xl mt-4">
                    <Text className="text-white text-center font-bold">
                      Eliminar Preceptor
                    </Text>
                  </Pressable>
                </View>
              )}

              {activeTab === 'Agregar' && (
                <View className="space-y-3">
                  <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-200"
                    placeholder="Nombre"
                  />
                  <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-200"
                    placeholder="Apellido"
                  />
                  <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-200"
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                  <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-200"
                    placeholder="Contraseña"
                    secureTextEntry
                  />
                  
                  <Pressable 
                    className="bg-aparcs-presente py-4 rounded-xl mt-4"
                    style={({ pressed }) => [
                      { backgroundColor: pressed ? '#00A844' : '#00C853' }
                    ]}
                  >
                    <Text className="text-white text-center font-bold">
                      Agregar Preceptor
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
