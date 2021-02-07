import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { LoremIpsum } from 'lorem-ipsum'
import React from 'react'
import { Appbar } from './Appbar'
import { View } from './View'

export interface Character {
    value: string
    display: 'initial' | 'correct' | 'wrong'
    currentWord: boolean
}

interface GameData {
    characters: string
    typedCharacters: string
    timeLeft: number
    wordsTyped: number
    correctCharacters: number
    errorCount: number
    wordsPerMinute: number
    completion: number
    duration: number
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    correct: {
        color: 'green',
    },
    wrong: {
        color: 'red',
    },
}))

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 7,
        min: 6,
    },
    wordsPerSentence: {
        max: 7,
        min: 6,
    },
})

export const GAME_DURATION = 10
export const START_TIMER = 3

export const Main: React.FC = () => {
    const classes = useStyles()
    const [characters, setCharacters] = React.useState<Character[]>([])
    const [typedCharacters, setTypedCharacters] = React.useState<string>('')
    const [inputValue, setInputValue] = React.useState<string>('')
    const [timeLeft, setTimeLeft] = React.useState<number>(GAME_DURATION)
    const timeRef = React.useRef<any>(null)
    const [newGame, setNewGame] = React.useState<boolean>(false)
    const [newGameTimer, setNewGameTimer] = React.useState<number>(0)
    const [wordsTyped, setWordsTyped] = React.useState<number>(0)
    const [correctCharacters, setCorrectCharacters] = React.useState<number>(0)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [inputDisabled, setInputDisabled] = React.useState<boolean>(true)
    const [errorCount, setErrorCount] = React.useState<number>(0)
    const [gameData, setGameData] = React.useState<Partial<GameData>>()

    const [resultsDialogOpen, setResultsDialogOpen] = React.useState<boolean>(false)

    const wordsPerMinute =
        timeLeft !== GAME_DURATION
            ? wordsTyped / ((GAME_DURATION - timeLeft) / 60)
            : wordsTyped / (GAME_DURATION / 60)

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const input = event.currentTarget.value
            const val = typedCharacters + input
            const currentChar = val.length - 1

            // check for backspace action which empties input
            if (input.length === 0 && typedCharacters.length > 0 && inputValue.length === 0) {
                return
            }

            let newCharacters = [...characters]
            let hasWrong = characters.slice(0, currentChar).some((each) => each.display === 'wrong')

            // at the start of paragraph
            if (currentChar < 0) {
                newCharacters = characters.map((each) => {
                    return {
                        ...each,
                        display: 'initial',
                    }
                })
            } else {
                // latest character is not equal
                if (val[currentChar] !== characters[currentChar].value || hasWrong) {
                    setErrorCount((past) => past + 1)
                    hasWrong = true
                    newCharacters = characters.map((each, index) => {
                        if (currentChar <= index) {
                            return {
                                ...each,
                                display: 'wrong',
                            }
                        }
                        return each
                    })
                } else {
                    // all is true

                    let currentWord = true
                    newCharacters = characters.map((each, index) => {
                        if (val[currentChar] === ' ') {
                            // all correct before current index
                            if (currentChar >= index) {
                                return {
                                    ...each,
                                    display: 'correct',
                                    currentWord: false,
                                }
                            } else {
                                // not part of word if space
                                if (each.value === ' ' && currentWord) {
                                    currentWord = false
                                }

                                return {
                                    ...each,
                                    display: 'initial',
                                    currentWord,
                                }
                            }
                        }
                        if (currentChar >= index) {
                            return {
                                ...each,
                                display: 'correct',
                            }
                        }
                        return {
                            ...each,
                            display: 'initial',
                        }
                    })
                }
            }

            // GROSS WPM FORMULA
            const correctChars = newCharacters.filter((each) => each.display === 'correct').length

            const words = correctChars / 5

            setCorrectCharacters(correctChars)
            setWordsTyped(words)

            setCharacters(newCharacters)
            if (input.includes(' ') && !hasWrong) {
                setInputValue('')
                setTypedCharacters(val)
            } else {
                setInputValue(input)
            }
        },
        [characters, typedCharacters, inputValue],
    )

    const newParagraph = () => {
        const paragraph = 'test test' // lorem.generateParagraphs(1)
        let firstWord = true
        const characters: Character[] = Array.from(paragraph).map((each) => {
            if (each === ' ' && firstWord) {
                firstWord = false
            }
            return {
                value: each,
                display: 'initial',
                currentWord: firstWord,
            }
        })

        setCharacters(characters)
        setTypedCharacters('')

        setCorrectCharacters(0)
        setInputValue('')
    }

    const newGameClick = () => {
        setNewGameTimer(START_TIMER)
        setTimeLeft(GAME_DURATION)
        setErrorCount(0)
        setNewGame(true)
        newParagraph()
        setInputDisabled(false)
        clearInterval(timeRef.current)
    }

    const handleResultsDialogClose = () => {
        setResultsDialogOpen(false)
    }

    React.useEffect(() => {
        if (newGameTimer > 0) {
            const timer = setTimeout(() => {
                setNewGameTimer(newGameTimer - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }

        if (newGameTimer === 0 && newGame) {
            setNewGame(false)
            timeRef.current = setInterval(() => {
                setTimeLeft((past) => past - 1)
            }, 1000)
            inputRef.current?.focus()
        }
    }, [newGameTimer, newGame, inputRef])

    React.useEffect(() => {
        if (
            timeLeft === 0 ||
            (characters.length === correctCharacters && timeLeft !== GAME_DURATION)
        ) {
            clearInterval(timeRef.current)
            setInputDisabled(true)
            setInputValue('')
            setWordsTyped(0)
            setTimeLeft(GAME_DURATION)
            setGameData({
                timeLeft,
                errorCount,
                wordsTyped,
                correctCharacters,
                characters: characters.map((each) => each.value).join(''),
                typedCharacters,
                wordsPerMinute:
                    timeLeft !== GAME_DURATION
                        ? wordsTyped / ((GAME_DURATION - timeLeft) / 60)
                        : wordsTyped / (GAME_DURATION / 60),
                completion: correctCharacters / characters.length,
                duration: GAME_DURATION,
            })
            setResultsDialogOpen(true)
        }
    }, [timeLeft, characters, correctCharacters, errorCount, wordsTyped, typedCharacters])

    console.log('gameData', gameData)

    return (
        <Container>
            <Appbar time={timeLeft} wordsPerMinute={wordsPerMinute} />
            <Grid container spacing={2}>
                <View characters={characters} />
                <Grid container item>
                    <Grid item xs>
                        <TextField
                            autoComplete="off"
                            type="text"
                            value={inputValue}
                            label="Word"
                            id="wordInput"
                            variant="outlined"
                            onChange={handleChange}
                            inputRef={inputRef}
                            disabled={inputDisabled}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs>
                        <Button variant="contained" onClick={newGameClick}>
                            New Game
                        </Button>
                    </Grid>
                    <Dialog open={newGameTimer > 0}>
                        <DialogContent>
                            <Typography>{`New Game starts in ${newGameTimer}`}</Typography>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={resultsDialogOpen} onClose={handleResultsDialogClose}>
                        <DialogTitle>Results</DialogTitle>
                        <DialogContent>
                            <Typography>WPM: {gameData?.wordsPerMinute?.toFixed(2)}</Typography>
                            <Typography>
                                Completion: {((gameData?.completion || 0) * 100).toFixed(2)}%
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleResultsDialogClose} color="primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Container>
    )
}
