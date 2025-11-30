import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GameScreen from './components/Game/GameScreen';
import './index.css';

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartGame = () => {
        setGameStarted(true);
        // TODO: Start music here
    };

    return (
        <div className="app-container">
            {!gameStarted ? (
                <LandingPage onStart={handleStartGame} />
            ) : (
                <GameScreen />
            )}
        </div>
    );
}

export default App;
