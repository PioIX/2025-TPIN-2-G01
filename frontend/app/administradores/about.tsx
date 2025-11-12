import Button from "components/Button";
import DropDown from "components/DropDown";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Admins, Profesores, Estudiantes, items, Usuario, Alumno } from "types";
import Input from "components/input";

import { values } from "eslint.config";
export default function About() {
    const [modificar, setModificar] = useState<Boolean>(true)
    const [borrar, setBorrar] = useState<Boolean>(false)
    const [agregar, setAgregar] = useState<Boolean>(false)

    const [openRank, setOpenRank] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openList, setOpenList] = useState<boolean>(false)

    const [rank, setRank] = useState<string>("");
    const [user, setUser] = useState<Usuario | null>(null)
    const [userId, setUserId] = useState<number | null>(null)

    const [ownerLista, setOwnerLista] = useState<Admins[]>([])
    const [alumnoLista, setAlumnoLista] = useState<Estudiantes[]>([])
    const [profesoresLista, setProfesoresLista] = useState<Profesores[]>([])
    const [preceptorLista, setPreceptorLista] = useState<Admins[]>([])
    const [items, setItems] = useState<items[]>([])
    useEffect(() => {
        console.log("user: ", user)
    }, [, user])
    useEffect(() => {
        console.log("rank: ", openRank)
    }, [openRank])
    useEffect(() => {
        console.log("profesores[] ", profesoresLista)
    }, [profesoresLista])
    useEffect(() => {
        console.log("Owner[] ", ownerLista)
    }, [ownerLista])
    useEffect(() => {
        console.log("alumnos[] ", alumnoLista)
    }, [alumnoLista])
    useEffect(() => {
        console.log("Preceptorres[] ", preceptorLista)
    }, [preceptorLista])
    useEffect(() => {
        console.log("lista", openList)
    }, [openList])
    useEffect(() => {
        console.log("userId: ", userId)
    }, [userId])

    useEffect(() => {
        //owner (rango "O")
        setOwnerLista([
            { id: 1, nombre: "Admin1", apellido: "Perez", rango: "Owner", email: "admin1@escuela.com", contraseña: "1234" },
            { id: 2, nombre: "Admin2", apellido: "Lopez", rango: "Owner", email: "admin2@escuela.com", contraseña: "1234" },
            { id: 3, nombre: "Admin3", apellido: "Diaz", rango: "Owner", email: "admin3@escuela.com", contraseña: "1234" },
            { id: 4, nombre: "Admin4", apellido: "Sosa", rango: "Owner", email: "admin4@escuela.com", contraseña: "1234" },
            { id: 5, nombre: "Admin5", apellido: "Martinez", rango: "Owner", email: "admin5@escuela.com", contraseña: "1234" },
        ]);

        // Preceptores (rango "P")
        setPreceptorLista([
            { id: 1, nombre: "Preceptor1", apellido: "Gomez", rango: "Preceptor", email: "preceptor1@escuela.com", contraseña: "abcd" },
            { id: 2, nombre: "Preceptor2", apellido: "Mendez", rango: "Preceptor", email: "preceptor2@escuela.com", contraseña: "abcd" },
            { id: 3, nombre: "Preceptor3", apellido: "Ramos", rango: "Preceptor", email: "preceptor3@escuela.com", contraseña: "abcd" },
            { id: 4, nombre: "Preceptor4", apellido: "Nuñez", rango: "Preceptor", email: "preceptor4@escuela.com", contraseña: "abcd" },
            { id: 5, nombre: "Preceptor5", apellido: "Suarez", rango: "Preceptor", email: "preceptor5@escuela.com", contraseña: "abcd" },
        ]);

        // Estudiantes
        setAlumnoLista([
            { id: 1, id_curso: 101, nombre: "Estudiante1", apellido: "Fernandez", rango: "Estudiante", imagen: null, email: "estudiante1@escuela.com", contraseña: "pass" },
            { id: 2, id_curso: 101, nombre: "Estudiante2", apellido: "Garcia", rango: "Estudiante", imagen: null, email: "estudiante2@escuela.com", contraseña: "pass" },
            { id: 3, id_curso: 102, nombre: "Estudiante3", apellido: "Perez", rango: "Estudiante", imagen: null, email: "estudiante3@escuela.com", contraseña: "pass" },
            { id: 4, id_curso: 103, nombre: "Estudiante4", apellido: "Molina", rango: "Estudiante", imagen: null, email: "estudiante4@escuela.com", contraseña: "pass" },
            { id: 5, id_curso: 104, nombre: "Estudiante5", apellido: "Juarez", rango: "Estudiante", imagen: null, email: "estudiante5@escuela.com", contraseña: "pass" },
        ]);

        // Profesores
        setProfesoresLista([
            { id: 1, nombre: "Profesor1", apellido: "Ruiz", email: "profesor1@escuela.com", contraseña: "prof1", rango: "Profesor" },
            { id: 2, nombre: "Profesor2", apellido: "Navarro", email: "profesor2@escuela.com", contraseña: "prof2", rango: "Profesor" },
            { id: 3, nombre: "Profesor3", apellido: "Blanco", email: "profesor3@escuela.com", contraseña: "prof3", rango: "Profesor" },
            { id: 4, nombre: "Profesor4", apellido: "Sanchez", email: "profesor4@escuela.com", contraseña: "prof4", rango: "Profesor" },
            { id: 5, nombre: "Profesor5", apellido: "Ortiz", email: "profesor5@escuela.com", contraseña: "prof5", rango: "Profesor" },
        ]);
    }, [])

    function limpiarSelectUsuarios(): void {
        setItems([])
        setUserId(null)
        setUser(null)
    }
    useEffect(() => {
        userSeter(userId as number)
        console.log("hola", user)
    }, [userId])
    function isOwner(user: Usuario): boolean {
        return (user.rango == "Owner")
    }
    function isAdmin(user: Usuario): boolean {
        return (user.rango == "Preceptor")
    }
    function isEstudiante(user: Usuario): boolean {
        return user.rango == "Estudiante"
    }
    function isProfesor(user: Usuario): boolean {
        return user.rango == "Profesor"
    }
    function userSeter(userId: number): void {
        let usuario: Usuario
        console.log("hello")
        switch (rank) {
            case "Owner":
                usuario = (ownerLista.find((owner) => { owner.id == userId;console.log(owner.id==userId) })) as Usuario
                if (usuario) {
                    console.log("Owner encontrado:", usuario);
                } else {
                    console.log("Owner no encontrado");
                }
                setUser(usuario)
                break
            case "Preceptor":
                console.log("soy Prec")
                usuario = preceptorLista.find((Preceptor) => { Preceptor.id == userId }) as Usuario

                break
            case "Alumno":
                console.log("soy Alumn")
                usuario = alumnoLista.find((Alumno) => { Alumno.id == userId }) as Usuario
                break
            case "Profesor":
                console.log("soy Prof")
                usuario = profesoresLista.find((profesor) => { profesor.id == userId }) as Usuario
                break
        }
    }
    function cambiarRango(): void {
        switch (rank) {
            case "Owner":
                setItems(ownerLista.map((admin) => ({
                    label: `${admin.nombre} ${admin.apellido}`,
                    value: admin.id,
                })))
                break
            case "Preceptor":
                setItems(preceptorLista.map((preceptor) => ({
                    label: `${preceptor.nombre} ${preceptor.apellido}`,
                    value: preceptor.id,
                })))
                break
            case "Alumno":
                setItems(alumnoLista.map((alumno) => ({
                    label: `${alumno.nombre} ${alumno.apellido}`,
                    value: alumno.id,
                })))
                break
            case "Profesor":
                setItems(profesoresLista.map((profesor) => ({
                    label: `${profesor.nombre} ${profesor.apellido}`,
                    value: profesor.id,
                })))
                break
        }
    }

    useEffect(() => {
        limpiarSelectUsuarios()
        cambiarRango()
        console.log(rank)
    }, [rank])
    function moverAModificar(): void {
        setModificar(true)
        setBorrar(false)
        setAgregar(false)
    }
    function moverABorrar(): void {
        setModificar(false)
        setBorrar(true)
        setAgregar(false)
    }
    function moverAAgregar(): void {
        setModificar(false)
        setBorrar(false)
        setAgregar(true)
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Button label="Modificar" onPress={moverAModificar}></Button>
                <Button label="Borrar" onPress={moverABorrar}></Button>
                <Button label="Agregar" onPress={moverAAgregar}></Button>
            </View>
            {
                modificar &&
                <DropDown
                    open={openRank}
                    setOpen={setOpenRank}
                    items={[
                        { label: "Alumno", value: "Alumno" },
                        { label: "Owner", value: "Owner" },
                        { label: "Profesor", value: "Profesor" },
                        { label: "Preceptor", value: "Preceptor" },
                    ]}
                    value={rank}
                    setValue={setRank}
                    placeholder="elegi un cargo"
                />
            }
            {
                modificar && rank &&

                <View>
                    <DropDown
                        setOpen={setOpenList}
                        open={openList}
                        items={items}
                        setItems={setItems}
                        value={userId}
                        setValue={setUserId}
                        placeholder={`seleccione un ${rank.toLowerCase}`}
                        isSearchable
                    />
                    {
                        userId &&
                        <View>
                            <Input
                                editable={false}
                                value={user?.id.toString()}
                            />
                            <Input
                                value={user?.nombre}
                            />
                            <Input
                                value={user?.apellido}
                            />
                            <Input
                                value={user?.email}
                                placeholder="useless placeholder"
                                keyboardType="default"
                            />
                            <Input
                                value={user?.contraseña}
                            />
                            {/* {
                                isAdmin(user as Usuario) &&
                                <Input
                                    value={(user as Usuario).rango}
                                />
                            }
                            {
                                isEstudiante(user as Usuario) &&
                                <Input
                                    value={(user as Estudiantes).id_curso.toString()}
                                />
                            } */}
                            <Button label="mostrar rango" onPress={() => { console.log(user) }}>
                            </Button>
                        </View>

                    }
                    <Input placeholder="Escribe tu nombre" onChangeText={() => { }} ></Input>
                </View>
            }

        </SafeAreaView>

    )

}