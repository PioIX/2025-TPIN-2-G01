import { Pressable, Text, View } from "react-native";
import { useAuth } from "app/context/AuthContext";
export default function About(){
    const { token,logout } = useAuth();

    return (
        <>
            <View>

            </View>
        </>
    )
}