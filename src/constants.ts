export const GAME_DURATION = 180
export const START_TIMER = 3

export interface Character {
    value: string
    display: 'initial' | 'correct' | 'wrong'
    currentWord: boolean
}

export interface GameData {
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

export interface User {
    id: string
    createdAt: string
    username: string
    password: string
    gameData: any
}