import React from 'react';
import { useGame } from '@/contexts/GameContext';
import './GameBoard.css';

export default function GameBoard() {
  const { state, dispatch } = useGame();
  const { board, usedQuestions } = state;

  const categories = Object.keys(board);

  if (categories.length === 0) {
    return <div className="board-loading">Loading board…</div>;
  }

  const numRows = board[categories[0]]?.length ?? 5;

  function handleSelect(question) {
    if (usedQuestions.has(question.id)) return;
    dispatch({ type: 'SELECT_QUESTION', payload: question });
  }

  return (
    <div
      className="game-board"
      style={{
        gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
        gridTemplateRows: `auto repeat(${numRows}, 1fr)`
      }}
    >
      {categories.map((cat) => (
        <div key={cat} className="category-header">
          {cat}
        </div>
      ))}
      {board[categories[0]].map((_, rowIndex) =>
        categories.map((cat) => {
          const question = board[cat][rowIndex];
          const used = usedQuestions.has(question.id);
          return (
            <button
              key={question.id}
              className={`question-cell${used ? ' used' : ''}`}
              onClick={() => handleSelect(question)}
              disabled={used}
              aria-label={used ? `${cat} ${question.points} — used` : `${cat} for ${question.points}`}
            >
              {used
                ? <img src="/wax-seal.png" className="wax-seal" alt="" aria-hidden="true" />
                : question.points}
            </button>
          );
        })
      )}
    </div>
  );
}
