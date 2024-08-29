export class Vec2D {
    constructor(x, y) {
        //x,y components
        this.x = x;
        this.y = y;
    }

    add (vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    getMagnitude() {
        //apply magnitude of vector formula
        return Math.floor(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }
 }