// JS/login.js
class LoginManager {
    constructor() {
        this.inputName     = document.getElementById('student-name');
        this.avatarOptions = document.querySelectorAll('.avatar-option');
        this.btnLogin      = document.getElementById('btn-login');
        this.errorMsg      = document.getElementById('login-error');
        this.selectedAvatarId = null;
        this._loginLocked = false; // FIX #9: evitar feedback positivo en error
        this.initEventListeners();
    }

    initEventListeners() {
        // Avatares
        this.avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Sonido y efecto SIEMPRE al seleccionar avatar (siempre es válido)
                window.audioManager.playSeleccionSFX();
                this.fireExplosion(option);
                this.selectAvatar(option);
            });
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.audioManager.playSeleccionSFX();
                    this.fireExplosion(option);
                    this.selectAvatar(option);
                }
            });
        });

        // Enter en el input de nombre
        this.inputName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this._tryLogin();
            }
        });

        // Botón INGRESAR
        this.btnLogin.addEventListener('click', () => {
            this._tryLogin();
        });
    }

    /* FIX #9: sonido/explosión SÓLO si la validación pasa */
    _tryLogin() {
        if (this._loginLocked) return;
        const valid = this.attemptLogin();
        if (valid) {
            window.audioManager.playSeleccionSFX();
            this.fireExplosion(this.btnLogin);
        }
    }

    /* Crea una explosión de llamas CSS alrededor de un elemento */
    fireExplosion(el) {
        const count = 12;
        const rect  = el.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;

        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'fire-spark-burst';
            const angle = (360 / count) * i;
            const dist  = 45 + Math.random() * 35;
            spark.style.setProperty('--angle', `${angle}deg`);
            spark.style.setProperty('--dist',  `${dist}px`);
            spark.style.left = `${cx}px`;
            spark.style.top  = `${cy}px`;
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 850);
        }
    }

    selectAvatar(el) {
        this.avatarOptions.forEach(opt => {
            opt.classList.remove('selected');
            opt.setAttribute('aria-checked', 'false');
        });
        el.classList.add('selected');
        el.setAttribute('aria-checked', 'true');
        this.selectedAvatarId = el.dataset.id;
        this.hideError();
    }

    showError(msg) {
        this.errorMsg.textContent = msg;
        this.errorMsg.classList.remove('hidden');
    }

    hideError() {
        this.errorMsg.classList.add('hidden');
    }

    validateName(name) {
        const t = name.trim();
        if (t.length === 0) return 'El nombre no puede estar vacío.';
        if (t.length > 24)  return 'El nombre es demasiado largo (máx 24 letras).';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(t)) return 'Usa solo letras y espacios.';
        return null;
    }

    /* Retorna true si el login fue exitoso, false si falló */
    attemptLogin() {
        if (window.sceneManager.currentState !== 'login') return false;

        const name  = this.inputName.value;
        const error = this.validateName(name);
        if (error) {
            this.showError(error);
            this.inputName.focus();
            return false;
        }
        if (!this.selectedAvatarId) {
            this.showError('Por favor, selecciona un avatar.');
            return false;
        }

        // FIX: bloquear el botón una sola vez confirmado
        this._loginLocked = true;
        this.btnLogin.disabled = true;
        this.enterMainMenu({ name: name.trim(), avatarId: this.selectedAvatarId });
        return true;
    }

    enterMainMenu(studentData) {
        // Pequeño delay para que la explosión se vea antes de la transición
        setTimeout(() => {
            window.sceneManager.transitionToMenu(studentData);
        }, 400);
    }
}
