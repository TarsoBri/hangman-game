import './App.css';
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from './data/words.jsx';

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import End from './components/End';

const stages = [
    { id: 1, name: 'start' },
    { id: 2, name: 'game' },
    { id: 3, name: 'end' },
];

const gussesQty = 3;

function App() {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);

    const [pickedCategory, setPickedCategory] = useState('');
    const [pickedWord, setPickedWord] = useState('');
    const [letters, setLetters] = useState();
    console.log(pickedCategory, pickedWord, letters);

    const [guessedLetters, setGussedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(gussesQty);
    const [score, setScore] = useState(0);

    const pickedWordAndCategory = useCallback(() => {
        //pick category
        const categories = Object.keys(words);
        const category =
            categories[
                Math.floor(Math.random() * Object.keys(categories).length)
            ];
        // pick word
        const word =
            words[category][
                Math.floor(Math.random() * words[category].length)
            ].toLowerCase();

        return { category, word };
    }, [words]);

    // Start Game
    const startGame = useCallback(() => {
        // Clear all letters
        clearLetterStates();

        // pick word and category
        const { category, word } = pickedWordAndCategory();

        // create an array of letters
        let wordLetters = word.split('');

        // fill states

        setPickedCategory(category);
        setPickedWord(word);
        setLetters(wordLetters);

        setGameStage(stages[1].name);
    }, [pickedWordAndCategory]);

    // Process the letter input
    const verifyLetter = (letter) => {
        const normalizedLetter = letter.toLowerCase();

        // Checkif letter has already been utilized
        if (
            guessedLetters.includes(normalizedLetter) ||
            wrongLetters.includes(normalizedLetter)
        ) {
            return;
        }
        // Push guessed letter or remove a guess
        if (letters.includes(normalizedLetter)) {
            setGussedLetters((actualGuessedLetters) => [
                ...actualGuessedLetters,
                normalizedLetter,
            ]);
        } else {
            setWrongLetters((actualWrongLetters) => [
                ...actualWrongLetters,
                normalizedLetter,
            ]);

            setGuesses((actualGuesses) => actualGuesses - 1);
        }

        console.log(guessedLetters);
        console.log(wrongLetters);
    };

    const clearLetterStates = () => {
        setGussedLetters([]);
        setWrongLetters([]);
    };

    // Check if guesses end
    useEffect(() => {
        if (guesses <= 0) {
            // reset all states
            clearLetterStates();

            setGameStage(stages[2].name);
        }
    }, [guesses]);

    // Check win condition
    useEffect(() => {
        const uniqueLetters = [...new Set(letters)];
        //Win condition
        if (guessedLetters.length === uniqueLetters.length) {
            // add score win
            setScore((actualScore) => (actualScore += 100));

            // RESTAR game
            startGame();
        }
    }, [guessedLetters, letters, startGame]);

    // Restarts the game
    const retry = () => {
        setScore(0);
        setGuesses(gussesQty);

        setGameStage(stages[0].name);
    };

    return (
        <div className="App">
            {gameStage === 'start' && <StartScreen startGame={startGame} />}
            {gameStage === 'game' && (
                <Game
                    verifyLetter={verifyLetter}
                    pickedCategory={pickedCategory}
                    pickedWord={pickedWord}
                    letters={letters}
                    guessedLetters={guessedLetters}
                    wrongLetters={wrongLetters}
                    guesses={guesses}
                    score={score}
                />
            )}
            {gameStage === 'end' && <End retry={retry} score={score} />}
        </div>
    );
}

export default App;
