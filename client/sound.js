import eatSound from './snd/eat.mp3';
import jumpSound from './snd/jump.mp3';

export default class Sound {
    static SOUNDS = {
        EAT: eatSound,
        JUMP: jumpSound
    };

    constructor() {
        this.sounds = new Map();
        for (const soundPath of Object.values(Sound.SOUNDS)) {
            this.sounds.set(soundPath, new Audio(soundPath));
        }
    }

    play(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.play();
        }
    }
}
