import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import './QuestionModal.css';

const REVEAL_DURATION = 280; // ms — crossfade reveal
const EXIT_DURATION = 260;   // ms — full flip-out on close
const ENTER_DURATION = 400;  // ms — card-flip-in duration

export default function QuestionModal() {
  const { state, dispatch } = useGame();
  const { currentQuestion } = state;
  const [phase, setPhase] = useState('entering'); // 'entering' | 'idle' | 'revealing' | 'revealed' | 'closing'

  const handleDone = useCallback(() => {
    if (phase === 'closing' || phase === 'revealing') return;
    setPhase('closing');
    setTimeout(() => {
      dispatch({ type: 'DISMISS_QUESTION', payload: currentQuestion.id });
    }, EXIT_DURATION);
  }, [phase, currentQuestion, dispatch]);

  // Escape key closes the modal
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') handleDone(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDone]);

  // Reset state when a new question opens
  useEffect(() => {
    setPhase('entering');
    const t = setTimeout(() => setPhase('idle'), ENTER_DURATION);
    return () => clearTimeout(t);
  }, [currentQuestion?.id]);

  const handleReveal = () => {
    setPhase('revealing');
    setTimeout(() => setPhase('revealed'), REVEAL_DURATION);
  };

  if (!currentQuestion) return null;

  const cardClass = ['modal-card'];
  if (phase === 'entering') cardClass.push('entering');

  return (
    <div
      className={`modal-backdrop${phase === 'closing' ? ' closing' : ''}`}
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

        <div className={`modal-answer${phase === 'revealing' || phase === 'revealed' ? ' modal-answer--visible' : ' modal-answer--hidden'}`}>
          {currentQuestion.answer}
        </div>

        <div className={`modal-actions${phase === 'revealing' || phase === 'revealed' ? ' fading-out' : ''}`}>
          <button className="btn-reveal" onClick={handleReveal}>
            Reveal
          </button>
        </div>
      </div>
    </div>
  );
}
