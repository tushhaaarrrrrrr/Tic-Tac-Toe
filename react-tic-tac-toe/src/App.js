import './App.css';
import Board from "./Board";
import Square from "./Square";
import {useState, useEffect} from 'react';
import React from 'react';

const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesThatAre = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      });
    };
    const emptyIndexes = squares
      .map((square,index) => square === null ? index : null)
      .filter(val => val !== null);
    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;
    if (playerWon) {
      setWinner('x');
    }
    if (computerWon) {
      setWinner('o');
    }
    if (!playerWon && !computerWon && emptyIndexes.length === 0) {
      setWinner('draw');
    }
    const putComputerAt = index => {
      if (squares[index] === null) {
        let newSquares = [...squares]; // use spread operator to create a new array
        newSquares[index] = 'o';
        setSquares(newSquares);
      }
    };
    if (isComputerTurn && !winner) { // check if there's no winner yet
      const winingLines = linesThatAre('o', 'o', null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
        setTimeout(() => {
          putComputerAt(winIndex);
        }, 2000);
        return;
      }    
      const linesToBlock = linesThatAre('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockIndex);
        return;
      }
      const linesToContinue = linesThatAre('o', null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }
      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      setTimeout(() => {
        putComputerAt(randomIndex);
      }, 500);
    }
    if (!!winner && !isResetting) { // check if there's a winner and game is not resetting
      setIsResetting(true);
      updateScore(); // update score before resetting
      setTimeout(() => {
        setSquares(defaultSquares());
        setWinner(null);
        setIsResetting(false);
      }, 8000); // Reset game after 8 seconds
    };
  }, [squares, winner, isResetting]);


  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn && squares[index] === null) { // check if square is not already clicked
      let newSquares = [...squares]; // create a new array using spread operator
      newSquares[index] = 'x';
      setSquares(newSquares);
    }
  }

  function updateScore() {
    const newScore = { ...score };
    if (winner === 'x') {
      newScore.X += 1;
    } else if (winner === 'o') {
      newScore.O += 1;
    }
    setScore(newScore);
  }

  return (
    <main>
      <header className='header'>
        Tic-Tac-Toe
      </header>
      <div className="scoreboard">
        <div className="score">
          <span className="score-label">Wins : </span>
          <span className="score-value">{Number(score.X)}</span>
        </div>
        <div className="score">
          <span className="score-label">Losses : </span>
          <span className="score-value">{Number(score.O)}</span>
        </div>
      </div>
      <Board>
        {squares.map((square,index) =>
          <Square
            x={square==='x'?1:0}
            o={square==='o'?1:0}
            onClick={() => handleSquareClick(index)} />
        )}
      </Board>
      {!!winner && winner === 'x' && (
        <div className="result green">
          You win!
        </div>
      )}
      {!!winner && winner === 'o' && (
        <div className="result red">
          You lose!
        </div>
      )}
      {!!winner && winner === 'draw' && (
        <div className="result draw">
          It's a draw!
        </div>
      )}
      {!!isResetting && (
        <div className="reset">
          Restarting soon, sit tight!
        </div>
      )}

    </main>
  );
}

export default App;