import DropDownPicker from "react-native-dropdown-picker";
import { selectProps } from "types";

export default function DropDown({open,setOpen,initialValue,setValue,items,setItems,max,min,isDisabled,isSearchable,maxHeigth}:selectProps){
    return(
        <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={initialValue}
            setValue={setValue}
            items={items}
            setItems={setItems}
            min={min}
            max={max}
            maxHeight = {maxHeigth}
            disabled={isDisabled || false}
            searchable={isSearchable || false}

        />
    )
}