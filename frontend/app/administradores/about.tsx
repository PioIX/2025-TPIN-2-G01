import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import Button from "components/Button";
import Input from "components/input";
import DropDown from "components/dropDown";
import useFetch from 'hooks/useFetch';
import { SafeAreaView } from "react-native-safe-area-context";
import type { Usuario, Owner, Preceptor, Profesor, Alumno, items, TipoUsuario, email, Admin } from "types";
import { useAuth } from "app/context/AuthContext";
import { RotateOutUpLeft } from "react-native-reanimated";
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
    const { token, logout } = useAuth();

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

    const { fetchData: actualizarDatos } = useFetch()
    const { fetchData: subirUsuario } = useFetch()
    const { fetchData: borrarDatos } = useFetch()
    const { fetchData: alumnos } = useFetch<Alumno[]>()
    const { fetchData: profesores } = useFetch<Profesor[]>()
    const { fetchData: owners } = useFetch<Owner[]>()
    const { fetchData: preceptores } = useFetch<Preceptor[]>()
    const { fetchData: listaCursos } = useFetch<items[]>()

    const ownerFetch = async () => {
            const lista = await llenarOwner()
            setOwnerLista(lista);
        }
        // Preceptores (rango "P") 
        const preceptorFetch = async () => {
            const lista = await llenarAPreceptor()
            setPreceptorLista(lista);
        }
        // Estudiantes
        const alumnoFetch = async () => {
            const lista = await llenarAlumnos()
            setAlumnoLista(lista);
        }
        // Profesores
        const profesorFetch = async () => {
            const lista = await llenarProfesores()
            setProfesoresLista(lista);
        }
        const cursosFetch = async () => {
            const lista = await llenarCursos()
            setCursos(lista)
        }


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
        ownerFetch()
        preceptorFetch()
        alumnoFetch()
        profesorFetch()
        cursosFetch()
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
    async function llenarAPreceptor(): Promise<Preceptor[]> {
        const data = await preceptores({
            url: 'http://localhost:4000/getAllPreceptores',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
            },
        })
        return data as Preceptor[]
    }
    async function llenarOwner(): Promise<Owner[]> {
        const data = await owners({
            url: 'http://localhost:4000/getAllOwner',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
            },
        })
        return data as Owner[]
    }
    async function llenarProfesores(): Promise<Profesor[]> {
        const data = await profesores({
            url: 'http://localhost:4000/getAllProfesores',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
            },
        })
        return data as Profesor[]
    }
    async function llenarAlumnos(): Promise<Alumno[]> {
        const data = await alumnos({
            url: 'http://localhost:4000/getAllAlumnos',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
            },
        })
        return data as Alumno[]
    }
    async function llenarCursos(): Promise<items[]> {
        const data = await listaCursos({
            url: 'http://localhost:4000/getAllCursos',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
            },
        })
        return data as items[]
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
    async function subirDatos(): Promise<void> {
        const datos = construirDatos()
        //if (!errorHandler(datos)) {}
        const userData = await subirUsuario({
            url: 'http://localhost:4000/agregarUsuarios',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
                body: JSON.stringify(datos)
            },
        });
    }
    async function ActualizarDatos(): Promise<void> {
        const datos = construirDatos()
        const userData = await actualizarDatos({
            url: 'http://localhost:4000/actualizarUsuarios',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
                body: JSON.stringify(datos)
            },
        });
        //if (!errorHandler(datos)) {}
    }
    async function borrarUsuario(): Promise<void> {
        const data = construirDatos()
        const userData = await borrarDatos({
            url: 'http://localhost:4000/borrarUsuarios',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Persona: 'owner',
                body: JSON.stringify(data)
            },
        });
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View>

                <Button label="Modificar" onPress={moverAModificar}></Button>
                <Button label="Borrar" onPress={moverABorrar}></Button>
                <Button label="Agregar" onPress={moverAAgregar}></Button>

            </View>
            {
                agregar &&
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
                agregar && rank &&
                <View>
                    <Input value={name} onChangeText={onChangeName} placeholder="nombre" />
                    <Input value={surname} onChangeText={onChangeSurname} placeholder="apellido" />
                    <Input value={email} onChangeText={onChangeEmail} placeholder="napellido@pioix.edu.ar" />
                    <Input value={password} onChangeText={onChangePassword} placeholder="contraseña" />
                    {
                        isAdmin(user as Admin) &&
                        <TouchableOpacity onPress={() => { onChangeOwner(!owner) }}>
                            {owner && <Text> es Owner</Text>}
                            {!owner && <Text> es Preceptor</Text>}
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
                        />
                    }
                    <Button label="subir nuevos datos" onPress={subirDatos}></Button>
                </View>
            }

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
                                user && isAlumno(user as Alumno) &&
                                <DropDown
                                    value={idCurso}
                                    setValue={onChangeIdCurso}
                                    items={cursos}
                                    open={openCurso}
                                    setOpen={setOpenCurso}
                                />
                            }
                            <Button label="actualizar nuevos datos" onPress={ActualizarDatos}></Button>
                        </View>
                    }
                </View>
            }
        </SafeAreaView>

    )

}
