import Button from "components/Button";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";

export default function About() {
    const [modificar, setModificar] = useState<Boolean>(true)
    const [borrar, setBorrar] = useState<Boolean>(false)
    const [agregar, setAgregar] = useState<Boolean>(false)

    const [opem, setOpen] = useState<Boolean>(false)
    const [rank, setRank] = useState<string | null>();

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
                    open={open}
                    value={rank}
                    items={["Alumno", "Administrador", "Profesor", "Preceptor"]}
                    setOpen={setOpen}
                    setValue={setRank}
                    placeholder="elegi un cargo"
                />
            }
            { 
                agregar && rank == "Alumno" && <p> soy Alumno</p>
            }
                        { 
                agregar && rank == "Administrador" && <p> soy Administrador</p>
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