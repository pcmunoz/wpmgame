import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
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
    const [time, setTime] = React.useState<number>(GAME_DURATION)
    const timeRef = React.useRef<any>(null)
    const [newGame, setNewGame] = React.useState<boolean>(false)
    const [newGameTimer, setNewGameTimer] = React.useState<number>(0)
    const [wordsTyped, setWordsTyped] = React.useState<number>(0)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [inputDisabled, setInputDisabled] = React.useState<boolean>(true)

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
            const correctCharacters = newCharacters.filter((each) => each.display === 'correct')
                .length
            const words = correctCharacters / 5

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
        const paragraph = lorem.generateParagraphs(1)
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
        setInputValue('')
    }

    const newGameClick = () => {
        setNewGameTimer(START_TIMER)
        setNewGame(true)
        newParagraph()
        setInputDisabled(false)
        clearInterval(timeRef.current)
    }

    React.useEffect(() => {
        if (newGameTimer > 0) {
            console.log('newGameTimer', newGameTimer)
            const timer = setTimeout(() => {
                setNewGameTimer(newGameTimer - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }

        if (newGameTimer === 0 && newGame) {
            setTime(GAME_DURATION)
            setNewGame(false)
            timeRef.current = setInterval(() => {
                setTime((past) => past - 1)
            }, 1000)
            inputRef.current?.focus()
        }
    }, [newGameTimer, newGame, inputRef])

    React.useEffect(() => {
        if (time === 0) {
            clearInterval(timeRef.current)
            setInputDisabled(true)
            setInputValue('')
        }
    })

    console.log(inputRef.current)

    return (
        <Container>
            <Appbar time={time} wordsPerMinute={wordsTyped / ((GAME_DURATION - time) / 60)} />
            <Grid container spacing={2}>
                <Grid item>
                    <View characters={characters} />
                </Grid>
                <Grid container item spacing={2}>
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
                    <Button variant="contained" onClick={newGameClick}>
                        New Game
                    </Button>
                    <Dialog open={newGameTimer > 0}>
                        <Paper>
                            <Typography>{`New Game starts in ${newGameTimer}`}</Typography>
                        </Paper>
                    </Dialog>
                </Grid>
            </Grid>
        </Container>
    )
}
