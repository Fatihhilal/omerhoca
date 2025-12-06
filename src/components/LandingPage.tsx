import { useState } from 'react';
import './LandingPage.css';
import HighScores from './HighScores';

interface LandingPageProps {
    onStart: (difficulty: 'easy' | 'medium' | 'hard', totalQuestions: number) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [questionCount, setQuestionCount] = useState(5);
    const [showHighScores, setShowHighScores] = useState(false);

    return (
        <div className="landing-page">
            <div className="overlay">
                <h1 className="title">Anadolu Sözcükleri</h1>
                <p className="subtitle">Geçmişten Günümüze Bir Yolculuk</p>

                <div className="settings-container">
                    <div className="setting-group">
                        <label>Zorluk Seviyesi:</label>
                        <div className="difficulty-buttons">
                            {['easy', 'medium', 'hard'].map((d) => (
                                <button
                                    key={d}
                                    className={`setting-btn ${difficulty === d ? 'active' : ''}`}
                                    onClick={() => setDifficulty(d as any)}
                                >
                                    {d === 'easy' ? 'Kolay' : d === 'medium' ? 'Orta' : 'Zor'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group">
                        <label>Soru Sayısı:</label>
                        <div className="count-buttons">
                            {[5, 10, 15].map((c) => (
                                <button
                                    key={c}
                                    className={`setting-btn ${questionCount === c ? 'active' : ''}`}
                                    onClick={() => setQuestionCount(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="start-button" onClick={() => onStart(difficulty, questionCount)}>
                        Oyuna Başla
                    </button>
                    <button className="secondary-button" onClick={() => setShowHighScores(true)}>
                        🏆 Yüksek Skorlar
                    </button>
                </div>
            </div>

            {showHighScores && <HighScores onClose={() => setShowHighScores(false)} />}
        </div>
    );
};

export default LandingPage;
