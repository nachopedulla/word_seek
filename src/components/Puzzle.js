import React, { useEffect, useState } from 'react';
import Box from './Box';
import * as Config from '../config/WordsAndLetters'
import './Components.css';

const Puzzle = () => {

    const [words, setWords] = useState([])
    const [squares, setSquares] = useState([])

    useEffect(() => {
        setWords(getWords())
    }, [])

    function getLetter () {
        return Config.ALPHABET[Math.floor(Math.random() * Config.ALPHABET.length)]
    }

    function getWord () {
        let word = {}
        word['word'] = Config.WORDS[Math.floor(Math.random() * Config.WORDS.length)]
        word['position'] = []
        return word
    }
    
    function getSquares() {
        let squares = []
        for (let i = 0; i < 504; i++) {
            squares.push({id: i, character: getLetter(), active: false})
        }
        return squares;
    }
    
    function getWords() {
        let words = []
        for (let i = 12; i > 0; i--) {
            words.push(getWord())
        }
        return words;
    }

    function getCellNumber () { return Math.floor(Math.random() * 504) }

    function getCell(cells) {
        let cell = getCellNumber()
        while (cells.some(usedCell => usedCell === cell)) {
            cell =  getCellNumber()
        }
        return cell
    }

    function getMovementCells(word, cell, cells) {
        const column = (cell < 14) ? cell + 1 : (cell) % 14 + 1
        const line = Math.floor(cell / 14) + 1
        let attemps = 0
        while (true) {      
            // limite de busqueda para esta celda
            if (attemps === 6) {
                return []
            }
            let requiredCells = [cell]   
            const movement = Config.MOVEMENTS[Math.floor(Math.random() * Config.MOVEMENTS.length)]
            switch (movement) {
                case 'LEFT': 
                    if (column >= word.length) {
                        for (let index = 1; index < word.length ; index++) {
                            requiredCells.push(cell - index)
                        }
                        if (!cells.some(usedCell => requiredCells.some(requiredCell => requiredCell === usedCell))) {
                            return requiredCells
                        }
                    }
                    break;
                case 'RIGHT': 
                    if (14 - column >= word.length) {
                        for (let index = 1; index < word.length; index++) {
                            requiredCells.push(cell + index)
                        }
                    if (!cells.some(usedCell => requiredCells.some(requiredCell => requiredCell === usedCell))) {
                        return requiredCells
                    }
                    break;
                }
                case 'UP': 
                    if (line - word.length >= 0) {
                        for (let index = 1; index < word.length; index++) {
                            requiredCells.push(cell + (index * 14 * -1))
                        }
                    if (!cells.some(usedCell => requiredCells.some(requiredCell => requiredCell === usedCell))) {
                        return requiredCells
                    }
                    break
                }
                case 'DOWN': 
                    if (36 - line >= word.length) {
                        for (let index = 1; index < word.length; index++) {
                            requiredCells.push(cell + (index * 14))
                        }
                    if (!cells.some(usedCell => requiredCells.some(requiredCell => requiredCell === usedCell))) {
                        return requiredCells
                    }
                    break
                }
            }
            attemps ++
        }
    }


    function saveWords() {
        //const squares = getSquares()
        let cells = []
        let auxSquares = getSquares()
        let auxWords = [...words]

        for (let i in auxWords) {
            let requiredCells = []
            let word = auxWords[i]
            while (requiredCells.length === 0) {
                const cell = getCell(cells)        
                requiredCells = getMovementCells(word.word, cell, cells)
            }
            cells = [...cells, ...requiredCells]
            word.position = requiredCells
            auxWords[i] = word
            for (let index in word.word) {
                auxSquares[requiredCells[index]].character = word.word[index]
            }
        }

        setSquares(auxSquares)
        setWords(auxWords)
    }
   
    const clickHandler = (id) => {
        let square = squares[id]
        square['active'] = square.active ? false : true
        let auxSquares = [...squares]
        auxSquares[id] = square
        setSquares(auxSquares)
    }

    const showWords= () => {
        let auxSquares = [...squares]
        words.forEach(({position}) => {
            position.forEach(position => {
                squares[position].active = true
            });
        })
        setSquares(auxSquares)
    }

    const changeWords = () => {
        setWords(getWords())
        setSquares([])
    }

    return (
        <div>
            <p className='title'>SOPA DE LETRAS</p>
            <div className='wordContainer'>
                <ul className='wordList'>
                    {words.map(({word}) => <li>{word}</li>)}
                </ul>
                <div className='buttons'>
                    <button className='button' onClick={saveWords}>INICIAR</button>
                    <button className='button' onClick={changeWords}>CAMBIAR</button>
                    <button className='button' onClick={showWords} disabled={squares.length === 0}>MOSTRAR</button>
                </div>
            </div>
            <div className='puzzle'>
                {squares.map(({id, active, character}) => <Box id={id} character={character} active={active} clickHandler={clickHandler}/>)}
            </div>
        </div>
    )
}

export default Puzzle