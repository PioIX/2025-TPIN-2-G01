import cursos from "cursos.json"
const dataCursos: Array<Cursos> = cursos

import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "components/Button";
import Input from "components/input";
import DropDown from "components/dropDown";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Usuario, Owner, Preceptor, Profesor, Alumno, items, Cursos, email, Admin } from "types";
export default function About() {
    const [name, onChangeName] = useState<string>("");
    const [surname, onChangeSurname] = useState<string>("");
    const [email, onChangeEmail] = useState<email | string>("");
    const [password, onChangePassword] = useState<string>("");
    const [curso, onChangeCurso] = useState<string>("");
    const [idCurso, onChangeIdCurso] = useState<number | null>(null);
    const [owner, onChangeOwner] = useState<boolean>(false);

    const [modificar, setModificar] = useState<Boolean>(true)
    const [borrar, setBorrar] = useState<Boolean>(false)
    const [agregar, setAgregar] = useState<Boolean>(false)

    const [openRank, setOpenRank] = useState<boolean>(false)
    const [openList, setOpenList] = useState<boolean>(false)

    const [rank, setRank] = useState<string>("");
    const [user, setUser] = useState<Usuario | null>(null)
    const [userId, setUserId] = useState<number | null>(null)

    const [ownerLista, setOwnerLista] = useState<Owner[]>([])
    const [alumnoLista, setAlumnoLista] = useState<Alumno[]>([])
    const [profesoresLista, setProfesoresLista] = useState<Profesor[]>([])
    const [preceptorLista, setPreceptorLista] = useState<Preceptor[]>([])
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
            { id: 1, nombre: "Admin1", apellido: "Perez", rango: "owner", email: "admin1@escuela.com", contraseña: "1234" },
            { id: 2, nombre: "Admin2", apellido: "Lopez", rango: "owner", email: "admin2@escuela.com", contraseña: "1234" },
            { id: 3, nombre: "Admin3", apellido: "Diaz", rango: "owner", email: "admin3@escuela.com", contraseña: "1234" },
            { id: 4, nombre: "Admin4", apellido: "Sosa", rango: "owner", email: "admin4@escuela.com", contraseña: "1234" },
            { id: 5, nombre: "Admin5", apellido: "Martinez", rango: "owner", email: "admin5@escuela.com", contraseña: "1234" },
        ]);

        // Preceptores (rango "P")
        setPreceptorLista([
            { id: 1, nombre: "Preceptor1", apellido: "Gomez", rango: "preceptor", email: "preceptor1@escuela.com", contraseña: "abcd" },
            { id: 2, nombre: "Preceptor2", apellido: "Mendez", rango: "preceptor", email: "preceptor2@escuela.com", contraseña: "abcd" },
            { id: 3, nombre: "Preceptor3", apellido: "Ramos", rango: "preceptor", email: "preceptor3@escuela.com", contraseña: "abcd" },
            { id: 4, nombre: "Preceptor4", apellido: "Nuñez", rango: "preceptor", email: "preceptor4@escuela.com", contraseña: "abcd" },
            { id: 5, nombre: "Preceptor5", apellido: "Suarez", rango: "preceptor", email: "preceptor5@escuela.com", contraseña: "abcd" },
        ]);

        // Estudiantes
        setAlumnoLista([
            { id: 1, id_curso: 17, nombre: "Estudiante1", apellido: "Fernandez", rango: "alumno", imagen: null, email: "estudiante1@escuela.com", contraseña: "pass" },
            { id: 2, id_curso: 32, nombre: "Estudiante2", apellido: "Garcia", rango: "alumno", imagen: null, email: "estudiante2@escuela.com", contraseña: "pass" },
            { id: 3, id_curso: 1, nombre: "Estudiante3", apellido: "Perez", rango: "alumno", imagen: null, email: "estudiante3@escuela.com", contraseña: "pass" },
            { id: 4, id_curso: 27, nombre: "Estudiante4", apellido: "Molina", rango: "alumno", imagen: null, email: "estudiante4@escuela.com", contraseña: "pass" },
            { id: 5, id_curso: 11, nombre: "Estudiante5", apellido: "Juarez", rango: "alumno", imagen: null, email: "estudiante5@escuela.com", contraseña: "pass" },
        ]);

        // Profesores
        setProfesoresLista([
            { id: 1, nombre: "Profesor1", apellido: "Ruiz", email: "profesor1@escuela.com", contraseña: "prof1", rango: "profesor" },
            { id: 2, nombre: "Profesor2", apellido: "Navarro", email: "profesor2@escuela.com", contraseña: "prof2", rango: "profesor" },
            { id: 3, nombre: "Profesor3", apellido: "Blanco", email: "profesor3@escuela.com", contraseña: "prof3", rango: "profesor" },
            { id: 4, nombre: "Profesor4", apellido: "Sanchez", email: "profesor4@escuela.com", contraseña: "prof4", rango: "profesor" },
            { id: 5, nombre: "Profesor5", apellido: "Ortiz", email: "profesor5@escuela.com", contraseña: "prof5", rango: "profesor" },
        ]);
    }, [])
    function isAdmin(user: Admin): boolean {
        return (user?.rango == "owner" || user?.rango == "preceptor")
    }
    function isOwner(user: Owner): boolean {
        return (user?.rango == "owner")
    }
    function isPreceptor(user: Preceptor): boolean {
        return (user?.rango == "preceptor")
    }
    function isAlumno(user: Alumno): boolean {
        return user?.rango == "alumno"
    }
    function isProfesor(user: Profesor): boolean {
        return user?.rango == "profesor"
    }
    function limpiarSelectUsuarios(): void {
        setItems([])
        setUserId(0)
        setUser(null)
        onChangeName("");
        onChangeSurname("");
        onChangeEmail("");
        onChangePassword("");
        onChangeCurso("")
        onChangeIdCurso(0)
        onChangeOwner(false)
    }
    useEffect(() => {
        userDataSetter(userId as number)
        console.log("hola", user)
    }, [userId])
    function userDataSetter(userId: number): void {
        let usuario: Usuario | undefined;
        switch (rank) {
            case "owner":
                usuario = ownerLista.find(owner => owner.id == userId);
                break;
            case "preceptor":
                console.log("soy Prec");
                usuario = preceptorLista.find(Preceptor => Preceptor.id == userId);
                break;
            case "alumno":
                console.log("soy Alumn");
                usuario = alumnoLista.find(Alumno => Alumno.id == userId);
                break;
            case "profesor":
                console.log("soy Prof");
                usuario = profesoresLista.find(profesor => profesor.id == userId);
                break;
        }
        if (usuario) {
            setUser(usuario);
            onChangeName(usuario.nombre);
            onChangeSurname(usuario.apellido);
            onChangeEmail(usuario.email);
            onChangePassword(usuario.contraseña);
            if (isAlumno(usuario as Alumno)) {
                onChangeIdCurso((usuario as Alumno).id_curso)
                const cursoDeAlmuno = dataCursos.find(curso => curso?.id_curso == (usuario as Alumno)?.id_curso)
                console.log(cursoDeAlmuno, "aaaaaaaa")
                onChangeCurso(`${cursoDeAlmuno?.año} ${cursoDeAlmuno?.division} ${cursoDeAlmuno?.carrera}`)
            }
            if (isPreceptor(usuario as Preceptor)) {
                onChangeOwner(false)
            }
            if (isOwner(usuario as Owner)) {
                onChangeOwner(true)
            }
        }
    }
    function cambiarRango(): void {
        switch (rank) {
            case "owner":
                setItems(ownerLista.map((admin) => ({
                    label: `${admin.nombre} ${admin.apellido}`,
                    value: admin.id,
                })) as items[])
                break
            case "preceptor":
                setItems(preceptorLista.map((preceptor) => ({
                    label: `${preceptor.nombre} ${preceptor.apellido}`,
                    value: preceptor.id,
                })) as items[])
                break
            case "alumno":
                setItems(alumnoLista.map((alumno) => ({
                    label: `${alumno.nombre} ${alumno.apellido}`,
                    value: alumno.id,
                })) as items[])
                break
            case "profesor":
                setItems(profesoresLista.map((profesor) => ({
                    label: `${profesor.nombre} ${profesor.apellido}`,
                    value: profesor.id,
                })) as items[])
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
        limpiarSelectUsuarios()
    }
    function moverABorrar(): void {
        setModificar(false)
        setBorrar(true)
        setAgregar(false)
        limpiarSelectUsuarios()
    }
    function moverAAgregar(): void {
        setModificar(false)
        setBorrar(false)
        setAgregar(true)
        limpiarSelectUsuarios()
    }
    function subirDatos(): void {
        const UserData: Object = {
            id: userId,
            nombre: name,
            apellido: surname,
            email: email as email,
            contraseña: password,
            rango: rank,
            id_curso: idCurso
        }
        console.log(UserData)
    }
    function borrarUsuario():void{
        const data = {id:userId}
        console.log(data.id)
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Button label="Modificar" onPress={moverAModificar}></Button>
                <Button label="Borrar" onPress={moverABorrar}></Button>
                <Button label="Agregar" onPress={moverAAgregar}></Button>
            </View>
            {
                borrar &&
                <DropDown
                    open={openRank}
                    setOpen={setOpenRank}
                    items={[
                        { label: "Alumno", value: "alumno" },
                        { label: "Owner", value: "owner" },
                        { label: "Profesor", value: "profesor" },
                        { label: "Preceptor", value: "preceptor" },
                    ]}
                    value={rank}
                    setValue={setRank}
                    placeholder="elegi un cargo"
                />

            }
            {
                borrar && rank &&
                <View>
                    <DropDown
                        setOpen={setOpenList}
                        open={openList}
                        items={items}
                        setItems={setItems}
                        value={userId as number}
                        setValue={setUserId as Dispatch<SetStateAction<number | null>>}
                        placeholder={`seleccione un ${rank.toLowerCase()}`}
                        isSearchable
                    />
                    {userId && <Button label="borrar usuario" onPress={borrarUsuario}></Button>}
                </View>
            }
            {
                modificar &&
                <DropDown
                    open={openRank}
                    setOpen={setOpenRank}
                    items={[
                        { label: "Alumno", value: "alumno" },
                        { label: "Owner", value: "owner" },
                        { label: "Profesor", value: "profesor" },
                        { label: "Preceptor", value: "preceptor" },
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
                        value={userId as number}
                        setValue={setUserId as Dispatch<SetStateAction<number | null>>}
                        placeholder={`seleccione un ${rank.toLowerCase()}`}
                        isSearchable
                    />
                    {

                        userId && user &&
                        <View>
                            <Input editable={false} value={user?.id.toString()} />
                            <Input value={name} onChangeText={onChangeName} />
                            <Input value={surname} onChangeText={onChangeSurname} />
                            <Input value={email} onChangeText={onChangeEmail} />
                            <Input value={password} onChangeText={onChangePassword} />
                            {
                                isAdmin(user as Admin) &&
                                <TouchableOpacity onPress={() => { onChangeOwner(!owner) }}>
                                    {owner && <Text> es Owner</Text>}
                                    {!owner && <Text> es Preceptor</Text>}
                                </TouchableOpacity>
                            }
                            {
                                isAlumno(user as Alumno)
                            }
                            <Button label="subir nuevos datos" onPress={subirDatos}></Button>
                        </View>
                    }
                </View>
            }
        </SafeAreaView>

    )

}
