import React, { useState, useRef, useEffect } from 'react';
import './LetterWheel.css';

interface LetterWheelProps {
    letters: string[];
    onWordSubmit: (word: string) => void;
}

const LetterWheel: React.FC<LetterWheelProps> = ({ letters, onWordSubmit }) => {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const wheelRef = useRef<HTMLDivElement>(null);

    // Calculate letter positions in a circle
    const radius = 100; // px
    const center = { x: 150, y: 150 }; // Center of the 300x300 container

    const getLetterPosition = (index: number, total: number) => {
        const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
        return {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle),
        };
    };

    const handleStart = (index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent scrolling on touch
        setIsDragging(true);
        setSelectedIndices([index]);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !wheelRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

        // Update mouse pos for drawing the active line
        const rect = wheelRef.current.getBoundingClientRect();
        setMousePos({
            x: clientX - rect.left,
            y: clientY - rect.top,
        });

        // Check collision with other letters
        const elements = document.elementsFromPoint(clientX, clientY);
        const letterEl = elements.find(el => el.classList.contains('letter-circle'));

        if (letterEl) {
            const index = parseInt(letterEl.getAttribute('data-index') || '-1');
            if (index !== -1 && !selectedIndices.includes(index)) {
                setSelectedIndices(prev => [...prev, index]);
            }
        }
    };

    const handleEnd = () => {
        if (isDragging) {
            const word = selectedIndices.map(i => letters[i]).join('');
            onWordSubmit(word);
            setSelectedIndices([]);
            setIsDragging(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, selectedIndices]);

    return (
        <div className="letter-wheel" ref={wheelRef}>
            <svg className="connections">
                {selectedIndices.map((index, i) => {
                    if (i === 0) return null;
                    const prevPos = getLetterPosition(selectedIndices[i - 1], letters.length);
                    const currPos = getLetterPosition(index, letters.length);
                    return (
                        <line
                            key={i}
                            x1={prevPos.x}
                            y1={prevPos.y}
                            x2={currPos.x}
                            y2={currPos.y}
                            stroke="rgba(227, 10, 23, 0.5)"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                    );
                })}
                {isDragging && selectedIndices.length > 0 && (
                    <line
                        x1={getLetterPosition(selectedIndices[selectedIndices.length - 1], letters.length).x}
                        y1={getLetterPosition(selectedIndices[selectedIndices.length - 1], letters.length).y}
                        x2={mousePos.x}
                        y2={mousePos.y}
                        stroke="rgba(227, 10, 23, 0.5)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                )}
            </svg>

            {letters.map((letter, index) => {
                const pos = getLetterPosition(index, letters.length);
                const isSelected = selectedIndices.includes(index);
                return (
                    <div
                        key={index}
                        className={`letter-circle ${isSelected ? 'selected' : ''}`}
                        style={{ left: pos.x - 30, top: pos.y - 30 }}
                        onMouseDown={(e) => handleStart(index, e)}
                        onTouchStart={(e) => handleStart(index, e)}
                        data-index={index}
                    >
                        {letter}
                    </div>
                );
            })}

        </div>
    );
};

export default LetterWheel;
