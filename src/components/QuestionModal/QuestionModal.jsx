import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import './QuestionModal.css';

const FLIP_HALF = 200;    // ms — half of reveal flip
const EXIT_DURATION = 260; // ms — full flip-out on close
const ENTER_DURATION = 260; // ms — card-flip-in duration

export default function QuestionModal() {
  const { state, dispatch } = useGame();
  const { currentQuestion } = state;
  const [answerVisible, setAnswerVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [flipPhase, setFlipPhase] = useState('idle'); // 'idle' | 'flipping-out'

  const handleDone = useCallback(() => {
    if (closing || flipPhase !== 'idle') return;
    setClosing(true);
    setTimeout(() => {
      dispatch({ type: 'DISMISS_QUESTION', payload: currentQuestion.id });
    }, EXIT_DURATION);
  }, [closing, flipPhase, currentQuestion, dispatch]);

  // Escape key closes the modal
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') handleDone(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDone]);

  // Reset state when a new question opens
  useEffect(() => {
    setAnswerVisible(false);
    setClosing(false);
    setEntered(false);
    setFlipPhase('idle');
    const t = setTimeout(() => setEntered(true), ENTER_DURATION);
    return () => clearTimeout(t);
  }, [currentQuestion?.id]);

  const handleReveal = () => {
    setFlipPhase('flipping-out');
    setTimeout(() => {
      setAnswerVisible(true);
      setFlipPhase('idle');
    }, FLIP_HALF);
  };

  if (!currentQuestion) return null;

  const cardClass = ['modal-card'];
  if (!entered) cardClass.push('entering');
  else if (flipPhase === 'flipping-out') cardClass.push('flipping-out');

  return (
    <div
      className={`modal-backdrop${closing ? ' closing' : ''}`}
      onClick={handleDone}
    >
      <div
        className={cardClass.join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-close" onClick={handleDone} aria-label="Close">
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-category">{currentQuestion.category ?? ''}</span>
          <span className="modal-points">{currentQuestion.points}</span>
        </div>

        <div className="modal-clue">{currentQuestion.clue}</div>

        <div className={`modal-answer${answerVisible ? ' modal-answer--visible' : ' modal-answer--hidden'}`}>
          {currentQuestion.answer}
        </div>

        <div className="modal-actions">
          {!answerVisible && (
            <button className="btn-reveal" onClick={handleReveal}>
              Reveal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
