import Button from "components/Button";
import { useState } from "react";
import { Text, View } from "react-native";

export default function About(){
    const[modificar,setModificar] = useState<Boolean>(true)
    const[borrar,setBorrar] = useState<Boolean>(false)
    const[agregar,setAgregar] = useState<Boolean>(false)
    
    function moverAModificar():void{
        setModificar(true)
        setBorrar(false)
        setAgregar(false)
    }
    function moverABorrar():void{
        setModificar(false)
        setBorrar(true)
        setAgregar(false)
    }
    function moverAAgregar():void{
        setModificar(false)
        setBorrar(false)
        setAgregar(true)
    }
    return (
        <View>
            <Button label="Modificar" onPress={moverAModificar}></Button>
            <Button label="Borrar" onPress={moverABorrar}></Button>
            <Button label="Agregar" onPress={moverAAgregar}></Button>
        </View>
    )
}