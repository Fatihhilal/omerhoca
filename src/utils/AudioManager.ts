export class AudioManager {
    private static instance: AudioManager;
    private bgMusic: HTMLAudioElement | null = null;
    private isMuted: boolean = false;

    private constructor() { }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public playBackgroundMusic(url: string) {
        if (this.bgMusic) return; // Already playing

        this.bgMusic = new Audio(url);
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3; // Lower volume for background

        if (!this.isMuted) {
            this.bgMusic.play().catch(err => console.log('Audio play failed (user interaction needed):', err));
        }
    }

    public playSoundEffect(type: 'correct' | 'wrong' | 'click') {
        if (this.isMuted) return;

        let freq = 440;
        let typeWave: OscillatorType = 'sine';
        let duration = 0.1;

        // Simple synth for SFX to avoid external files for now
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'correct') {
            freq = 880; // High pitch
            typeWave = 'sine';
            duration = 0.3;

            // Arpeggio effect
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        } else if (type === 'wrong') {
            freq = 150; // Low pitch
            typeWave = 'sawtooth';
            duration = 0.3;
            osc.frequency.value = freq;
        } else {
            // Click
            freq = 600;
            duration = 0.05;
            osc.frequency.value = freq;
        }

        if (type !== 'correct') {
            osc.type = typeWave;
        }

        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
        osc.stop(ctx.currentTime + duration);
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgMusic) {
            if (this.isMuted) {
                this.bgMusic.pause();
            } else {
                this.bgMusic.play().catch(console.error);
            }
        }
        return this.isMuted;
    }
}
