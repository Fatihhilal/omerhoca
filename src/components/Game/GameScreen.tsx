import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './GameScreen.css';
import { words } from '../../data/words';
import LetterWheel from './LetterWheel';
import { AudioManager } from '../../utils/AudioManager';

const GameScreen: React.FC = () => {
    const [score, setScore] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const currentWord = words[currentWordIndex];
    const isLastWord = currentWordIndex === words.length - 1;

    // Reset state when word changes
    useEffect(() => {
        setShowHint(false);
        setHintUsed(false);
    }, [currentWordIndex]);

    const handleWordSubmit = (submittedWord: string) => {
        if (submittedWord === currentWord.oldWord) {
            // Correct word!
            handleCorrectGuess();
        } else {
            // Incorrect
            AudioManager.getInstance().playSoundEffect('wrong');
            console.log('Incorrect:', submittedWord);
        }
    };

    const handleCorrectGuess = () => {
        AudioManager.getInstance().playSoundEffect('correct');

        // Calculate points
        const points = hintUsed ? 50 : 100;
        setScore(prev => prev + points);

        // Confetti effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e30a17', '#ffffff', '#ffd700']
        });

        // Move to next word after delay
        setTimeout(() => {
            if (!isLastWord) {
                setCurrentWordIndex(prev => prev + 1);
            } else {
                alert(`Oyun Bitti! Toplam Puan: ${score + points}`);
                // Reset game or show end screen
                setCurrentWordIndex(0);
                setScore(0);
            }
        }, 2000);
    };

    const handleHint = () => {
        if (score >= 50 && !hintUsed) {
            AudioManager.getInstance().playSoundEffect('click');
            setScore(prev => prev - 50);
            setShowHint(true);
            setHintUsed(true);
        }
    };

    const toggleMute = () => {
        const muted = AudioManager.getInstance().toggleMute();
        setIsMuted(muted);
    };

    return (
        <div className="game-screen">
            <div className="header">
                {/* Mute Button */}
                <button
                    className="icon-button"
                    onClick={toggleMute}
                    title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>

                {/* Hint Button */}
                <div className="hint-area">
                    {!showHint && !hintUsed && score >= 50 && (
                        <button className="hint-button" onClick={handleHint}>
                            💡 İpucu (50 Altın)
                        </button>
                    )}
                </div>

                <div className="score-board">
                    <span className="coin-icon">🪙</span>
                    <span className="score-value">{score}</span>
                </div>
            </div>

            <div className="game-area">
                <div className="definition-box">
                    <p className="definition-text">{currentWord.definition}</p>
                    <p className="modern-meaning">
                        {showHint ? currentWord.modernMeaning : '???'}
                    </p>
                </div>

                <div className="word-area">
                    <LetterWheel
                        letters={currentWord.letters}
                        onWordSubmit={handleWordSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameScreen;
