export class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add (vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    getMagnitude() {
        return Math.floor(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }
 }