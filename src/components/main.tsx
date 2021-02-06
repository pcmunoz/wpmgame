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
}))

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4,
    },
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
})

export const Main: React.FC = () => {
    const classes = useStyles()
    const words: string[] = lorem.generateParagraphs(7).split(' ')

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        id="filled-multiline-static"
                        label="Words"
                        multiline
                        rows={10}
                        defaultValue={words.join(' ')}
                        variant="filled"
                        contentEditable={false}
                    />
                </Grid>
                <Grid item>
                    <TextField label="Word" id="wordInput" variant="filled" />
                </Grid>
            </Grid>
        </Container>
    )
}
