import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import Button from "components/Button";
import Input from "components/input";
import DropDown from "components/dropDown";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Usuario, Owner, Preceptor, Profesor, Alumno, items, TipoUsuario, email, Admin } from "types";
export default function About() {
    //datos del Select
    const [name, onChangeName] = useState<string>("");
    const [surname, onChangeSurname] = useState<string>("");
    const [email, onChangeEmail] = useState<email | string>("");
    const [password, onChangePassword] = useState<string>("");
    const [cursos, setCursos] = useState<items[]>([]);
    const [idCurso, onChangeIdCurso] = useState<number | null>(null);
    const [owner, onChangeOwner] = useState<boolean>(false);

    //Rendering del CRUD
    const [modificar, setModificar] = useState<Boolean>(true)
    const [borrar, setBorrar] = useState<Boolean>(false)
    const [agregar, setAgregar] = useState<Boolean>(false)

    // states para los select
    const [openRank, setOpenRank] = useState<boolean>(false)
    const [openList, setOpenList] = useState<boolean>(false)
    const [openCurso, setOpenCurso] = useState<boolean>(false)

    //data de usuario seleccionadp
    const [rank, setRank] = useState<"owner" | "preceptor" | "profesor" | "alumno" | "">("");
    const [user, setUser] = useState<Usuario | null>(null)
    const [userId, setUserId] = useState<number | null>(null)

    // info de la BdD
    const [ownerLista, setOwnerLista] = useState<Owner[]>([])
    const [alumnoLista, setAlumnoLista] = useState<Alumno[]>([])
    const [profesoresLista, setProfesoresLista] = useState<Profesor[]>([])
    const [preceptorLista, setPreceptorLista] = useState<Preceptor[]>([])
    const [items, setItems] = useState<items[]>([])

    //debugging
    useEffect(() => {
        console.log("user: ", user)
    }, [, user])
    useEffect(() => {
        console.log("openRank: ", openRank)
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
        console.log("idCurso: ", idCurso)
    }, [idCurso])

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

        //Cursos
        setCursos([
            { value: 21, label: "1 A industrial" },
            { value: 22, label: "1 B industrial" },
            { value: 23, label: "1 C industrial" },
            { value: 24, label: "2 A industrial" },
            { value: 25, label: "2 B industrial" },
            { value: 26, label: "2 C industrial" },
            { value: 27, label: "3 A industrial" },
            { value: 28, label: "3 B industrial" },
            { value: 29, label: "4 A industrial" },
            { value: 30, label: "4 B industrial" },
            { value: 31, label: "5 A industrial" },
            { value: 32, label: "5 B industrial" },
            { value: 33, label: "6 A industrial" },
            { value: 34, label: "6 B industrial" },
            { value: 11, label: "1 A informatica" },
            { value: 12, label: "1 B informatica" },
            { value: 13, label: "2 A informatica" },
            { value: 14, label: "2 B informatica" },
            { value: 15, label: "3 A informatica" },
            { value: 16, label: "3 B informatica" },
            { value: 17, label: "4 A informatica" },
            { value: 18, label: "4 B informatica" },
            { value: 19, label: "5 A informatica" },
            { value: 20, label: "5 B informatica" },
            { value: 1, label: "1 A comunicacion" },
            { value: 2, label: "1 B comunicacion" },
            { value: 3, label: "2 A comunicacion" },
            { value: 4, label: "2 B comunicacion" },
            { value: 5, label: "3 A comunicacion" },
            { value: 6, label: "3 B comunicacion" },
            { value: 7, label: "4 A comunicacion" },
            { value: 8, label: "4 B comunicacion" },
            { value: 9, label: "5 A comunicacion" },
            { value: 10, label: "5 B comunicacion" },
            { value: 35, label: "3 A renovables" },
            { value: 36, label: "4 A renovables" },
            { value: 37, label: "5 A renovables" },
            { value: 38, label: "6 A renovables" }
        ])
    }, [])
    //de debugin para aca borrar

    useEffect(() => {
        if (modificar) {
            userDataSetter(userId as number)
        }
    }, [userId])

    useEffect(() => {
        cambiarRango()
        console.log(rank)
    }, [rank])

    function construirDatos(): TipoUsuario {
        const UserData: TipoUsuario = {
            id: userId as number,
            nombre: name,
            apellido: surname,
            email: email as email,
            contraseña: password,
            rango: rank,
            id_curso: idCurso as number
        }
        return UserData
    }
    /** 
    function errorHandler(data:TipoUsuario): boolean{
        // no cambiaste nada
        const usuario = encontraUsuarioPorIdYRango()
        if(
            data.nombre == usuario.nombre && 
            data.apellido == usuario.apellido &&
            data.email == usuario.email && 
            data.contraseña == usuario.contraseña && 
            data.rango == usuario.rango && (1==1)){
            console.log("djjhsohh")
            Alert.alert("no cambiaste ningun dato")
            return true
        }
        return false
    }
    */



    //type guards
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

    // limpiar data
    function limpiarSelectUsuarios(): void {
        setItems([])
        setUserId(0)
        setUser(null)
        onChangeName("");
        onChangeSurname("");
        onChangeEmail("");
        onChangePassword("");
        onChangeIdCurso(0)
        onChangeOwner(false)
    }
    function limpiarRango(): void {
        setRank("")
    }

    // setter de data
    function userDataSetter(userId: number): void {
        const usuario = encontraUsuarioPorIdYRango()
        if (usuario) {
            setUser(usuario);
            onChangeName(usuario.nombre);
            onChangeSurname(usuario.apellido);
            onChangeEmail(usuario.email);
            onChangePassword(usuario.contraseña);
            if (isAlumno(usuario as Alumno)) {
                onChangeIdCurso((usuario as Alumno).id_curso)
            }
            if (isPreceptor(usuario as Preceptor)) {
                onChangeOwner(false)
            }
            if (isOwner(usuario as Owner)) {
                onChangeOwner(true)
            }
        }
    }
    function encontraUsuarioPorIdYRango(): Usuario {
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
        return usuario as Usuario
    }
    function cambiarRango(): void {
        limpiarSelectUsuarios()
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

    // rendering del Crud
    function moverAModificar(): void {
        setModificar(true)
        setBorrar(false)
        setAgregar(false)
        limpiarSelectUsuarios()
        limpiarRango()
    }
    function moverABorrar(): void {
        setModificar(false)
        setBorrar(true)
        setAgregar(false)
        limpiarSelectUsuarios()
        limpiarRango()
    }
    function moverAAgregar(): void {
        setModificar(false)
        setBorrar(false)
        setAgregar(true)
        limpiarSelectUsuarios()
        limpiarRango()
    }
    // Funciones Fetch
    function subirDatos(): void {
        const datos = construirDatos()
        //if (!errorHandler(datos)) {
           
        //}
    }
    function ActualizarDatos(): void {
        const datos = construirDatos()
        //if (!errorHandler(datos)) {
            Alert.alert("todo biwn")
        //}
    }
    function borrarUsuario(): void {
        const data = { id: userId }
        console.log(data.id)
    }
    return (

        <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-gray-100 justify-center -translate-y-8">
            <View className="w-full px-4 sm:px-6 md:px-8 py-4 flex-row justify-center items-center gap-3">
              
                <Button className="flex-1 bg-blue-600 py-3 rounded-xl text-white text-center" label="Modificar" onPress={moverAModificar}></Button>
                <Button className="flex-1 bg-red-600 py-3 rounded-xl text-white text-center" label="Borrar" onPress={moverABorrar}></Button>
                <Button className="flex-1 bg-green-600 py-3 rounded-xl text-white text-center" label="Agregar" onPress={moverAAgregar}></Button>

            </View>
            {
                agregar &&
                <View className="w-full px-4 sm:px-6 md:px-8 mt-4">
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
                        className="w-full z-50"
                    />
                </View>
            }
            {
                agregar && rank &&
                <View className="w-full px-4 sm:px-6 md:px-8 mt-4 space-y-3">
                    <Input className="w-full p-3 sm:p-4 md:p-5 rounded-xl border border-gray-400 bg-gray-50 text-black z-0" value={name} onChangeText={onChangeName} placeholder="nombre" />
                    <Input className="w-full p-3 sm:p-4 md:p-5 rounded-xl border border-gray-400 bg-gray-50 text-black z-0" value={surname} onChangeText={onChangeSurname} placeholder="apellido" />
                    <Input className="w-full p-3 sm:p-4 md:p-5 rounded-xl border border-gray-400 bg-gray-50 text-black z-0" value={email} onChangeText={onChangeEmail} placeholder="napellido@pioix.edu.ar" />
                    <Input className="w-full p-3 sm:p-4 md:p-5 rounded-xl border border-gray-400 bg-gray-50 text-black z-0" value={password} onChangeText={onChangePassword} placeholder="contraseña" />
                    {
                        isAdmin(user as Admin) &&
                        <TouchableOpacity className="py-2" onPress={() => { onChangeOwner(!owner) }}>
                            {owner && <Text className="text-center text-sm"> es Owner</Text>}
                            {!owner && <Text className="text-center text-sm"> es Preceptor</Text>}
                        </TouchableOpacity>
                    }
                    {
                        isAlumno(user as Alumno) &&
                        <DropDown
                            value={idCurso}
                            setValue={onChangeIdCurso}
                            items={cursos}
                            open={openCurso}
                            setOpen={setOpenCurso}
                            className="w-full z-50"
                        />
                    }
                    <Button className="w-full bg-blue-600 py-3 rounded-xl text-white text-center" label="subir nuevos datos" onPress={subirDatos}></Button>
                </View>
            }

            {
                borrar &&
                <View className="w-full px-4 sm:px-6 md:px-8 mt-4">
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
                        className="w-full z-50"
                    />
                </View>

            }
            {
                borrar && rank &&
                <View className="w-full px-4 sm:px-6 md:px-8 mt-4 space-y-3">
                    <DropDown
                        setOpen={setOpenList}
                        open={openList}
                        items={items}
                        setItems={setItems}
                        value={userId as number}
                        setValue={setUserId as Dispatch<SetStateAction<number | null>>}
                        placeholder={`seleccione un ${rank.toLowerCase()}`}
                        isSearchable
                        className="w-full z-50"
                    />
                    {userId && <Button className="w-full bg-red-600 py-3 rounded-xl text-white text-center" label="borrar usuario" onPress={borrarUsuario}></Button>}
                </View>
            }
            {
                modificar &&
                <View className="w-full px-4 sm:px-6 md:px-8 mt-4">
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
                        className="w-full z-50"
                    />
                </View>
            }
            {
                modificar && rank &&

                <View className="w-full px-4 sm:px-6 md:px-8 mt-4 space-y-3">
                    <DropDown
                        setOpen={setOpenList}
                        open={openList}
                        items={items}
                        setItems={setItems}
                        value={userId as number}
                        setValue={setUserId as Dispatch<SetStateAction<number | null>>}
                        placeholder={`seleccione un ${rank.toLowerCase()}`}
                        isSearchable
                        className="w-full z-50"
                    />
                    {
                        userId && user &&
                        <View className="w-full space-y-3">
                            <Input className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 z-0" editable={false} value={user?.id.toString()} />
                            <Input className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 z-0" value={name} onChangeText={onChangeName} />
                            <Input className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 z-0" value={surname} onChangeText={onChangeSurname} />
                            <Input className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 z-0" value={email} onChangeText={onChangeEmail} />
                            <Input className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 z-0" value={password} onChangeText={onChangePassword} />
                            {
                                isAdmin(user as Admin) &&
                                <TouchableOpacity className="py-2" onPress={() => { onChangeOwner(!owner) }}>
                                    {owner && <Text className="text-center text-sm"> es Owner</Text>}
                                    {!owner && <Text className="text-center text-sm"> es Preceptor</Text>}
                                </TouchableOpacity>
                            }
                            {
                                user && isAlumno(user as Alumno) &&
                                <DropDown
                                    value={idCurso}
                                    setValue={onChangeIdCurso}
                                    items={cursos}
                                    open={openCurso}
                                    setOpen={setOpenCurso}
                                    className="w-full z-50"
                                />
                            }
                            <Button className="w-full bg-blue-600 py-3 rounded-xl text-white text-center" label="actualizar nuevos datos" onPress={ActualizarDatos}></Button>
                        </View>
                    }
                </View>
            }
        </SafeAreaView>

    )

}