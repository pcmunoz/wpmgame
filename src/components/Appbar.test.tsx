import { render } from '@testing-library/react'
import React from 'react'
import { Appbar } from './Appbar'

describe('Appbar component', () => {
    it('should render properly', async () => {
        const component = await render(<Appbar time={0} wordsPerMinute={0} username="Test" />)

        const { findByText } = component

        const time = findByText('Time: 0')

        expect(time).toBeTruthy()

        const wordsPerMinute = findByText('Current WPM: 0.00')

        expect(wordsPerMinute).toBeTruthy()

        const username = findByText('User: Test')

        expect(username).toBeTruthy()
    })
})
