import { PhysicsBody } from './physicsBody.js';
import { player } from './player.js';
import { Ground } from './ground.js';
import { Rect } from './rect.js';
import { Vec2D } from './vec2D.js';

export class Game {
    constructor () {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');

        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.groundSize = 50

        this.player = new player(20, 20, 50, 50, 'blue', 5);
        this.enemy = new PhysicsBody (200, 300, 50, 50, 'red')
        this.ground = new Ground(0, window.innerHeight - this.groundSize, window.innerWidth, this.groundSize, 'green');


        this.setupEventListeners();

        this.resizeCanvas();

        this.gameLoop();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
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
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    checkCollision(rect1, rect2) {
        if (rect1.pos.y + rect1.height > rect2.pos.y && rect1.pos.y < rect2.pos.y + rect2.height) {
            if (rect1.pos.x + rect1.width > rect2.pos.x && rect1.pos.x < rect2.pos.x + rect2.width) {
                return true;
            }
        }
    }

    update() {
        this.player.update(this.keys, this.canvas.width, this.canvas.height);
        if (this.checkCollision(this.player.rect, this.ground.rect)){
            this.player.pos.y = this.ground.pos.y - this.player.height
            console.log("collision")
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.context);
        this.enemy.draw(this.context);
        this.ground.draw(this.context);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }


}

