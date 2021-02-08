import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import React from 'react'

export interface Character {
    value: string
    display: 'initial' | 'correct' | 'wrong'
}

type Appbar = {
    time: number
    wordsPerMinute?: number
    username: string
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

export const Appbar: React.FC<Appbar> = ({ time, wordsPerMinute, username }) => {
    const classes = useStyles()

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Words Per Minute
                </Typography>
                <Typography variant="h6" className={classes.title}>
                    User: {username}
                </Typography>
                <Typography variant="h6" className={classes.title}>
                    TIme: {time}
                </Typography>
                <Typography variant="h6" className={classes.title}>
                    Current WPM: {wordsPerMinute?.toFixed(2)}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
