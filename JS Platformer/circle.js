import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Circle {
    constructor(x, y, radius, color) {
        this.pos = new Vec2D(x, y);
        this.radius = radius;
        this.color = color;

        this.rect = new Rect(new Vec2D(this.pos.x - this.radius, this.pos.y - this.radius), this.radius * 2, this.radius * 2)
    }

    draw(context) {
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        
        context.fillStyle = this.color;
        context.fill();
    }
}