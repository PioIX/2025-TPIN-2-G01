import { Text, View } from "react-native";
import type { Rol } from "types";
import { useAuth } from "app/context/AuthContext";
import { useEffect } from "react";
import useFetch from "hooks/useFetch";
export default function ProfesoresAsistencia() {
    const { data, error, loading, fetchData } = useFetch<Rol>();
    const { token, logout } = useAuth();
    useEffect(() => {
        if (!token) return;
        const fetchUser = async () => {
            const userData = await fetchData({
                url: 'http://localhost:4000/usuarioLog',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Persona: 'profesor',
                },
            })

            if (typeof(userData) == "object") {
                console.log(userData.message)
            }
        };
        fetchUser()
    }, [token]);
    return (
        <>
            <View>
                <Text>pagina asistencia</Text>
            </View>
        </>
    )
}