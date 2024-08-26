import { PhysicsBody } from "./physicsBody.js";
import { player } from "./player.js";
import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Enemy extends PhysicsBody {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
        this.gravity = .7

        this.vel = new Vec2D(0, 0)
        this.acc = new Vec2D(0, 0)

        this.direction = 1
        this.speed = 2
    }

    update(canvasWidth, canvasHeight, rects, playerPos) {
        this.updateVel();
        // this.aI(playerPos);

        super.update(rects);
        this.checkBoundaries(canvasWidth, canvasHeight);
        // console.log(this.direction);
    }

    aI (playerPos) {
        if (playerPos.x < this.pos.x) {
            this.direction = -1;
        } else if (playerPos.x > this.pos.x) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }
        this.vel.x = this.direction * this.speed;
    }
    updateVel() {
        this.vel.x = this.direction * this.speed;
    }

    checkBoundaries (canvasWidth, canvasHeight) {
        if (this.pos.x + this.width >= canvasWidth) {
            this.pos.x = canvasWidth - this.width;
            this.direction = -this.direction;
        }

        if (this.pos.x <= 0) {
            this.pos.x = 0;
            this.direction *= -1
        }
    }
}
