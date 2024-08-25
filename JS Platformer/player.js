import { PhysicsBody } from "./physicsBody.js";
import { Vec2D } from "./vec2D.js";

export class player extends PhysicsBody {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        
        this.speed = speed;

        this.gravity = .3
        this.jumpPower = 10

        this.vel = new Vec2D(0, 0)

        this.acc = new Vec2D(0, 0)
    }

    update(keys, canvasWidth, canvasHeight) {
        this.updateVel(keys);
        
        this.vel.x *= this.speed;

        this.applyGravity();

        this.vel.add(this.acc);
        this.vel.y =  Math.round(this.vel.y * 10) / 10;

        this.pos.add(this.vel);
        this.checkBoundaries(canvasWidth, canvasHeight);

        this.rect.update(this.pos);
    }

    jump() {
        this.vel.y =- this.jumpPower;
    }

    applyGravity () {
        this.acc.y = this.gravity;
    }

    updateVel (keys) {
        if (keys.right && keys.left) {
            this.vel.x = 0;
        } else if (keys.right) {
            this.vel.x = 1;
        } else if (keys.left) {
            this.vel.x = -1;
        } else {
            this.vel.x = 0;
        }

        // if (keys.up && keys.dow) {
        //     this.vel.y = 0;
        // } else if (keys.up) {
        //     this.vel.y = -1;
        // } else if (keys.down) {
        //     this.vel.y = 1;
        // } else {
        //     this.vel.y = 0;
        // }
    }

    checkBoundaries (canvasWidth, canvasHeight) {
        if (this.pos.x + this.width >= canvasWidth) {
            this.pos.x = canvasWidth - this.width;
        }

        if (this.pos.x <= 0) {
            this.pos.x = 0;
        }

        // if (this.pos.y <= 0) {
        //     this.pos.y = 0;
        // }
    }
}