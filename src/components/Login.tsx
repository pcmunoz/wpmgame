import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React from 'react'
import { User } from '../App'

type LoginProps = {
    users: User[]
    setUser: (value: User) => void
    setIsLoggedIn: (value: boolean) => void
}

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
    },
}))

export const Login: React.FC<LoginProps> = ({ users, setIsLoggedIn, setUser }) => {
    const classes = useStyles()
    const [usernameValue, setUsernameValue] = React.useState<string>('')
    const [passwordValue, setPasswordValue] = React.useState<string>('')
    const [isError, setIsError] = React.useState<boolean>(false)

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameValue(event.currentTarget.value)
    }
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.currentTarget.value)
    }
    const handleLoginClick = () => {
        const user = users.find(
            (each) => each.username === usernameValue && each.password === passwordValue,
        )

        if (user) {
            setIsLoggedIn(true)
            setUser(user)
        } else {
            setIsError(true)
        }
    }

    const handleKeypress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            handleLoginClick()
            ev.preventDefault()
        }
    }

    return (
        <Container className={classes.container} maxWidth="xs">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    WPM Game
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                size="small"
                                variant="outlined"
                                onChange={handleUsernameChange}
                                error={isError}
                                onKeyPress={handleKeypress}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl error={isError} fullWidth>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    size="small"
                                    type="password"
                                    variant="outlined"
                                    onChange={handlePasswordChange}
                                    error={isError}
                                    aria-describedby="component-error-text"
                                    onKeyPress={handleKeypress}
                                />
                                <FormHelperText id="component-error-text" error={isError}>
                                    {isError ? 'Username and password is invalid.' : ''}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        color="secondary"
                        fullWidth
                        type="submit"
                        variant="contained"
                        onClick={handleLoginClick}
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}
