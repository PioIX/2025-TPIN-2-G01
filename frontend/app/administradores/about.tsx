import Button from "components/Button";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Admins, Estudiantes,Profesores } from "types";
import DropDownPicker from "react-native-dropdown-picker";
import dropDown from "components/dropDown";

export default function About() {
    const [modificar, setModificar] = useState<Boolean>(true)
    const [borrar, setBorrar] = useState<Boolean>(false)
    const [agregar, setAgregar] = useState<Boolean>(false)
    
    const [openCrud, setOpenCrud] = useState<boolean>(true)
    const [openUser, setOpenUser] = useState<boolean>(true)
    const [rank, setRank] = useState<string | null>(null);
    const [adminsLista,setAdminsLista] = useState<Admins | null>(null)
    const [preceptorLista,setPreceptorLista] = useState<Admins | null>(null)
    const [estudiantesLista,setEstudiantesLista] = useState<Estudiantes | null>(null)
    const [profesoresLista,setProfesoresLista] = useState<Profesores | null>(null)
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
                agregar &&
                <DropDownPicker
                    open={openCrud}
                    setOpen={setOpenCrud}
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
                agregar && rank == "Administrador" && 
                <DropDownPicker
                    open={openUser}
                    setOpen={setOpenUser}
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
                agregar && rank == "Profesor" && <p> soy Profesor</p>
            }
                        { 
                agregar && rank == "Preceptor" && <p> soy Preceptor</p>
            }            
            
        </SafeAreaView>
   
    )
    
}