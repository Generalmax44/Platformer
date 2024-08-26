import { PhysicsBody } from './physicsBody.js';
import { player } from './player.js';
import { Ground } from './ground.js';
import { Rect } from './rect.js';
import { Vec2D } from './vec2D.js';
import { Platform } from './platform.js';
import { Enemy } from './enemy.js';
import { Bullet } from './bullet.js';


export class Game {
    constructor () {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');

        this.groundSize = 50

        this.player = new player(20, 20, 50, 50, 'blue', 7);

        this.environmentEntities = [
            new Ground(0, window.innerHeight - this.groundSize, window.innerWidth, this.groundSize, 'green'),
            new Platform(200, 600, 300, 20, 'orange')
        ];

        this.bullets = [];

        this.enemies = [
            new Enemy (900, 200, 50, 50, 'red')
        ];

        this.score = 0;

        this.initKeys();
        this.setupEventListeners();
        this.resizeCanvas();
        this.gameLoop();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
        window.addEventListener('click', (event) => this.click(event));
        window.addEventListener('blur', () => this.initKeys());
    }

    initKeys () {
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
            a: false,
            d: false,
            w: false
        };
    }

    click (event) {
        this.bullets.push(new Bullet(this.player.pos.x + Math.floor(this.player.width / 2), this.player.pos.y + Math.floor(this.player.height / 2), new Vec2D(event.clientX, event.clientY), 5, 'black'));
    }

    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
                this.keys.up = true;
                break;
            case 'ArrowDown':
                this.keys.down = true;
                break;
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case ' ':
                this.keys.space = true;
                break;
            case 'a':
                this.keys.a = true;
                break;
            case 'd':
                this.keys.d = true;
                break
            case 'w':
            this.keys.w = true;
            break
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case 'ArrowUp':
                this.keys.up = false;
                break;
            case 'ArrowDown':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case ' ':
                this.keys.space = false;
                break;
            case 'a':
                this.keys.a = false;
                break;
            case 'd':
                this.keys.d = false;
                break;
            case 'w':
                this.keys.w = false;
                break
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bulletEnemyCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
        
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                let enemy = this.enemies[j];
        
                if (bullet.rect.collide(enemy.rect)) {
                    // Remove enemy and bullet from their respective arrays
                    this.enemies.splice(j, 1);
                    this.bullets.splice(i, 1);
                    this.score += 5;
        
                    // Break out of the inner loop since the bullet has already been removed
                    break;
                }
            }
        }
    }

    bulletEnvironmentCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
        
            for (let j = this.environmentEntities.length - 1; j >= 0; j--) {
                let obj = this.environmentEntities[j];
        
                if (bullet.rect.collide(obj.rect)) {
                    // Remove enemy and bullet from their respective arrays
                    this.bullets.splice(i, 1);
                    console.log("Sugma Ballz");
        
                    // Break out of the inner loop since the bullet has already been removed
                    break;
                }
            }
        }
    }

    bulletCleanUp() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            if (bullet.pos.x > this.canvas.width + 10 || bullet.pos.x < -10 || bullet.pos.y < -10) {
                // Remove enemy and bullet from their respective arrays
                this.bullets.splice(i, 1);
                console.log("Sugma Ballz");
    
                // Break out of the inner loop since the bullet has already been removed
                break;
            }
        }
    }

    displayScore() {
        this.context.font = "30px Arial";
        this.context.fillStyle = "black";
        let text = "Score: " + this.score;
        this.context.fillText(text, this.canvas.width - this.context.measureText(text).width - 20, 40);
    }

    update() {
        this.environmentEntities.forEach(entity => {
            if (entity instanceof Ground) {
                entity.update(this.canvas.width, this.canvas.width)
            }
        });

        this.player.update(this.keys, this.canvas.width, this.canvas.height, this.environmentEntities);
       
        this.enemies.forEach(enemy => enemy.update(this.canvas.width, this.canvas.height, this.environmentEntities, this.player.pos));
           
        this.enemies.forEach(enemy => {
            if (enemy.rect.collide(this.player.rect)) {
                console.log("Die");
            }
        });

        this.bullets.forEach(bullet => bullet.update());
        this.bulletCleanUp();

        this.bulletEnemyCollisions();
        this.bulletEnvironmentCollisions();
        console.log(this.bullets.length);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.context);
        this.enemies.forEach(enemy => enemy.draw(this.context));
        this.environmentEntities.forEach(obj => obj.draw(this.context));
        this.bullets.forEach(obj => obj.draw(this.context));
        this.displayScore();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

