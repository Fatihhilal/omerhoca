import Papa from 'papaparse';

export interface WordData {
    id: string;
    oldWord: string;
    modernMeaning: string;
    definition: string;
    difficulty: 'easy' | 'medium' | 'hard';
    duration: number;
    letters: string[];
}

// Fisher-Yates shuffle algoritması ile harfleri karıştır
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export class WordService {
    private static instance: WordService;
    private words: WordData[] = [];

    private constructor() { }

    public static getInstance(): WordService {
        if (!WordService.instance) {
            WordService.instance = new WordService();
        }
        return WordService.instance;
    }

    public async loadWords(): Promise<void> {
        return new Promise((resolve, reject) => {
            Papa.parse('/words.csv', {
                download: true,
                header: true,
                complete: (results) => {
                    this.words = results.data
                        .filter((row: any) => row.id && row.oldWord) // Filter empty lines
                        .map((row: any) => ({
                            id: row.id,
                            oldWord: row.oldWord.toUpperCase(),
                            modernMeaning: row.modernMeaning,
                            definition: row.definition,
                            difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
                            duration: parseInt(row.duration, 10),
                            letters: shuffleArray(row.oldWord.toUpperCase().split(''))
                        }));
                    console.log('Words loaded:', this.words.length);
                    resolve();
                },
                error: (error) => {
                    console.error('Error loading words:', error);
                    reject(error);
                }
            });
        });
    }

    public getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): WordData[] {
        return this.words.filter(w => w.difficulty === difficulty);
    }

    public getAllWords(): WordData[] {
        return this.words;
    }

    public getRandomWords(count: number, difficulty?: 'easy' | 'medium' | 'hard'): WordData[] {
        let pool = difficulty ? this.getWordsByDifficulty(difficulty) : this.words;

        // Shuffle array
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        return pool.slice(0, count);
    }
}
