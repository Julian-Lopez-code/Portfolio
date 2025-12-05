/**
 * Poop Shooter Game - Easter Egg Mini Game
 * Shoot poops at toilets!
 */

class PoopShooterGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameActive = false;
        this.score = 0;
        this.poops = [];
        this.toilets = [];
        this.player = { x: 0, y: 0, width: 50, height: 50 };
        this.lastToiletSpawn = 0;
        this.toiletSpawnInterval = 1500;
        this.gameTime = 0;
        this.gameDuration = 30000; // 30 seconds
    }

    init() {
        // Create game modal
        const modal = document.createElement('div');
        modal.id = 'game-modal';
        modal.className = 'easter-egg-modal';
        modal.innerHTML = `
            <div class="game-content">
                <div class="game-header">
                    <h2>Poop Shooter</h2>
                    <p>Cliquez pour tirer des cacas sur les toilettes !</p>
                    <div class="game-stats">
                        <span>Score: <strong id="game-score">0</strong></span>
                        <span>Temps: <strong id="game-time">30</strong>s</span>
                    </div>
                    <button id="close-game" class="easter-egg-close">Fermer</button>
                </div>
                <canvas id="game-canvas" width="600" height="400"></canvas>
                <div class="game-instructions">
                    <p>🖱️ Déplacez la souris pour viser • Clic pour tirer</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Event listeners
        document.getElementById('game-egg-btn').addEventListener('click', () => this.show());
        document.getElementById('close-game').addEventListener('click', () => this.hide());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hide();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = e.clientX - rect.left - this.player.width / 2;
            this.player.y = e.clientY - rect.top - this.player.height / 2;
        });

        this.canvas.addEventListener('click', () => {
            if (this.gameActive) {
                this.shootPoop();
            }
        });
    }

    show() {
        document.getElementById('game-modal').classList.add('active');
        this.startGame();
    }

    hide() {
        document.getElementById('game-modal').classList.remove('active');
        this.gameActive = false;
    }

    startGame() {
        this.score = 0;
        this.poops = [];
        this.toilets = [];
        this.gameActive = true;
        this.gameTime = 0;
        this.lastToiletSpawn = 0;
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;

        document.getElementById('game-score').textContent = '0';
        document.getElementById('game-time').textContent = '30';

        this.gameLoop();
    }

    shootPoop() {
        this.poops.push({
            x: this.player.x + this.player.width / 2,
            y: this.player.y + this.player.height / 2,
            size: 15,
            active: true
        });
    }

    spawnToilet() {
        const side = Math.random() < 0.5 ? 'left' : 'right';
        this.toilets.push({
            x: side === 'left' ? -50 : this.canvas.width + 50,
            y: Math.random() * (this.canvas.height - 60),
            width: 50,
            height: 60,
            speed: (Math.random() * 2 + 1) * (side === 'left' ? 1 : -1),
            active: true
        });
    }

    update(deltaTime) {
        this.gameTime += deltaTime;

        // Check game over
        if (this.gameTime >= this.gameDuration) {
            this.endGame();
            return;
        }

        // Update time display
        const timeLeft = Math.ceil((this.gameDuration - this.gameTime) / 1000);
        document.getElementById('game-time').textContent = timeLeft;

        // Spawn toilets
        if (this.gameTime - this.lastToiletSpawn > this.toiletSpawnInterval) {
            this.spawnToilet();
            this.lastToiletSpawn = this.gameTime;
        }

        // Update poops
        this.poops = this.poops.filter(poop => poop.active);

        // Update toilets
        this.toilets.forEach(toilet => {
            toilet.x += toilet.speed;

            // Remove if off screen
            if (toilet.x < -100 || toilet.x > this.canvas.width + 100) {
                toilet.active = false;
            }
        });
        this.toilets = this.toilets.filter(toilet => toilet.active);

        // Check collisions
        this.poops.forEach(poop => {
            this.toilets.forEach(toilet => {
                if (poop.active && toilet.active &&
                    poop.x > toilet.x && poop.x < toilet.x + toilet.width &&
                    poop.y > toilet.y && poop.y < toilet.y + toilet.height) {
                    poop.active = false;
                    toilet.active = false;
                    this.score += 10;
                    document.getElementById('game-score').textContent = this.score;
                }
            });
        });
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player (hand)
        this.ctx.font = '40px Arial';
        this.ctx.fillText('👋', this.player.x, this.player.y + 40);

        // Draw poops
        this.poops.forEach(poop => {
            this.ctx.font = '20px Arial';
            this.ctx.fillText('💩', poop.x - 10, poop.y + 10);
        });

        // Draw toilets
        this.toilets.forEach(toilet => {
            this.ctx.font = '50px Arial';
            this.ctx.fillText('🚽', toilet.x, toilet.y + 50);
        });
    }

    endGame() {
        this.gameActive = false;

        // Show final score
        const finalMessage = document.createElement('div');
        finalMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10;
        `;
        finalMessage.innerHTML = `
            <h3 style="font-size: 2rem; margin-bottom: 1rem;">🎉 Partie terminée !</h3>
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">Score final: <strong>${this.score}</strong></p>
            <button onclick="this.parentElement.remove()" style="padding: 0.75rem 2rem; background: #414A37; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">OK</button>
        `;
        document.getElementById('game-modal').querySelector('.game-content').appendChild(finalMessage);
    }

    gameLoop() {
        if (!this.gameActive) return;

        const now = Date.now();
        const deltaTime = 16; // ~60fps

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('game-egg-btn')) {
        const game = new PoopShooterGame();
        game.init();
    }
});
