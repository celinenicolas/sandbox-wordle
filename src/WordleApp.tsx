import { sanitizeString } from './lib/utils/Formatting';
import { GameStates, type GameState } from './lib/utils/Gaming';
import { WordleRow } from './components/WordleRow';
import { WordleKeyboard, WordleLetterStates, type WordleResultset } from './components/WordleKeyboard';
import './WordleApp.css'
import { useEffect, useState } from 'react';
import { getKeyBoardConfig, KeyboardLayouts } from './lib/utils/KeyboardLayouts';

interface GameProps {

    /** Length of the word to be found */
    wordLength: number;
    
    /** Maximum number of attempts allowed */
    maxAttempts: number;
    
    /** Storing each attempts */
    attempts?: string[];
}

type AttemptResult = {
    input: string;
    results: WordleResultset;
};

export const WordleApp = (props: GameProps) => {

   
    // Word settings
    const expectedWord = sanitizeString("horse", { capitalize: true });
    const wordLength = expectedWord.length;

    // Keyboard settings
    const keyboardConfig = getKeyBoardConfig( KeyboardLayouts.get('QWERTY') );
    
    // Defaults & States
    const defaultResultSet = {input: '', results: undefined} as unknown as AttemptResult;
    const [currentRow, setCurrentRow] = useState(0); 
    const [currentCell, setCurrentCell] = useState(0); 
    const [currentInput, setCurrentInput] = useState(''); 
    const [status, setStatus] = useState<GameState>(GameStates.NotStarted); 
    const [attempts, setAttempts] = useState<AttemptResult[]>(Array.from({ length: props.maxAttempts }, () => (defaultResultSet)));
    const [keys, setKeys] = useState(keyboardConfig.keys);
    const [validate, setValidate] = useState(false);


    // TODO: fix bug when mixing keyboard button + enter via keypress

    useEffect(() => {

        // Define the handler function
        const handleKeyDown = (event: { keyCode: number; key: any; }) => {
            if (event.keyCode === 8) {
                handleKeyInput("DEL");
            }

            else if (event.keyCode === 13) {
                handleKeyInput("ENTER");
            }

            else {
                handleKeyInput(event.key);
            }
        };

        // Add the event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentRow, currentCell, currentInput]); // Empty dependency array ensures this runs only once after the initial render

      
    const handleKeyInput = (input: any) => {
        
        // Reset validate 
        if (validate) {
            setValidate(false);
        }

        // Let's start this game
        if (status === GameStates.NotStarted) {
            setStatus(GameStates.Playing);
        }

        // Game is over
        else if (status !== GameStates.Playing) {
            return;
        }

        let keyChar = '';
        
        // Keyboard Click
        if (typeof input === 'string') {
            keyChar = input;
        }

        // Validate attempt
        if (keyChar === "ENTER") {
            validateInput(); // this will also update the cursor
            return;
        }

        // Delete previous
        if (keyChar === "DEL") {
            const cursorChange = deletePrevious();
            if (cursorChange < 0) 
                decreaseCursor();
            return;
        }

        // Check that key is an actual letter
        const regex = /^[a-zA-Z]+$/i;
        if ( keyChar?.length > 1 || !regex.test(keyChar) ) {
            return; // invalid input
        }

        // Prevent registering additional letters when reached word length
        if (currentCell >= wordLength-1 && currentInput.length === wordLength) {
            return; // already typed enough letters
        }
        

        // Update grid
        const cursorChange = updateGrid(keyChar);
        if (cursorChange > 0) 
            increaseCursor();
    };

    /**
     * Validate an attempt
     */
    const validateInput = () => {

        const attemptedWord = sanitizeString(currentInput, { capitalize: true })
        const attemptedWordAr = attemptedWord.split("");
        

        let keysUpdated = keys;
        let attemptsUpdated = attempts;
        let currentKeysUpdated = attemptsUpdated[currentRow].results;
        let correctLetters = 0;
        
        attemptedWordAr.forEach( (keyChar, index ) => {
            const foundAt = expectedWord.indexOf(keyChar);
            
            // Letter in correct position
            if (foundAt === index) {
                keysUpdated[keyChar] = WordleLetterStates.Correct;
                currentKeysUpdated[keyChar] = WordleLetterStates.Correct;
                correctLetters += 1;
            
            // Letter found, but not correct position
            } else if (foundAt > -1) {

                // Only update keyboard if not previously found
                if ( keysUpdated[keyChar] !== WordleLetterStates.Correct  ) {
                    keysUpdated[keyChar] = WordleLetterStates.Misplaced;
                }
                currentKeysUpdated[keyChar] = WordleLetterStates.Misplaced;
                
            // Not found
            } else if (foundAt < 0 ) {
                keysUpdated[keyChar] = WordleLetterStates.NotFound;
                currentKeysUpdated[keyChar] = WordleLetterStates.NotFound;
            }

            
        });

        // Update keyboard and grid
        attemptsUpdated[currentRow].results = currentKeysUpdated;
        setKeys(keysUpdated);
        setAttempts(attemptsUpdated);
        setValidate(true);

        // We won!
        if (correctLetters === wordLength && attemptedWord === expectedWord) {
            setStatus(GameStates.Winner);
        }

        // Go to next attempt
        else if (currentRow < props.maxAttempts-1) {  
            setCurrentRow(currentRow+1);
            setCurrentCell(0);
            setCurrentInput('');
            setStatus(GameStates.Playing);
        
        // Game over
        } else {
            setStatus(GameStates.Loser);
        }
        
    }

    /**
     * Update grid with the latest input 
     * @param keyChar 
     * @returns 
     */
    const updateGrid = (keyChar: string) => {
        if (currentRow < props.maxAttempts) {
            let newInput = currentInput + keyChar;
                newInput = sanitizeString(newInput, { capitalize: true });

            let attemptsUpdated = attempts;
                attemptsUpdated[currentRow] = {
                    'input' : newInput,
                    'results' : newInput.split("").map((key) => [key, '']) as unknown as WordleResultset
                };

            setCurrentInput(newInput);
            setAttempts(attemptsUpdated);

            return 1;
        }

        return 0;
    };

    /**
     * Delete previous character
     * @returns 
     */
    const deletePrevious = () => {
        if (currentRow  === 0 && currentCell === 0) {
            return 0;
        }

        if (currentInput === '') {
            return 0;
        }

        let newInput = currentInput.slice(0, -1); 

        let attemptsUpdated = attempts;
            attemptsUpdated[currentRow] = {
                'input' : newInput,
                'results' : newInput.split("").map((key) => [key, '']) as unknown as WordleResultset
            };
        
            setCurrentInput(newInput);
            setAttempts(attemptsUpdated);

        return -1;
    };

    /**
     * Incerase cursor position
     */
    const increaseCursor = () => {
        if (currentRow < props.maxAttempts-1 && currentCell < wordLength-1) {
            setCurrentCell(currentCell+1);
        }
    }

    /**
     * Decrease cursor position
     * only within the current attempt's row
     */
    const decreaseCursor = () => {
        if (currentCell > 0) {
            setCurrentCell(currentCell-1);
        }
    }

    return (
        <>
            <h1>Wordle</h1>
            <section className={'grid'}>
                {Array.from({ length: props.maxAttempts }).map((_, index) => (
                    <WordleRow key={index} row={index+1} 
                        expectedWord={expectedWord} 
                        input={attempts[index].input}
                        results={attempts[index].results}
                        isActive={index === currentRow}
                        showResults={validate}
                    />
                ))}
            </section>
            {(status === GameStates.Playing || status === GameStates.NotStarted) && (
                <section className={'keyboard'}>
                    <WordleKeyboard onChange={handleKeyInput} layout={keyboardConfig.layout} results={keys} />
                </section>
            )}
            {(status === GameStates.Loser) && (
                <p>:-( Better luck next time... <br />The word you were looking for was <strong>{expectedWord}</strong>.</p>
            )}
            {(status === GameStates.Winner) && (
                <p>Congratulations! You found it.</p>
            )}
        </>
    );
}