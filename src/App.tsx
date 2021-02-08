import React from 'react'
import './App.css'
import { Login } from './components/Login'
import { Main } from './components/Main'
import { User } from './constants'

const tempUsers: User[] = [
    {
        id: '1',
        createdAt: ' ',
        username: 'un1',
        password: 'pw1',
        gameData: '',
    },
]

const App: React.FC = () => {
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
    const [users, setUsers] = React.useState<User[]>([])
    const [user, setUser] = React.useState<User>()
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (users.length === 0) {
            fetch('https://60205a6546f1e40017803271.mockapi.io/users')
                .then((res) => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true)
                        setUsers(result)
                    },
                    (error) => {
                        setIsLoaded(true)
                        setError(error)
                    },
                )
        }
    }, [users])

    console.log('error', error)
    console.log('isLoaded', isLoaded)
    console.log('users', users)

    return isLoggedIn ? (
        <Main user={user} />
    ) : (
        <Login users={users} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
    )
}

export default App
