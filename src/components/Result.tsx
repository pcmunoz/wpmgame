import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'
import { GameData } from '../constants'

type ResultProps = {
    results: Partial<GameData>[]
}

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
})

export const Result: React.FC<ResultProps> = ({ results }) => {
    const classes = useStyles()

    if (results.length === 0) return null

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell align="right">WPM</TableCell>
                        <TableCell align="right">Completion</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                Result {index + 1}
                            </TableCell>
                            <TableCell align="right">{row.wordsPerMinute?.toFixed(2)}</TableCell>
                            <TableCell align="right">{(row?.completion || 0) * 100}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableCell align="right" colSpan={2}>
                        Average WPM
                    </TableCell>
                    <TableCell align="right">
                        {results.reduce((total, each) => total + (each?.wordsPerMinute || 0), 0) /
                            results.length}
                    </TableCell>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
