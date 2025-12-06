import { useEffect, useState } from 'react';
import './HighScores.css';

interface HighScore {
    name: string;
    score: number;
    date: string;
    difficulty: string;
}

interface HighScoresProps {
    onClose: () => void;
}

const HighScores: React.FC<HighScoresProps> = ({ onClose }) => {
    const [scores, setScores] = useState<HighScore[]>([]);

    useEffect(() => {
        const storedScores = localStorage.getItem('highScores');
        if (storedScores) {
            try {
                const parsedScores = JSON.parse(storedScores);
                // Sort by score descending
                parsedScores.sort((a: HighScore, b: HighScore) => b.score - a.score);
                setScores(parsedScores.slice(0, 10)); // Keep top 10
            } catch (e) {
                console.error('Failed to parse scores', e);
            }
        }
    }, []);

    return (
        <div className="high-scores-overlay">
            <div className="high-scores-modal">
                <h2>🏆 Yüksek Skorlar</h2>

                {scores.length === 0 ? (
                    <p className="no-scores">Henüz hiç skor kaydedilmedi.</p>
                ) : (
                    <div className="scores-list">
                        <div className="scores-header">
                            <span>Kullanıcı</span>
                            <span>Zorluk</span>
                            <span>Puan</span>
                        </div>
                        {scores.map((s, index) => (
                            <div key={index} className={`score-row ${index < 3 ? 'top-score' : ''}`}>
                                <span className="player-name">{index + 1}. {s.name || 'İsimsiz'}</span>
                                <span className="difficulty-badge">{s.difficulty === 'easy' ? 'Kolay' : s.difficulty === 'hard' ? 'Zor' : 'Orta'}</span>
                                <span className="score-number">{s.score}</span>
                            </div>
                        ))}
                    </div>
                )}

                <button className="close-button" onClick={onClose}>Kapat</button>
            </div>
        </div>
    );
};

export default HighScores;
