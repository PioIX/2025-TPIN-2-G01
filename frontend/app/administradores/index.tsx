import { View,Text } from "react-native"
import Input from "components/input"
import useFetch from "hooks/useFetch";
import { useEffect } from "react"
export default function AdministradorHome(){
    const { data, error, loading, fetchData } = useFetch();
    useEffect(()=>{},[])
    return (
    <View>
        <Text>hola</Text>
        <Input className="w-full p-3 rounded-l border border-gray-800 bg-white text-black mb-6"></Input>
    </View>)
}
