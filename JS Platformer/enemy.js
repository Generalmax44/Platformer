import { PhysicsBody } from "./physicsBody.js";
import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Enemy extends PhysicsBody {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
        this.gravity = .3

        this.vel = new Vec2D(0, 0)
        this.acc = new Vec2D(0, 0)
    }

    update(rects) {
        super.update(rects);
    }
}
