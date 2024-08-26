import { Vec2D } from "./vec2D.js";

export class Bullet {
    constructor(x, y, target, radius, color) {
        this.x = x;
        this.y = y; 
        this.target = target;
        this.radius = radius;
        this.color = color;
        this.vel = new Vec2D(0, 0)

        this.speed = 3
        this.direction = new Vec2D(this.target.x - this.x, this.target.y - this.y);
    }

    update() {
        this.vel.x = this.speed * (this.direction.x / this.coolMath());
        this.vel.y = this.speed * (this.direction.y / this.coolMath());

        this.x += this.vel.x
        this.y += this.vel.y
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        
        context.fillStyle = this.color;
        context.fill();
    }

    coolMath() {
        return Math.floor(Math.sqrt(Math.pow(this.direction.x, 2) + Math.pow(this.direction.y, 2)));
    }
}
