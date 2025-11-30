import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="landing-page">
            <div className="overlay">
                <h1 className="title">Anadolu Sözcükleri</h1>
                <p className="subtitle">Geçmişten Günümüze Bir Yolculuk</p>
                <button className="start-button" onClick={onStart}>
                    Oyuna Başla
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
