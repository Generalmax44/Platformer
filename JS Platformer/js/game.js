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
            window.addEventListener('keydown', (event) => {
                this.handleKeyDown(event)
                // if (this.gameState == 'play') {
                //     if (this.alive) {
                //         this.player.attemptDoubleJump();
                //     }
                // }
            });
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
        this.money = 0;

        this.reloadCooldown = 1000; 

        this.playerMagSize = 1;
        this.reloading = false;

        this.infiniteAmmo = false;

        // this.canDoubleJump = true;
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
    
                this.player.update(this.keys, this.canvas.width, this.canvas.height, this.environmentEntities, this.gravity);
            
                this.enemies.forEach(enemy => enemy.update(this.canvas.width, this.canvas.height, this.environmentEntities, this.gravity));
                
                this.playerEnemyCollisions();
    
                this.bullets.forEach(bullet => bullet.update());
    
                this.bulletCleanUp();
    
                this.bulletEnemyCollisions();
    
                this.bulletEnvironmentCollisions();
    
                this.playerCoinCollisions();
    
                this.spawnEnemies();

                this.updatePlayerMag();
            }
        }

        if (this.gameState == 'shop') {
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gameState == "play") {
            this.player.draw(this.context);
            this.environmentEntities.forEach(obj => obj.draw(this.context));
            this.enemies.forEach(enemy => enemy.draw(this.context));
            this.bullets.forEach(bullet => bullet.draw(this.context));
            this.coins.forEach(coin => coin.draw(this.context));
            this.displayScore();
            this.displayMoney(80);
            this.displayMagCount();
            if (!this.alive) {
                this.displayGameOver();
                this.gameOverButtons.forEach(button => button.draw(this.context));
            } else {
                this.gameButtons.forEach(button => button.draw(this.context));
                this.reloadIndicator();
            }      
        }

        if (this.gameState == 'shop') {
            this.shopButtons.forEach(button => button.draw(this.context));
            this.displayMoney(40);
            this.displayShopTitle();
            this.displayShopOptions();
        }    
    }

//////////////////////////////////// PreFlight Functions ////////////////////////////////////

    playPreFlight() {
        this.gameState = "play";

        this.player = new player(20, 20, this.playerWidth, this.playerHeight, this.playerColor, this.playerSpeed, this.jumpPower, this.canDoubleJump);

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

        this.bulletsRemaining = this.playerMagSize;

        this.enemies = [];

        this.coins = [];

        this.score = 0;

        this.lastReloadTime = -this.reloadCooldown; // Initialize last shot time

        this.alive = true;

        this.gameButtons = [
            // new Button(20, 20, 100, 60, 'lime', 'green', "Upgrade", 12, 35, this.reloadTimeUpgrade.bind(this)),
            // new Button(400, 400, 100, 100, 'grey', 'red') 
        ];

        this.gameOverButtons = [
            new Button(this.canvas.width / 2 - 120, 400, 100, 60, 'rgb(0, 204, 0)', 'rgb(51, 255, 51)', "Again", 24, 35, this.playAgain.bind(this)),
            new Button(this.canvas.width / 2 + 20, 400, 100, 60, 'rgb(204, 0, 204)', 'rgb(255, 51, 255)', "Shop", 27, 35, this.shopPreFlight.bind(this))
        ]
    }

    shopPreFlight() {
        this.gameState = "shop";

        this.shopButtons = [
            new Button(20, 230, 100, 60, 'lime', 'green', "Purchase", 8, 35, this.reloadTimeUpgrade.bind(this)),
            new Button(350, 230, 100, 60, 'lime', 'green', "Purchase", 8, 35, this.magCapacityUpgrade.bind(this)),

            new Button(this.canvas.width - 120, this.canvas.height - 80, 100, 60, 'lime', 'green', "Play", 30, 35, this.playPreFlight.bind(this))
        ];
    }

//////////////////////////////////// Button Functions ////////////////////////////////////
    
    reloadTimeUpgrade() {
        console.log("CLick")
        if (this.reloadCooldown != 100) {
            console.log(this.money);
            if (this.money >= 5) {
                this.money -= 5;
                this.reloadCooldown -= 100;
                console.log(this.reloadCooldown)
            }
        }
    }

    playAgain() {
        this.enemies = [];
        this.bullets = [];
        this.coins = [];
        this.player.pos.x = 20;
        this.player.pos.y = 20;
        this.score = 0;
        this.alive = true;
    }

    updateButtonLocation() {
        this.gameOverButtons[0].pos.x = this.canvas.width / 2 - 120;
        this.gameOverButtons[1].pos.x = this.canvas.width / 2 + 20;
    }

    magCapacityUpgrade() {
        if (this.money >= 5) {
            this.money -= 5;
            this.playerMagSize += 1;
        }
    }

//////////////////////////////////// Event Functions ////////////////////////////////////
   
    click () {
        if (this.gameState == 'play') {
            if (this.alive) {
                let active = false;
                this.gameButtons.forEach(button => {
                    if (button.active) {
                        button.func(); 
                        active = true;
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
                    // console.log(button)
                    button.func(this); 
                } 
            });
        }
        
    }

    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                this.keys.up = true;
                break;

            case 'ArrowDown':
                this.keys.down = true;
                break;

            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = true;
                break;

            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = true;
                break;
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case 'ArrowUp':
                case 'w':
                case 'W':
                case ' ':
                    this.keys.up = false;
                    break;
    
                case 'ArrowDown':
                    this.keys.down = false;
                    break;
    
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = false;
                    break;
    
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = false;
                    break;
        }
    }

//////////////////////////////////// Bullet Functions ////////////////////////////////////
    
    fireBullet() {
        // Check if enough time has passed since the last shot
        if (this.bulletsRemaining > 0) {
            this.bulletsRemaining -= 1;
            this.bullets.push(new Bullet(this.player.pos.x + Math.floor(this.player.width / 2), this.player.pos.y + Math.floor(this.player.height / 2), 5, 'black', new Vec2D(event.clientX, event.clientY), this.bulletSpeed));
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
        let difficulty = Math.floor(this.score / (5 * 5)) + 1;
        console.log(difficulty)
        if (this.enemies.length < difficulty) {
            this.enemies.push(new Enemy(this.getRandomInt(30, this.canvas.width - 55), -this.enemyHeight - 5, this.enemyWidth, this.enemyHeight, this.enemyColor, this.enemySpeed));
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
                    this.bullets.splice(i, 1);
                    enemy.health -=1;
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.score += 5;
                        this.coins.push(new Coin(enemy.pos.x + this.enemyWidth / 2, enemy.pos.y + this.enemyHeight / 2, 10, 'yellow'));
                        break;
                    }
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

    updatePlayerMag() {
        const currentTime = performance.now();
        if (this.bulletsRemaining == 0 && !this.reloading) {
            this.lastReloadTime = currentTime; // Update the last shot time
            this.reloading = true;
        }
        
        if (currentTime - this.lastReloadTime >= this.reloadCooldown && this.reloading) {
            this.bulletsRemaining = this.playerMagSize;
            this.reloading = false;
        }
    }

//////////////////////////////////// Auxillary Draw Functions ////////////////////////////////////

    reloadIndicator () {
        const rect1Width = 100;
        const rectHeight = 20;
        const rectX = this.canvas.width - rect1Width - 10; // 10px margin from the right
        const rectY = this.canvas.height - rectHeight - 10; // 10px margin from the bottom

        // Draw the rectangle
        this.context.fillStyle = 'red'; // Rectangle color
        this.context.fillRect(rectX, rectY, rect1Width, rectHeight);

        const currentTime = performance.now();
        let rect2Width = 0;
        // console.log((currentTime - this.lastReloadTime) / this.reloadCooldown * 100);
        if (currentTime - this.lastReloadTime >= this.reloadCooldown) {
            rect2Width = 100;
            this.context.fillStyle = 'lime';
        } else{
            rect2Width = ((currentTime - this.lastReloadTime) / this.reloadCooldown) * 100;
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

    displayMoney(y) {
        this.context.font = "30px Arial";
        this.context.fillStyle = "black";
        let text = "Money: $" + this.money;
        this.context.fillText(text, this.canvas.width - this.context.measureText(text).width - 20, y);
    }

    displayGameOver() {
        this.context.font = "90px Arial";
        this.context.fillStyle = "red";
        let text = "GAME OVER"
        this.context.fillText(text, 450, 375);
    }

    displayMagCount() {
        let x;
        if (this.playerMagSize < 10) {x = 170}
        else {x = 200}
        this.context.font = "30px Arial";
        this.context.fillStyle = "black";
        let text = this.bulletsRemaining + "/" + this.playerMagSize;
        this.context.fillText(text, this.canvas.width - x, this.canvas.height - 10);
    }

    displayShopTitle() {
        this.context.font = "60px Arial";
        this.context.fillStyle = "black";
        let text = "PURCHASE UPGRADES"
        this.context.fillText(text, 375, 70); //325
    }

    displayShopOptions() {
        this.context.font = "25px Arial";
        this.context.fillStyle = "black";

        let text = "Decrease reload time"
        this.context.fillText(text, 20, 150);
        text = "Current reload time: " + this.reloadCooldown/1000 + "s";
        this.context.fillText(text, 20, 180);
        text = "Cost: $5";
        this.context.fillText(text, 20, 210);

        text = "Increase magazine capacity"
        this.context.fillText(text, 350, 150);
        text = "Current magazine capacity: " + this.playerMagSize;
        this.context.fillText(text, 350, 180);
        text = "Cost: $5";
        this.context.fillText(text, 350, 210);
    }

//////////////////////////////////// Auxillary Functions ////////////////////////////////////

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

