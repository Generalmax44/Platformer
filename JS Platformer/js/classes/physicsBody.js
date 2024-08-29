import { Rect } from "./rect.js"
import { Vec2D } from "./vec2D.js";

export class PhysicsBody {
    constructor (x, y, width, height, color) {
        this.pos = new Vec2D(x, y);
        this.width = width;
        this.height = height;
        this.color = color 

        this.rect = new Rect(this.pos, this.width, this.height);
    }

    update(rects, gravity) {
        this.applyGravity(gravity);

        rects.forEach(rect => this.testCollisions(rect));

        this.pos.add(this.vel);
    }

    draw(context) {
        this.rect.draw(context, this.color);
    }


    applyGravity (gravity) {
        //constantly increase downwards velocity to simulate gravitational force
        this.acc.y = gravity;
        this.vel.add(this.acc);
        this.vel.y =  Math.round(this.vel.y * 10) / 10;
    }

    testCollisions(rect) {
        //create tempory rect with pos = pos + vel
        let testPos = new Vec2D(this.pos.x + this.vel.x, this.pos.y + this.vel.y)
        let testRect = new Rect(testPos, this.width, this.height)
        
        //test if temp rect collides with parameter rect
        //make comparison between the current location of the physicsObject and the parameter rect to deterine on what edge collision occours
        if (testRect.collide(rect)){  
            if (this.pos.x + this.width <= rect.pos.x) {
                this.pos.x = rect.pos.x - this.width
                this.vel.x = 0;
                // console.log("Left");
            } else if (this.pos.x >= rect.pos.x + rect.width) {
                this.pos.x = rect.pos.x + rect.width
                this.vel.x = 0;
                // console.log("Right");
            }

            if (this.pos.y + this.height <= rect.pos.y) {
                this.pos.y = rect.pos.y - this.height;
                this.vel.y = 0;
                this.canJump = true;
                this.doubleJump = true;
                // console.log(this.acc.y);

            } else if (this.pos.y >= rect.pos.y + rect.height) {
                this.pos.y = rect.pos.y + rect.height;
                this.vel.y = 0;
                // console.log("Bottom");
            }
        }
    }
}