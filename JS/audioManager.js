// JS/audioManager.js
class AudioManager {
    constructor() {
        this.titleMusic = new Audio('sonidos/musica_titulo.mp3');
        this.titleMusic.loop = true;
        this.titleMusic.volume = 0.5;

        this.loginMusic = new Audio('sonidos/musica_login.mp3');
        this.loginMusic.loop = true;
        this.loginMusic.volume = 0;

        // Efectos de sonido
        this.sfxStart    = new Audio('sonidos/start.aac');
        this.sfxSeleccion = new Audio('sonidos/seleccion.aac');
        this.sfxStart.volume    = 0.8;
        this.sfxSeleccion.volume = 0.8;

        this.isFading = false;
    }

    /* Reproduce un efecto sin cortar otras pistas */
    _playSFX(audio) {
        try {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        } catch(e) {}
    }

    playStartSFX()    { this._playSFX(this.sfxStart); }
    playSeleccionSFX(){ this._playSFX(this.sfxSeleccion); }

    playTitleMusic() {
        this.titleMusic.play().catch(() => {
            const unlock = () => {
                this.titleMusic.play().catch(() => {});
                document.body.removeEventListener('click',   unlock);
                document.body.removeEventListener('keydown', unlock);
            };
            document.body.addEventListener('click',   unlock);
            document.body.addEventListener('keydown', unlock);
        });
    }

    transitionToLoginMusic() {
        if (this.isFading) return;
        this.isFading = true;
        this.loginMusic.play().catch(() => {});

        const step = 0.02;
        const fader = setInterval(() => {
            if (this.titleMusic.volume > step) {
                this.titleMusic.volume -= step;
            } else {
                this.titleMusic.volume = 0;
                this.titleMusic.pause();
                this.titleMusic.currentTime = 0;
            }
            if (this.loginMusic.volume < 0.5 - step) {
                this.loginMusic.volume += step;
            } else {
                this.loginMusic.volume = 0.5;
                clearInterval(fader);
                this.isFading = false;
            }
        }, 50);
    }
}
