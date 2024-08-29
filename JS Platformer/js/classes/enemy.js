import { PhysicsBody } from "./physicsBody.js";
import { player } from "./player.js";
import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Enemy extends PhysicsBody {
    constructor(x, y, width, height, color, speed, maxHealth) {
        super(x, y, width, height, color)
        
        this.vel = new Vec2D(0, 0)
        this.acc = new Vec2D(0, 0)

        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.speed = speed

        this.maxHealth = maxHealth
        this.health = this.maxHealth;
    }

    update(canvasWidth, canvasHeight, rects, gravity, playerPos) {
        this.updateVel();
        this.aI(playerPos);

        super.update(rects, gravity);
        this.checkBoundaries(canvasWidth, canvasHeight);
        // console.log(this.direction);
    }

    draw(context) {
        super.draw(context);
        this.displayHealthBar(context);
    }

    aI (playerPos) {
        //move towards player when on the same x coord
        if (playerPos.y == this.pos.y) {
            if (playerPos.x < this.pos.x) {
                this.direction = -1;
            } else if (playerPos.x > this.pos.x) {
                this.direction = 1;
            } else {
                this.direction = 0;
            }
        }
        this.vel.x = this.direction * this.speed;
    }

    updateVel() {
        this.vel.x = this.direction * this.speed;
    }

    checkBoundaries (canvasWidth, canvasHeight) {
        //if enemy hits edge of screen, change direction
        if (this.pos.x + this.width >= canvasWidth) {
            this.pos.x = canvasWidth - this.width;
            this.direction = -this.direction;
        }

        if (this.pos.x <= 0) {
            this.pos.x = 0;
            this.direction *= -1
        }
    }

    displayHealthBar(context) {
        // when enemy less then full health display health bar
        if (this.health != this.maxHealth) {
        
        let width = (this.health / this.maxHealth) * this.width
        context.fillStyle = 'red';
        context.fillRect(this.pos.x, this.pos.y + this.height + 5, this.width, 10);
        context.fillStyle = 'lime';
        context.fillRect(this.pos.x, this.pos.y + this.height + 5, width, 10);
        }
    }    
}
