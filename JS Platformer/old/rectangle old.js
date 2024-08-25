export class Rectangle {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.speed = 5;

        this.getSides();
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    update(keys, canvasWidth, canvasHeight) {
        if (keys.right && keys.left) {

        } else if (keys.right) {
            this.x += this.speed;
        } else if (keys.left) {
            this.x -= this.speed;
        }

        this.getSides();

        if (this.right >= canvasWidth) {
            this.x = canvasWidth - this.w;
        }
        if (this.left <= 0) {
            this.x = 0;
        }
    }

    getSides() {
        this.right = this.x + this.w;
        this.left = this.x
    }
}