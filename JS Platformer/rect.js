export class Rect {
    constructor (pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
    }
    update(pos) {
        this.pos = pos;
    }
    draw (context, color) {
        context.fillStyle = color;
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}