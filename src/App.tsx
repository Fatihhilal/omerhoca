import { useState } from 'react';
import LandingPage from './components/LandingPage';
import GameScreen from './components/Game/GameScreen';
import './index.css';

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameConfig, setGameConfig] = useState<{
        difficulty: 'easy' | 'medium' | 'hard';
        totalQuestions: number;
    }>({ difficulty: 'easy', totalQuestions: 5 });

    const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard', totalQuestions: number) => {
        setGameConfig({ difficulty, totalQuestions });
        setGameStarted(true);
        // TODO: Start music here
    };

    const handleGameEnd = () => {
        setGameStarted(false);
    };

    return (
        <div className="app-container">
            {!gameStarted ? (
                <LandingPage onStart={handleStartGame} />
            ) : (
                <GameScreen
                    difficulty={gameConfig.difficulty}
                    totalQuestions={gameConfig.totalQuestions}
                    onGameEnd={handleGameEnd}
                />
            )}
        </div>
    );
}

export default App;
