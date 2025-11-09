import type { WordleResultset } from "../../components/WordleKeyboard";

export const KeyboardLayouts = new Map<string, string[]>([
  ['QWERTY', ["q w e r t y u i o p", "a s d f g h j k l", "ENTER z x c v b n m DEL"]]
]);


export const getKeyBoardConfig = (layout?: string[]) => {
    
    let keyboardAr: string[][] = [];
    
    let map = layout ?? KeyboardLayouts.get('QWERTY');

    map?.forEach((row) => {
        let keys = row.split(" "); 
        keyboardAr.push(keys);
    });

    let keyboardArFlatKeys = keyboardAr.flat().filter(item => item !== "DEL" && item !== "ENTER");
        keyboardArFlatKeys = keyboardArFlatKeys.map(item => item.toUpperCase());
    const keyboardArFlat = Object.fromEntries(keyboardArFlatKeys.map((key) => [key, '']));

    return {
        'layout': keyboardAr,
        'keys' : keyboardArFlat as WordleResultset
    };
}