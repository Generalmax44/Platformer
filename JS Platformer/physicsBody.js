import { Rect } from "./rect.js"
import { Vec2D } from "./vec2D.js";

export class PhysicsBody {
    constructor (x, y, width, height, color, speed) {
        this.pos = new Vec2D(x, y);
        this.width = width;
        this.height = height;
        this.color = color 

        this.vel = new Vec2D(0, 0)
        this.speed = speed

        this.rect = new Rect(this.pos, this.width, this.height);
    }
    update(keys, canvasWidth, canvasHeight) {
        if (keys.right && keys.left) {
            this.vel.x = 0;
        } else if (keys.right) {
            this.vel.x = 1;
        } else if (keys.left) {
            this.vel.x = -1;
        } else {
            this.vel.x = 0;
        }
        
        this.vel.x *= this.speed;

        this.pos.add(this.vel);

        if (this.pos.x + this.width >= canvasWidth) {
            this.pos.x = canvasWidth - this.width;
        }
        if (this.pos.x <= 0) {
            this.pos.x = 0;
        }
        
        this.applyGravity();

        this.rect.update(this.pos);
    }

    draw(context) {
        this.rect.draw(context, this.color);
    }

    applyGravity () {
        this.vel.y = + 1;
    }
}