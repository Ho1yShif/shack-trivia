import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import './QuestionModal.css';

const REVEAL_DURATION = 280; // ms — crossfade reveal
const EXIT_DURATION = 260;   // ms — full flip-out on close
const ENTER_DURATION = 400;  // ms — card-flip-in duration

export default function QuestionModal() {
  const { state, dispatch } = useGame();
  const { currentQuestion } = state;
  const [revealPhase, setRevealPhase] = useState('idle'); // 'idle' | 'revealing' | 'revealed'
  const [closing, setClosing] = useState(false);
  const [entered, setEntered] = useState(false);

  const handleDone = useCallback(() => {
    if (closing || revealPhase === 'revealing') return;
    setClosing(true);
    setTimeout(() => {
      dispatch({ type: 'DISMISS_QUESTION', payload: currentQuestion.id });
    }, EXIT_DURATION);
  }, [closing, revealPhase, currentQuestion, dispatch]);

  // Escape key closes the modal
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') handleDone(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDone]);

  // Reset state when a new question opens
  useEffect(() => {
    setRevealPhase('idle');
    setClosing(false);
    setEntered(false);
    const t = setTimeout(() => setEntered(true), ENTER_DURATION);
    return () => clearTimeout(t);
  }, [currentQuestion?.id]);

  const handleReveal = () => {
    setRevealPhase('revealing');
    setTimeout(() => setRevealPhase('revealed'), REVEAL_DURATION);
  };

  if (!currentQuestion) return null;

  const cardClass = ['modal-card'];
  if (!entered) cardClass.push('entering');

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

        <div className="modal-clue">
          {currentQuestion.clue}
        </div>

        <div className={`modal-answer${revealPhase !== 'idle' ? ' modal-answer--visible' : ' modal-answer--hidden'}`}>
          {currentQuestion.answer}
        </div>

        <div className={`modal-actions${revealPhase !== 'idle' ? ' fading-out' : ''}`}>
          <button className="btn-reveal" onClick={handleReveal}>
            Reveal
          </button>
        </div>
      </div>
    </div>
  );
}
