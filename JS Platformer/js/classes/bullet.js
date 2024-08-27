import { Vec2D } from "./vec2D.js";
import { Rect } from "./rect.js";
import { Circle } from "./circle.js";

export class Bullet extends Circle {
    constructor(x, y, radius, color, target, speed) {
        super(x, y, radius, color);

        this.speed = speed

        this.vel = new Vec2D(0, 0)

        this.direction = new Vec2D(target.x - this.pos.x, target.y - this.pos.y);
    }

    update() {
        this.vel.x = this.speed * (this.direction.x / this.direction.getMagnitude());
        this.vel.y = this.speed * (this.direction.y / this.direction.getMagnitude());

        this.pos.add(this.vel);
        this.updateRect();
    }

    updateRect() {
        this.rect.pos.x = this.pos.x - this.radius;
        this.rect.pos.y = this.pos.y - this.radius;
    }
}
