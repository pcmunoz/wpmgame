import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import React from 'react'
import { Character } from './Main'

type ViewProps = {
    characters: Character[]
}

const useStyles = makeStyles((theme) => ({
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
        <>
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
        </>
    )
}
