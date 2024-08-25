import { PhysicsBody } from "./physicsBody.js";
import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class player extends PhysicsBody {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        
        this.speed = speed;

        this.gravity = .3
        this.jumpPower = 10

        this.vel = new Vec2D(0, 0)
        this.acc = new Vec2D(0, 0)

        this.canJump = false;
    }

    update(keys, canvasWidth, canvasHeight, rects) {
        this.updateVel(keys);
        
        this.vel.x *= this.speed;
        // this.vel.y *= this.speed;

        this.applyGravity();

        this.vel.add(this.acc);
        this.vel.y =  Math.round(this.vel.y * 10) / 10;

        rects.forEach(rect => this.testCollisions(rect));

        this.pos.add(this.vel);

        this.checkBoundaries(canvasWidth, canvasHeight);

        this.rect.update(this.pos);
    }
    
    testCollisions(rect) {
        let testPos = new Vec2D(this.pos.x + this.vel.x, this.pos.y + this.vel.y)
        let testRect = new Rect(testPos, this.width, this.height)
        
        if (testRect.collide(rect)){  
            if (this.pos.x + this.width <= rect.pos.x) {
                this.pos.x = rect.pos.x - this.width
                this.vel.x = 0;
                // console.log("Left");
            } else if (this.pos.x >= rect.pos.x + rect.width) {
                this.pos.x == rect.pos.x + rect.width
                this.vel.x = 0;
                // console.log("Right");
            }

            if (this.pos.y + this.height <= rect.pos.y) {
                this.pos.y = rect.pos.y - this.height;
                this.vel.y = 0;
                this.canJump = true;
                // console.log(this.acc.y);

            } else if (this.pos.y >= rect.pos.y + rect.height) {
                this.pos.y = rect.pos.y + rect.height;
                this.vel.y = 0;
                // console.log("Bottom");
            }
        }
    }

    jump() {
        if (this.canJump) {
            this.vel.y =- this.jumpPower;
            this.canJump = false;
        }
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