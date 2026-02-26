import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Papa from 'papaparse';

const GameContext = createContext();

const initialState = {
  board: {},
  usedQuestions: new Set(),
  currentQuestion: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_BOARD': {
      const board = {};
      action.payload.forEach((row) => {
        const cat = row.Category?.trim();
        const points = parseInt(row.Points, 10);
        if (!cat || isNaN(points)) return;
        if (!board[cat]) board[cat] = [];
        board[cat].push({
          id: String(row.ID).trim(),
          category: cat,
          points,
          clue: row.Question?.trim(),
          answer: row.Answer?.trim(),
        });
      });
      // Sort each category's questions by points ascending
      Object.values(board).forEach((qs) => qs.sort((a, b) => a.points - b.points));
      return { ...state, board };
    }
    case 'SELECT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'DISMISS_QUESTION':
      return {
        ...state,
        currentQuestion: null,
        usedQuestions: new Set([...state.usedQuestions, action.payload]),
      };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    fetch('/questions.csv')
      .then((res) => res.text())
      .then((text) => {
        const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
        dispatch({ type: 'LOAD_BOARD', payload: data });
      })
      .catch((err) => console.error('Failed to load questions.csv:', err));
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
