import { PhysicsBody } from "./physicsBody.js";
import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class player extends PhysicsBody {
    constructor(x, y, width, height, color, speed, jumpPower) {
        super(x, y, width, height, color);
        
        this.speed = speed;

        this.jumpPower = jumpPower;

        this.doubleJump = true;

        this.vel = new Vec2D(0, 0);
        this.acc = new Vec2D(0, 0);

        this.canJump = false;
    }

    update(keys, canvasWidth, canvasHeight, rects, gravity) {
        this.updateVel(keys);
        
        this.vel.x *= this.speed;
        // this.vel.y *= this.speed;


        super.update(rects, gravity);

        if (keys.space || keys.w || keys.up) {
            this.jump();
        }

        this.checkBoundaries(canvasWidth, canvasHeight);

        this.rect.update(this.pos);
    }

    jump() {
        if (this.canJump) {
            this.vel.y = -this.jumpPower;
            this.canJump = false;
        } 
    }

    updateVel (keys) {
        if ((keys.d || keys.right) && (keys.left || keys.a)) {
            this.vel.x = 0;
        } else if (keys.right || keys.d) {
            this.vel.x = 1;
        } else if (keys.left || keys.a) {
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
    }
}