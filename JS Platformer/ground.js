import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Ground {
    constructor (x, y, width, height, color) {
        this.pos = new Vec2D(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
        
        this.rect = new Rect(this.pos, this.width, this.height);
    }
    update(canvasWidth, canvasHeight){
        this.rect.width = canvasWidth;
        this.rect.height = canvasHeight;
    }

    draw(context) {
        this.rect.draw(context, this.color);
    }
}