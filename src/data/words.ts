export interface WordData {
  id: string;
  oldWord: string;
  modernMeaning: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  letters: string[];
}
