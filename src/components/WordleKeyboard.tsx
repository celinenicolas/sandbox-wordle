export type WordleLetterState = 'unused' | 'correct' | 'misplaced' | 'notfound';

export type WordleResultset = {
    [k: string]: string;
};

export const WordleLetterStates = {
      Unused: 'unused',
      Correct: 'correct',
      Misplaced: 'misplaced',
      NotFound: 'notfound',
    } as const;

export interface KeyboardProps {
    layout: string[][];
    results: WordleResultset;
    onChange: (input: any) => void;
}

/**
 * Simplified keyboard with only letters and DEL/ENTER
 * @param props 
 * @returns 
 */
export const WordleKeyboard = ( props: KeyboardProps ) => {
    return (
        <div className='keyboardLayout'>
            {props.layout.map((keys, row) => (
                <div className='keyboardRow' key={row}>
                    {keys.map((key) => (
                        <button type='button' className={'key ' + props.results[key.toUpperCase()]} key={'key-' + key} 
                            aria-label=''
                            onClick={() => props.onChange(key)}>{key}</button>
                    ))}
                </div>
            ))}
        </div>
    );
}