import { Pressable, Text, View } from "react-native";
import { RolMessage, CursosProfe } from "types";
import { useAuth } from "app/context/AuthContext";
import { useEffect, useState } from "react";
import useFetch from "hooks/useFetch";
import { Select } from "components/select";


export default function ProfesoresAsistencia() {
    const { data, error, loading, fetchData } = useFetch<RolMessage | CursosProfe>();

    const { token, logout } = useAuth();
    const [idProfesor, setIdProfesor] = useState<number>(0)
    const [cursos, setCursos] = useState<CursosProfe>([])
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

            if (userData && typeof userData === "object" && "message" in userData) {
                setIdProfesor(userData.message.id_profesor);
            }
        };
        fetchUser()
    }, [token]);

    useEffect(() => {
        if (idProfesor != 0) {
            console.log(idProfesor)
            const fetchCursos = async () => {
                const cursosData = await fetchData({
                    url: `http://localhost:4000/cursos?id_profesor=${idProfesor}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (Array.isArray(cursosData)) {
                    setCursos(cursosData)
                }
            }
            fetchCursos();
        }
    }, [idProfesor])

    return (
        <>
            <View>
                <Text>pagina asistencia</Text>
                {cursos && <Select props={cursos}></Select>}
                <Pressable         className="bg-blue-600 py-4 px-12 rounded-xl shadow-md"
></Pressable>
            </View>
        </>
    )
}