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
    collide (rect) {
        if (this.pos.y + this.height > rect.pos.y && this.pos.y < rect.pos.y + rect.height) {
            if (this.pos.x + this.width > rect.pos.x && this.pos.x < rect.pos.x + rect.width) {
                return true;
            }        
        }
    }
}