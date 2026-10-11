// JS/sceneManager.js
class SceneManager {
    constructor() {
        this.currentState = 'loading';

        this.scenes = {
            loading: document.getElementById('scene-loading'),
            title:   document.getElementById('scene-title'),
            login:   document.getElementById('scene-login'),
            menu:    document.getElementById('scene-menu')
        };

        this.btnStart = document.getElementById('btn-start');
        this.initEventListeners();
    }

    initEventListeners() {
        this.btnStart.addEventListener('click', () => {
            if (this.currentState === 'title') {
                window.audioManager.playStartSFX();
                this._btnExplosion(this.btnStart);
                // FIX #8: deshabilitar inmediatamente para evitar doble clic
                this.btnStart.disabled = true;
                setTimeout(() => this.transitionToLogin(), 280);
            }
        });
    }

    _btnExplosion(el) {
        const count = 16;
        const rect  = el.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;

        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'fire-spark-burst';
            const angle = (360 / count) * i;
            const dist  = 55 + Math.random() * 45;
            spark.style.setProperty('--angle', `${angle}deg`);
            spark.style.setProperty('--dist',  `${dist}px`);
            spark.style.left = `${cx}px`;
            spark.style.top  = `${cy}px`;
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 950);
        }
    }

    changeState(s) { this.currentState = s; }

    /* FIX #8: helper para limpiar clases de animación residuales */
    _clearAnimClasses(el) {
        el.classList.remove(
            'cinematic-appear',
            'cinematic-transition-out',
            'cinematic-transition-in'
        );
    }

    startIntro() {
        setTimeout(() => {
            this._clearAnimClasses(this.scenes.title);
            this.scenes.loading.classList.remove('active');
            this.scenes.title.classList.add('active');
            this.scenes.title.classList.add('cinematic-appear');
            window.audioManager.playTitleMusic();
            this.changeState('title');
            this.btnStart.focus();
        }, 800);
    }

    transitionToLogin() {
        if (this.currentState !== 'title') return;
        this.changeState('transitioningToLogin');

        window.audioManager.transitionToLoginMusic();
        this._addWindOverlay();

        this._clearAnimClasses(this.scenes.title);
        this.scenes.title.classList.add('cinematic-transition-out');

        setTimeout(() => {
            // FIX #8: limpiar clases residuales antes de ocultar
            this._clearAnimClasses(this.scenes.title);
            this.scenes.title.classList.remove('active');

            this._clearAnimClasses(this.scenes.login);
            this.scenes.login.classList.add('active');
            this.scenes.login.classList.add('cinematic-transition-in');

            window.particleSystem.startWind();
            this.changeState('login');

            setTimeout(() => {
                const nameInput = document.getElementById('student-name');
                if (nameInput) nameInput.focus();
            }, 900);
        }, 1500);
    }

    _addWindOverlay() {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const line = document.createElement('div');
            line.className = 'wind-line';
            line.style.top            = `${4 + (i / count) * 92}vh`;
            line.style.animationDelay = `${i * 0.055}s`;
            line.style.height         = `${3 + Math.random() * 6}px`;
            line.style.width          = `${30 + Math.random() * 30}%`;
            // position:fixed + z-index alto → siempre visible
            line.style.position       = 'fixed';
            line.style.zIndex         = '9500';
            document.body.appendChild(line);
            setTimeout(() => line.remove(), 1900);
        }
    }

    transitionToMenu(studentData) {
        if (this.currentState !== 'login') return;
        this.changeState('transitioningToMenu');

        window.particleSystem.stopWind();

        this._clearAnimClasses(this.scenes.login);
        this.scenes.login.classList.add('cinematic-transition-out');

        setTimeout(() => {
            this._clearAnimClasses(this.scenes.login);
            this.scenes.login.classList.remove('active');

            // Actualizar datos en la pantalla provisional
            document.getElementById('display-name').textContent = studentData.name;
            const avatarEl = document.querySelector(
                `.avatar-option[data-id="${studentData.avatarId}"] img`
            );
            if (avatarEl) document.getElementById('display-avatar').src = avatarEl.src;

            this._clearAnimClasses(this.scenes.menu);
            this.scenes.menu.classList.add('active');
            this.scenes.menu.classList.add('cinematic-transition-in');

            window.particleSystem.startFlameConfetti();
            this.changeState('menuPlaceholder');
        }, 1500);
    }
}
