import { sanitizeString } from "../lib/utils/Formatting";
import type { WordleResultset } from "./WordleKeyboard";

interface WordleRowProps {

    /** Expected word */
    expectedWord: string;

    /** What row is this one */
    row?: number;

    /** Is it the row for the current attempt */
    isActive: boolean;

    /** Length of the word to be found */
    wordLength?: number;

    /** Input from the user */
    input: string;

    /** Keyboard results */
    results?: WordleResultset;

    /** Show results for the row */
    showResults: boolean;


}

export const WordleRow = (props: WordleRowProps) => {
    const wordLength = props.expectedWord.length;

    // We need at least 2 characters
    if (wordLength < 2) {
        return;
    }

    // Sanitize
    const rowInput = sanitizeString(props.input, { capitalize: true });

    const currentInputAr = rowInput.split("");
    const doCheck = props.showResults && props.results && rowInput.length === props.expectedWord.length;

    // Check if letter is found
    const getLetterStatus = (letter:string, position: number): string => {

        if (!letter || !props.results)
            return '';

        return props.results[letter];
    }

    return (
        <p className={'row row-' + props.row}>
            {Array.from({ length: wordLength }).map((_, index) => (
                <span key={index} className={`cell ` + (doCheck && getLetterStatus(currentInputAr[index], index))}>{currentInputAr[index]}</span>
            ))}
        </p>
    );
}