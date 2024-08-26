import { Vec2D } from "./vec2D.js.js";
import { Rect } from "./rect.js.js";

export class Bullet {
    constructor(x, y, radius, color, target) {
        this.pos = new Vec2D(x, y);
        this.target = target;
        this.radius = radius;
        this.color = color;

        this.vel = new Vec2D(0, 0)

        this.speed = 8
        this.direction = new Vec2D(this.target.x - this.pos.x, this.target.y - this.pos.y);

        this.rect = new Rect(new Vec2D(this.pos.x - this.radius, this.pos.y - this.radius), this.radius * 2, this.radius * 2)
    }

    update() {
        this.vel.x = this.speed * (this.direction.x / this.direction.getMagnitude());
        this.vel.y = this.speed * (this.direction.y / this.direction.getMagnitude());

        this.pos.add(this.vel);
        this.updateRect();
    }

    draw(context) {
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        
        context.fillStyle = this.color;
        context.fill();
    }

    updateRect() {
        this.rect.pos.x = this.pos.x - this.radius;
        this.rect.pos.y = this.pos.y - this.radius;
    }
}
