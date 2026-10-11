// JS/particleSystem.js
// Sistema de partículas 100% DOM — sin canvas, siempre visible sobre todo
class ParticleSystem {
    constructor() {
        this.sparksEl   = document.getElementById('sparks-container');
        this.leavesEl   = document.getElementById('leaves-container');
        this.confettiEl = document.getElementById('confetti-container');

        this.windActive      = false;
        this.windInterval    = null;
        this.confettiActive  = false;
        this.confettiTimeout = null;

        // Arrancar lluvia de chispas (se activa sola cuando la escena es 'title')
        this._startTitleSparks();
    }

    /* ══════════════════════════════════════════
       LLUVIA DE CHISPAS (portada)
    ══════════════════════════════════════════ */
    _startTitleSparks() {
        this._sparksInterval = setInterval(() => {
            if (window.sceneManager && window.sceneManager.currentState === 'title') {
                this._spawnSpark();
            }
        }, 130);
    }

    _spawnSpark() {
        const el = document.createElement('img');
        el.src = 'img/chispas.jfif';
        el.className = 'title-spark';

        // FIX #6: asignar propiedades individualmente para NO pisar la clase CSS
        const size = 28 + Math.random() * 36;
        el.style.width            = size + 'px';
        el.style.height           = size + 'px';
        el.style.left             = (Math.random() * 98) + 'vw';
        el.style.top              = '-' + size + 'px';
        el.style.animationDuration = (1.4 + Math.random() * 1.4) + 's';

        this.sparksEl.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }

    /* ══════════════════════════════════════════
       VIENTO + HOJAS (login)
    ══════════════════════════════════════════ */
    startWind() {
        if (this.windActive) return;
        this.windActive = true;

        // Ráfaga inicial intensa
        for (let i = 0; i < 14; i++) {
            setTimeout(() => this._spawnLeaf(true), i * 70);
        }

        // Flujo continuo
        this.windInterval = setInterval(() => {
            if (!this.windActive) return;
            this._spawnLeaf(false);
            if (Math.random() < 0.35) this._spawnLeaf(false);
        }, 220);
    }

    stopWind() {
        this.windActive = false;
        clearInterval(this.windInterval);
        this.windInterval = null;
    }

    _spawnLeaf(fast) {
        const el = document.createElement('div');
        el.className = 'wind-leaf';

        const size   = 14 + Math.random() * 24;
        const topPct = Math.random() * 92;
        const dur    = fast ? (0.5 + Math.random() * 0.4) : (1.6 + Math.random() * 1.8);
        const delay  = Math.random() * 0.25;
        const colors = ['#4caf50','#8bc34a','#cddc39','#ff9800','#f44336','#ffeb3b','#76c442'];
        const color  = colors[Math.floor(Math.random() * colors.length)];
        const rotate = Math.random() * 720 - 360;

        // FIX #5: position:fixed se pone aquí para no depender del contenedor
        el.style.position         = 'fixed';
        el.style.width            = size + 'px';
        el.style.height           = (size * 0.6) + 'px';
        el.style.top              = topPct + 'vh';
        el.style.right            = '-' + (size * 2) + 'px';
        el.style.background       = color;
        el.style.borderRadius     = '60% 0 60% 0';
        el.style.setProperty('--rotate', rotate + 'deg');
        el.style.animation        = `leafFly ${dur}s ${delay}s linear forwards`;
        el.style.pointerEvents    = 'none';
        el.style.zIndex           = '9000';
        el.style.boxShadow        = 'inset -2px -2px 3px rgba(0,0,0,0.2)';
        el.style.filter           = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.35))';

        // Append a body en vez del contenedor para position:fixed correcto
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }

    /* ══════════════════════════════════════════
       CONFETI DE LLAMAS (menú)
    ══════════════════════════════════════════ */
    startFlameConfetti() {
        this.confettiActive = true;
        let count = 0;
        const maxFlames = 90;

        const spawn = () => {
            if (!this.confettiActive || count >= maxFlames) return;
            this._spawnFlame();
            count++;
            setTimeout(spawn, 55 + Math.random() * 75);
        };
        spawn();

        clearTimeout(this.confettiTimeout);
        this.confettiTimeout = setTimeout(() => {
            this.confettiActive = false;
        }, 6000);
    }

    _spawnFlame() {
        const el = document.createElement('div');
        el.className = 'confetti-flame';

        const size    = 20 + Math.random() * 26;
        const leftPct = Math.random() * 100;
        const dur     = 2.2 + Math.random() * 2;
        const colors  = ['#ff3d00','#ff6d00','#ff9100','#ffcc00','#e53935','#fff176'];
        const color   = colors[Math.floor(Math.random() * colors.length)];

        // FIX #6 pattern: propiedades individuales para no pisar la clase CSS
        el.style.position         = 'fixed';
        el.style.width            = size + 'px';
        el.style.height           = (size * 1.5) + 'px';
        el.style.left             = leftPct + 'vw';
        el.style.top              = '-' + (size * 2) + 'px';
        el.style.background       = color;
        el.style.animationDuration = dur + 's';
        el.style.zIndex           = '9000';
        el.style.pointerEvents    = 'none';

        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }
}
