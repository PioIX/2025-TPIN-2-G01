import Button from "components/Button";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Admins, Profesores, Estudiantes, items } from "types";
import Input from "components/input";
import DropDown from "components/dropDown";
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
    const [user, setUser] = useState<items>()

    const [adminsLista, setAdminsLista] = useState<Admins[]>([])
    const [alumnoLista, setAlumnoLista] = useState<Estudiantes[]>([])
    const [profesoresLista, setProfesoresLista] = useState<Profesores[]>([])
    const [preceptorLista, setPreceptorLista] = useState<Admins[]>([])
    const [items, setItems] = useState<items[]>([])
    useEffect(()=>{
        console.log("hola ",user)
    },[,user])
    useEffect(() => {
        console.log("soy ", openRank)
    }, [openRank])
    useEffect(() => {
        console.log("soy ", profesoresLista)
    }, [profesoresLista])

    useEffect(() => {
        setAdminsLista([
            { id: 1, nombre: "Admin1", apellido: "Perez", Rango: "O", email: "admin1@escuela.com", contraseña: "1234" },
            { id: 2, nombre: "Admin2", apellido: "Lopez", Rango: "O", email: "admin2@escuela.com", contraseña: "1234" },
            { id: 3, nombre: "Admin3", apellido: "Diaz", Rango: "O", email: "admin3@escuela.com", contraseña: "1234" },
            { id: 4, nombre: "Admin4", apellido: "Sosa", Rango: "O", email: "admin4@escuela.com", contraseña: "1234" },
            { id: 5, nombre: "Admin5", apellido: "Martinez", Rango: "O", email: "admin5@escuela.com", contraseña: "1234" },
        ]);

        // Preceptores (Rango "P")
        setPreceptorLista([
            { id: 1, nombre: "Preceptor1", apellido: "Gomez", Rango: "P", email: "preceptor1@escuela.com", contraseña: "abcd" },
            { id: 2, nombre: "Preceptor2", apellido: "Mendez", Rango: "P", email: "preceptor2@escuela.com", contraseña: "abcd" },
            { id: 3, nombre: "Preceptor3", apellido: "Ramos", Rango: "P", email: "preceptor3@escuela.com", contraseña: "abcd" },
            { id: 4, nombre: "Preceptor4", apellido: "Nuñez", Rango: "P", email: "preceptor4@escuela.com", contraseña: "abcd" },
            { id: 5, nombre: "Preceptor5", apellido: "Suarez", Rango: "P", email: "preceptor5@escuela.com", contraseña: "abcd" },
        ]);

        // Estudiantes
        setAlumnoLista([
            { id: 1, id_curso: 101, nombre: "Estudiante1", apellido: "Fernandez", imagen: null, email: "estudiante1@escuela.com", contraseña: "pass" },
            { id: 2, id_curso: 101, nombre: "Estudiante2", apellido: "Garcia", imagen: null, email: "estudiante2@escuela.com", contraseña: "pass" },
            { id: 3, id_curso: 102, nombre: "Estudiante3", apellido: "Perez", imagen: null, email: "estudiante3@escuela.com", contraseña: "pass" },
            { id: 4, id_curso: 103, nombre: "Estudiante4", apellido: "Molina", imagen: null, email: "estudiante4@escuela.com", contraseña: "pass" },
            { id: 5, id_curso: 104, nombre: "Estudiante5", apellido: "Juarez", imagen: null, email: "estudiante5@escuela.com", contraseña: "pass" },
        ]);

        // Profesores
        setProfesoresLista([
            { id: 1, nombre: "Profesor1", apellido: "Ruiz", email: "profesor1@escuela.com", contraseña: "prof1" },
            { id: 2, nombre: "Profesor2", apellido: "Navarro", email: "profesor2@escuela.com", contraseña: "prof2" },
            { id: 3, nombre: "Profesor3", apellido: "Blanco", email: "profesor3@escuela.com", contraseña: "prof3" },
            { id: 4, nombre: "Profesor4", apellido: "Sanchez", email: "profesor4@escuela.com", contraseña: "prof4" },
            { id: 5, nombre: "Profesor5", apellido: "Ortiz", email: "profesor5@escuela.com", contraseña: "prof5" },
        ]);
    }, [])

    function limpiarSelectUsuarios():void {
        setItems([])
        setUser(undefined)
    }
    function cambiarRango():void {
        switch (rank) {
            case "Administrador":
                setItems(adminsLista.map((admin) => ({
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
                        { label: "Administrador", value: "Administrador" },
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
                        value={user}
                        setValue={setUser}
                        placeholder={`seleccione un ${rank.toLowerCase}`}
                        isSearchable
                    />
                    {
                        rank == "Administradores" &&
                        <View>
                            <Input placeholder="" value={user.value}/>
                        </View>
                    }
                    <Input placeholder="Escribe tu nombre" onChangeText={() => {}} ></Input>
                </View>
            }

        </SafeAreaView>

    )

}