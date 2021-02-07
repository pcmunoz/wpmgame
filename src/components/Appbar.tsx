import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import React from 'react'

export interface Character {
    value: string
    display: 'initial' | 'correct' | 'wrong'
}

type Appbar = {
    time: number
    wordsPerMinute?: number
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

export const Appbar: React.FC<Appbar> = ({ time, wordsPerMinute }) => {
    const classes = useStyles()

    return (
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
                <Typography variant="h6" className={classes.title}>
                    Average WPM: {wordsPerMinute?.toFixed(2)}
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}
