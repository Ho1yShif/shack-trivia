import React from 'react';
import GameBoard from './components/GameBoard/GameBoard';
import QuestionModal from './components/QuestionModal/QuestionModal';
import './styles/main.css';

export default function App() {
  return (
    <div className="app">
      <h1 className="app-title">Shack Trivia</h1>
      <p className="app-subtitle">Select a question to begin</p>
      <GameBoard />
      <QuestionModal />
    </div>
  );
}
