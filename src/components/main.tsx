import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import { LoremIpsum } from 'lorem-ipsum'
import React from 'react'
import { View } from './View'

export interface Character {
    value: string
    display: 'initial' | 'correct' | 'wrong'
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

const debounce = (func: any, delay: number) => {
    let timerId: NodeJS.Timeout
    return (...args: any) => {
        clearTimeout(timerId)
        timerId = setTimeout(() => func(...args), delay)
    }
}

export const Main: React.FC = () => {
    const classes = useStyles()
    const [characters, setCharacters] = React.useState<Character[]>([])
    const [typedCharacters, setTypedCharacters] = React.useState<string>('')
    const [inputValue, setInputValue] = React.useState<string>('')

    const [time, setTime] = React.useState<number>(180)

    console.log('inputValue', inputValue)
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
                    newCharacters = characters.map((each, index) => {
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('keydown', event.key)
    }

    React.useEffect(() => {
        if (time !== 0) {
            const timer = setTimeout(() => {
                console.log('timeout')
                setTime(time - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    })

    React.useEffect(() => {
        if (Object.keys(characters).length === 0) {
            const paragraph = lorem.generateParagraphs(1)
            const characters: Character[] = Array.from(paragraph).map((each) => ({
                value: each,
                display: 'initial',
            }))

            setCharacters(characters)
        }
    }, [])

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Words Per Minute
                    </Typography>
                    <Typography variant="h6" className={classes.title}>
                        TIme: {time}
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                <Grid item>
                    <View characters={characters} />
                </Grid>
                <Grid item>
                    <TextField
                        value={inputValue}
                        label="Word"
                        id="wordInput"
                        variant="outlined"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}
