import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import React from 'react'
import { Character } from '../constants'

type ViewProps = {
    characters: Character[]
}

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        height: 100,
    },
    correct: {
        color: 'green',
    },
    wrong: {
        color: 'red',
    },
    currentWord: {
        textDecorationLine: 'underline',
    },
}))

export const View: React.FC<ViewProps> = ({ characters }) => {
    const classes = useStyles()

    return (
        <Grid item className={classes.container} xs={12}>
            {characters.map((value, index) => (
                <Typography
                    key={index}
                    component="span"
                    className={clsx(
                        value.display === 'wrong' && classes.wrong,
                        value.display === 'correct' && classes.correct,
                        value.currentWord && classes.currentWord,
                    )}
                >
                    {value.value}
                </Typography>
            ))}
        </Grid>
    )
}
