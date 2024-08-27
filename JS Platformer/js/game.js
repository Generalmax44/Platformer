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

        this.configPath = 'js/config.json'; // Store the path for later use
        this.dataLoaded = false;
        this.loadData().then(() => {
            this.dataLoaded = true; // Mark data as loaded
            this.initialize(); // Optional: call a method to use data in constructor
          });
    }

    async loadData() {
        try {
          const response = await fetch(this.configPath); // Fetch the JSON file
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

//////////////////////////////////// Initialize Functions ////////////////////////////////////

    initialize() {
        if (this.dataLoaded) {

            this.initKeys();
            this.setupEventListeners();
            this.resizeCanvas();

            this.initializeGameVariables();

            this.playPreFlight();

            this.gameLoop();
        }
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

    setupEventListeners() {
            window.addEventListener('resize', () => {
                this.resizeCanvas();
                this.updateButtonLocation();
            });
            window.addEventListener('keydown', (event) => this.handleKeyDown(event));
            window.addEventListener('keyup', (event) => this.handleKeyUp(event));
            window.addEventListener('click', (event) => this.click(event));
            window.addEventListener('blur', () => this.initKeys());
            window.addEventListener('mousemove', (event) => {
                if (this.gameState == 'play') {
                    this.gameButtons.forEach(button => {
                        button.update(event.clientX, event.clientY);
                    });
                
                    this.gameOverButtons.forEach(button => {
                        button.update(event.clientX, event.clientY);
                    });
                }

                if (this.gameState == 'shop') {
                    this.shopButtons.forEach(button => {
                        button.update(event.clientX, event.clientY);
                    });
                }
            });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initializeGameVariables() {
        this.money = 100;

        this.shootCooldown = 1000; 
    }

//////////////////////////////////// Game Loop ////////////////////////////////////

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.gameState == 'play') {
            this.updateGround();
            if (this.alive) {
    
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
        }

        if (this.gameState == 'shop') {
            console.log(this.shootCooldown);
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gameState == "play") {
            this.player.draw(this.context);
            this.enemies.forEach(enemy => enemy.draw(this.context));
            this.environmentEntities.forEach(obj => obj.draw(this.context));
            this.bullets.forEach(bullet => bullet.draw(this.context));
            this.coins.forEach(coin => coin.draw(this.context));
            this.displayScore();
            this.displayMoney(80);
            if (!this.alive) {
                this.displayGameOver();
                this.gameOverButtons.forEach(button => button.draw(this.context));
            } else {
                this.gameButtons.forEach(button => button.draw(this.context));
                this.ShootCooldownIndicator();
            }      
        }

        if (this.gameState == 'shop') {
            this.shopButtons.forEach(button => button.draw(this.context));
            this.displayMoney(40);
        }    
    }

//////////////////////////////////// PreFlight Functions ////////////////////////////////////

    playPreFlight() {
        this.gameState = "play";

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

        this.lastShotTime = -this.shootCooldown; // Initialize last shot time

        this.alive = false;

        this.gameButtons = [
            this.upgradeButton = new Button(20, 20, 100, 60, 'lime', 'green', "Upgrade", 12, 35, this.fireRateUpgrade),
            // new Button(400, 400, 100, 100, 'grey', 'red') 
        ];

        this.gameOverButtons = [
            this.playAgainButton = new Button(this.canvas.width / 2 - 120, 400, 100, 60, 'green', 'lime', "Again", 24, 35, this.playAgain),
            this.ShopButton = new Button(this.canvas.width / 2 + 20, 400, 100, 60, 'rgb(204, 0, 204)', 'rgb(255, 51, 255)', "Shop", 25, 35, this.shopPreFlight)
        ]
    }

    shopPreFlight(game) {
        game.gameState = "shop";

        game.shopButtons = [
            game.upgradeButton = new Button(20, 20, 100, 60, 'lime', 'green', "Upgrade", 12, 35, game.fireRateUpgrade)
            // new Button(400, 400, 100, 100, 'grey', 'red') 
        ];
    }

//////////////////////////////////// Button Functions ////////////////////////////////////
    
    fireRateUpgrade(game) {
        console.log("CLick")
        if (game.shootCooldown != 100) {
            console.log(game.money);
            if (game.money >= 5) {
                game.money -= 5;
                game.shootCooldown -= 100;
                console.log(game.shootCooldown)
            }
        }
    }

    playAgain(game) {
        game.enemies = [];
        game.bullets = [];
        game.coins = [];
        game.player.pos.x = 20;
        game.player.pos.y = 20;
        game.score = 0;
        game.alive = true;
    }

    updateButtonLocation() {
        this.playAgainButton.pos.x = this.canvas.width / 2 - 120;
        this.ShopButton.pos.x = this.canvas.width / 2 + 20;
    }

//////////////////////////////////// Event Functions ////////////////////////////////////
   
    click (event) {
        if (this.gameState == 'play') {
            if (this.alive) {
                let active = false;
                this.gameButtons.forEach(button => {
                    if (button.active) {
                        button.func(this); 
                        // active = true;
                    } 
                });
                
                if (!active) {
                    this.fireBullet();
                }
    
       
    
            } else if (!this.alive) {
                this.gameOverButtons.forEach(button => {
                    if (button.active) {
                        button.func(this); 
                    }
                });
            } 
        }

        if (this.gameState == 'shop') {
            this.shopButtons.forEach(button => {
                if (button.active) {
                    console.log(button)
                    button.func(this); 
                } 
            });
        }
        
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
            case 'A':
                this.keys.a = true;
                break;
            case 'd':
            case 'D':
                this.keys.d = true;
                break
            case 'w':
            case 'W':
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
            case 'A':
                this.keys.a = false;
                break;
            case 'd':
            case 'D':
                this.keys.d = false;
                break;
            case 'w':
            case 'W':
                this.keys.w = false;
                break
        }
    }

//////////////////////////////////// Bullet Functions ////////////////////////////////////
    
    fireBullet() {
        const currentTime = performance.now();
            // Check if enough time has passed since the last shot
            if (currentTime - this.lastShotTime >= this.shootCooldown && this.alive) {
                this.bullets.push(new Bullet(this.player.pos.x + Math.floor(this.player.width / 2), this.player.pos.y + Math.floor(this.player.height / 2), 5, 'black', new Vec2D(event.clientX, event.clientY)));
              this.lastShotTime = currentTime; // Update the last shot time
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

//////////////////////////////////// Enemy Functions ////////////////////////////////////

    spawnEnemies() {
        if (this.enemies.length == 0) {
            this.enemies.push(new Enemy(this.getRandomInt(5, this.canvas.width - 55), -55, this.enemyWidth, this.enemyHeight, 'red', this.enemySpeed));
        }
    }

//////////////////////////////////// Collision Detection Functions ////////////////////////////////////

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
                // console.log("Die");
            }
        });
    }

//////////////////////////////////// Auxillary Update Functions ////////////////////////////////////
    
    updateGround() {
        this.environmentEntities.forEach(entity => {
            if (entity instanceof Ground) {
                entity.update(this.canvas.width, this.canvas.width);
            }
        });
    }

//////////////////////////////////// Auxillary Draw Functions ////////////////////////////////////

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

    displayScore() {
        this.context.font = "30px Arial";
        this.context.fillStyle = "black";
        let text = "Score: " + this.score;
        this.context.fillText(text, this.canvas.width - this.context.measureText(text).width - 20, 40);
    }

    displayMoney(x) {
        this.context.font = "30px Arial";
        this.context.fillStyle = "black";
        let text = "Money: $" + this.money;
        this.context.fillText(text, this.canvas.width - this.context.measureText(text).width - 20, x);
    }

    displayGameOver() {
        this.context.font = "90px Arial";
        this.context.fillStyle = "red";
        let text = "GAME OVER"
        this.context.fillText(text, 450, 375);
    }

//////////////////////////////////// Auxillary Functions ////////////////////////////////////

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

