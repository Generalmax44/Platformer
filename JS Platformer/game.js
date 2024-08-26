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

        this.groundSize = 50
        this.player = new player(20, 20, 50, 50, 'blue', 5);
        this.enemy = new Enemy (900, 200, 50, 50, 'red')
        // this.bullet = new Bullet(100, 100, 50, 'red')

        this.collisionEntities = [
            new Ground(0, window.innerHeight - this.groundSize, window.innerWidth, this.groundSize, 'green'),
            new Platform(200, 600, 300, 20, 'orange')
        ];

        this.bullets = [];

        this.setupEventListeners();
        this.resizeCanvas();
        this.gameLoop();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
        window.addEventListener('click', (event) => this.click(event));
    }
    click (event) {
        console.log(event.clientX, event.clientY)
        this.bullets.push(new Bullet(event.clientX, event.clientY, 5, 'purple'));
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

    update() {
        if (this.keys.space || this.keys.w || this.keys.up) {
            this.player.jump();
        }
        this.player.update(this.keys, this.canvas.width, this.canvas.height, this.collisionEntities);
        this.enemy.update(this.canvas.width, this.canvas.height, this.collisionEntities, this.player.pos)
        if (this.player.rect.collide(this.enemy.rect)) {
            console.log("Ligmna")
        }

        // console.log(this.bullets.length);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.context);
        this.enemy.draw(this.context);
        this.collisionEntities.forEach(obj => obj.draw(this.context));
        this.bullets.forEach(obj => obj.draw(this.context));
        // this.bullet.draw(this.context);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

