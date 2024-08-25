import { PhysicsBody } from './physicsBody.js';
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

        this.player = new PhysicsBody(20, 20, 50, 50, 'blue', 5);
        this.ground = new Ground(0, window.innerHeight - 30, window.innerWidth, 30, 'green');


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

    update() {
        this.player.update(this.keys, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.context);
        this.ground.draw(this.context);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
        // console.log(this.rectangle)
    }
}