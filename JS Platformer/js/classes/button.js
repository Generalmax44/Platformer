import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Button {
    constructor(x, y, w, h, inactiveColor, activeColor, func) {
        this.pos = new Vec2D(x, y);
        this.width = w;
        this.height = h;
        this.inactiveColor = inactiveColor;
        this.activeColor = activeColor;
        this.func = func;

        this.active = false;

        this.color = inactiveColor;

        this.rect = new Rect(this.pos, this.width, this.height);
    }

    update(mousePosX, mousePosY) {
        if (mousePosX > this.pos.x && mousePosX < this.pos.x + this.width) {
            if (mousePosY > this.pos.y && mousePosY < this.pos.y + this.height) {
                this.active = true;
            }
        } else {
            this.active = false;
        }

        if (this.active) {
            this.color = this.activeColor;
        } else {
            this.color = this.inactiveColor;
        }
    }

    draw(context) {
        this.rect.draw(context, this.color);
    }
}