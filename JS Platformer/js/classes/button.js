import { Rect } from "./rect.js";
import { Vec2D } from "./vec2D.js";

export class Button {
    constructor(x, y, w, h, inactiveColor, activeColor, text, textX, textY, func) {
        this.pos = new Vec2D(x, y);
        this.width = w;
        this.height = h;
        this.inactiveColor = inactiveColor;
        this.activeColor = activeColor;

        this.text = text;
        this.textX = textX;
        this.textY = textY;

        this.func = func;

        this.active = false;

        this.color = inactiveColor;

        this.rect = new Rect(this.pos, this.width, this.height);
    }

    update(mousePosX, mousePosY) {
        //check if cursor hovering over button
        if ((mousePosX > this.pos.x && mousePosX < this.pos.x + this.width) && (mousePosY > this.pos.y && mousePosY < this.pos.y + this.height)) {
            this.active = true;
        } else {
            this.active = false;
        }

        //adjust color accordingly
        if (this.active) {
            this.color = this.activeColor;
        } else {
            this.color = this.inactiveColor;
        }
    }

    draw(context) {
        this.drawBorder(context);
        this.rect.draw(context, this.color);

        context.font = "20px Arial";
        context.fillStyle = "black";
        context.fillText(this.text, this.pos.x + this.textX, this.pos.y + this.textY);

    }

    drawBorder(context) {
        context.fillStyle = 'black';
        context.fillRect(this.pos.x -2 , this.pos.y -2 , this.width + 4, this.height + 4);
    }
}