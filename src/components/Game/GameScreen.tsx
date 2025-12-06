import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './GameScreen.css';
import type { WordData } from '../../data/words'; // Correct Type Import
import { WordService } from '../../utils/WordService'; // Helper Service
import LetterWheel from './LetterWheel';
import { AudioManager } from '../../utils/AudioManager';

interface GameScreenProps {
    difficulty: 'easy' | 'medium' | 'hard';
    totalQuestions: number;
    onGameEnd: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ difficulty, totalQuestions, onGameEnd }) => {
    const [words, setWords] = useState<WordData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [playerName, setPlayerName] = useState('');

    const timerRef = useRef<number | null>(null);

    // Difficulty multipliers
    const multipliers = {
        easy: 1,
        medium: 1.5,
        hard: 2
    };

    // Load words on mount
    useEffect(() => {
        const loadGame = async () => {
            try {
                const service = WordService.getInstance();
                await service.loadWords();
                const gameWords = service.getRandomWords(totalQuestions, difficulty);
                if (gameWords.length > 0) {
                    setWords(gameWords);
                    setTimeLeft(gameWords[0].duration);
                } else {
                    // Fallback or error handling
                    console.error("No words found for this difficulty");
                }
            } catch (error) {
                console.error("Failed to init game:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadGame();
    }, [difficulty, totalQuestions]);

    const currentWord = words[currentWordIndex];
    const isLastWord = currentWordIndex === words.length - 1;

    // Timer Logic
    useEffect(() => {
        if (!isLoading && !gameOver && words.length > 0 && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Time's up!
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isLoading, gameOver, words, currentWordIndex]); // Re-run when word changes to reset timer effect

    // Reset state when word changes
    useEffect(() => {
        if (words.length > 0 && currentWord) {
            setShowHint(false);
            setHintUsed(false);
            setTimeLeft(currentWord.duration); // Set timer for new word
        }
    }, [currentWordIndex, words]);

    const handleTimeUp = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        AudioManager.getInstance().playSoundEffect('wrong');

        // Move to next word or end game
        setTimeout(() => {
            nextQuestion();
        }, 1000);
    };

    const nextQuestion = () => {
        if (!isLastWord) {
            setCurrentWordIndex(prev => prev + 1);
        } else {
            endGame();
        }
    };

    const endGame = () => {
        setGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);
        AudioManager.getInstance().playSoundEffect('correct'); // Victory sound logic could be different
    };

    const handleWordSubmit = (submittedWord: string) => {
        if (submittedWord === currentWord.oldWord) {
            handleCorrectGuess();
        } else {
            AudioManager.getInstance().playSoundEffect('wrong');
            console.log('Incorrect:', submittedWord);
        }
    };

    const handleCorrectGuess = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        AudioManager.getInstance().playSoundEffect('correct');

        // Calculate points
        const basePoints = hintUsed ? 50 : 100;
        const multiplier = multipliers[difficulty];
        const points = Math.round(basePoints * multiplier);

        setScore(prev => prev + points);

        // Confetti effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e30a17', '#ffffff', '#ffd700']
        });

        // Move to next word
        setTimeout(() => {
            nextQuestion();
        }, 1500);
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

    const saveScore = () => {
        if (!playerName.trim()) return;

        const newScore = {
            name: playerName,
            score: score,
            date: new Date().toISOString(),
            difficulty: difficulty
        };

        const existingScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        existingScores.push(newScore);
        localStorage.setItem('highScores', JSON.stringify(existingScores));

        onGameEnd();
    };

    if (isLoading) return <div className="loading">Sözcükler Yükleniyor...</div>;
    if (!words.length) return <div className="error">Kelime bulunamadı!</div>;

    if (gameOver) {
        return (
            <div className="game-over-screen">
                <div className="result-card">
                    <h2>🎉 Oyun Bitti!</h2>
                    <div className="final-score">
                        <span>Toplam Puan</span>
                        <strong>{score}</strong>
                    </div>

                    <div className="save-score-form">
                        <p>Skorunu kaydetmek için ismini gir:</p>
                        <input
                            type="text"
                            placeholder="Adınız"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={15}
                        />
                        <button onClick={saveScore} disabled={!playerName.trim()}>
                            Kaydet ve Bitir
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-screen">
            <div className="header">
                <button
                    className="icon-button"
                    onClick={toggleMute}
                    title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>

                <div className="timer-display" style={{ color: timeLeft <= 5 ? 'red' : 'inherit' }}>
                    ⏳ {timeLeft}s
                </div>

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

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${((currentWordIndex) / totalQuestions) * 100}%` }}
                ></div>
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
