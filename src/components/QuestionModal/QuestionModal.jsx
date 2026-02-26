import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../contexts/GameContext';
import './QuestionModal.css';

const EXIT_DURATION = 180; // ms — must match card-out animation duration

export default function QuestionModal() {
  const { state, dispatch } = useGame();
  const { currentQuestion } = state;
  const [answerVisible, setAnswerVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Reset state when a new question opens
  useEffect(() => {
    setAnswerVisible(false);
    setClosing(false);
  }, [currentQuestion?.id]);

  const handleDone = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      dispatch({ type: 'DISMISS_QUESTION', payload: currentQuestion.id });
    }, EXIT_DURATION);
  }, [closing, currentQuestion, dispatch]);

  if (!currentQuestion) return null;

  return (
    <div
      className={`modal-backdrop${closing ? ' closing' : ''}`}
      onClick={handleDone}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-category">{currentQuestion.category ?? ''}</span>
          <span className="modal-points">{currentQuestion.points}</span>
        </div>

        <div className="modal-clue">{currentQuestion.clue}</div>

        {answerVisible ? (
          <div className="modal-answer">{currentQuestion.answer}</div>
        ) : (
          <button className="btn-reveal" onClick={() => setAnswerVisible(true)}>
            Reveal Answer
          </button>
        )}

        <button className="btn-done" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
