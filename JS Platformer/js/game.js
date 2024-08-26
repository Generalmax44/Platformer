import { PhysicsBody } from './classes/physicsBody.js';
import { player } from './classes/player.js';
import { Ground } from './classes/ground.js';
import { Rect } from './classes/rect.js';
import { Vec2D } from './classes/vec2D.js';
import { Platform } from './classes/platform.js';
import { Enemy } from './classes/enemy.js';
import { Bullet } from './classes/bullet.js';
import { Coin } from './classes/coin.js';
import { Button } from './classes/button.js';


export class Game {
    constructor () {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');

        this.filePath = 'js/config.json'; // Store the path for later use
        this.dataLoaded = false;
        this.loadData().then(() => {
            this.dataLoaded = true; // Mark data as loaded
            this.initialize(); // Optional: call a method to use data in constructor
          });
    }

    async loadData() {
        try {
          const response = await fetch(this.filePath); // Fetch the JSON file
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json(); // Parse the JSON data
    
          // Dynamically assign data to instance properties
          for (const [key, value] of Object.entries(data)) {
            this[key] = value;
          }
        } catch (error) {
          console.error('Error fetching JSON data:', error);
        }
      }

    initialize() {
        if (this.dataLoaded) {

            this.player = new player(20, 20, this.playerWidth, this.playerHeight, this.playerColor, this.playerSpeed, this.jumpPower);

            this.environmentEntities = [
                new Ground(0, window.innerHeight - this.groundSize, window.innerWidth, this.groundSize, 'green'),
                new Platform(200, 100, 300, 20, 'orange'),
                new Platform(400, 600, 300, 20, 'orange'),
                new Platform(400, 350, 300, 20, 'orange'),
                new Platform(120, 500, 300, 20, 'orange'),
                new Platform(800, 300, 300, 20, 'orange'),
                new Platform(1000, 600, 300, 20, 'orange')
            ];

            this.bullets = [];

            this.enemies = [];

            this.coins = [];

            this.score = 0;
            this.money = 0;

            this.shootCooldown = 1000; 
            this.lastShotTime = -this.shootCooldown; // Initialize last shot time

            this.alive = true;

            this.buttons = [
                this.upgradeButton = new Button(20, 20, 100, 100, 'pink', 'purple'),
                // new Button(400, 400, 100, 100, 'grey', 'red') 
            ];
            this.initKeys();
            this.setupEventListeners();
            this.resizeCanvas();
            this.gameLoop();
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
        window.addEventListener('click', (event) => this.click(event));
        window.addEventListener('blur', () => this.initKeys());
        window.addEventListener('mousemove', (event) => this.buttons.forEach(button => {
            button.update(event.clientX, event.clientY);
        }));
            
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
        if (this.upgradeButton.active) {
            this.shootCooldown -= 100;

        } else{
            const currentTime = performance.now();
            // Check if enough time has passed since the last shot
            if (currentTime - this.lastShotTime >= this.shootCooldown && this.alive) {
                this.bullets.push(new Bullet(this.player.pos.x + Math.floor(this.player.width / 2), this.player.pos.y + Math.floor(this.player.height / 2), 5, 'black', new Vec2D(event.clientX, event.clientY)));
              this.lastShotTime = currentTime; // Update the last shot time
            } 
        }
    }

    ShootCooldownIndicator () {
        const rect1Width = 100;
        const rectHeight = 20;
        const rectX = this.canvas.width - rect1Width - 10; // 10px margin from the right
        const rectY = this.canvas.height - rectHeight - 10; // 10px margin from the bottom

        // Draw the rectangle
        this.context.fillStyle = 'red'; // Rectangle color
        this.context.fillRect(rectX, rectY, rect1Width, rectHeight);

        const currentTime = performance.now();
        let rect2Width = 0;
        if (currentTime - this.lastShotTime >= this.shootCooldown) {
            rect2Width = 100;
            this.context.fillStyle = 'lime';
        } else{
            rect2Width = ((currentTime - this.lastShotTime) / this.shootCooldown) * 100;
            this.context.fillStyle = 'yellow';
        }
        this.context.fillRect(rectX, rectY, rect2Width, rectHeight);    
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
                    this.coins.push(new Coin(enemy.pos.x + this.enemyWidth / 2, enemy.pos.y + this.enemyHeight / 2, 10, 'yellow'));
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

    displayMoney() {
        this.context.font = "30px Arial";
        this.context.fillStyle = "black";
        let text = "Money: $" + this.money;
        this.context.fillText(text, this.canvas.width - this.context.measureText(text).width - 20, 80);
    }

    spawnEnemies() {
        if (this.enemies.length == 0) {
            this.enemies.push(new Enemy(this.getRandomInt(5, this.canvas.width - 55), -55, this.enemyWidth, this.enemyHeight, 'red', this.enemySpeed));
        }
    }

    updateGround() {
        this.environmentEntities.forEach(entity => {
            if (entity instanceof Ground) {
                entity.update(this.canvas.width, this.canvas.width);
            }
        });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    playerCoinCollisions() {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            let coin = this.coins[i];
            if (coin.rect.collide(this.player.rect)) {
                this.coins.splice(i, 1);
                this.money += 1;
                break;
            }
        }
    }

    playerEnemyCollisions() {
        this.enemies.forEach(enemy => {
            if (enemy.rect.collide(this.player.rect)) {
                this.alive = false;
                console.log("Die");
            }
        });
    }

    displayGameOver() {
        this.context.font = "60px Arial";
        this.context.fillStyle = "red";
        let text = "GAME OVER"
        this.context.fillText(text, 200, 200);
    }

    update() {
        this.updateGround();

        this.player.update(this.keys, this.canvas.width, this.canvas.height, this.environmentEntities);
       
        this.enemies.forEach(enemy => enemy.update(this.canvas.width, this.canvas.height, this.environmentEntities, this.player.pos));
           
        this.playerEnemyCollisions();

        this.bullets.forEach(bullet => bullet.update());
        this.bulletCleanUp();

        this.bulletEnemyCollisions();
        this.bulletEnvironmentCollisions();

        this.playerCoinCollisions();

        this.spawnEnemies();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.context);
        this.enemies.forEach(enemy => enemy.draw(this.context));
        this.environmentEntities.forEach(obj => obj.draw(this.context));
        this.bullets.forEach(bullet => bullet.draw(this.context));
        this.coins.forEach(coin => coin.draw(this.context));
        this.displayScore();
        this.displayMoney();
        this.ShootCooldownIndicator();
        if (!this.alive) {
            this.displayGameOver();
        }
        this.buttons.forEach(button => button.draw(this.context));
        // this.button.draw(this.context)
    }

    gameLoop() {
        if (this.alive) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

