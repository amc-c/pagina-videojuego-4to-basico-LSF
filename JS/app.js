// JS/app.js
window.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    window.audioManager = new AudioManager();
    window.particleSystem = new ParticleSystem();
    window.sceneManager = new SceneManager();
    window.loginManager = new LoginManager();
    
    // Start intro sequence (Black screen -> Title)
    window.sceneManager.startIntro();
});
