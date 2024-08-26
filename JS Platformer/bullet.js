export class Bullet {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y; 
        this.radius = radius;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        
        context.fillStyle = this.color;
        context.fill();
    }
}