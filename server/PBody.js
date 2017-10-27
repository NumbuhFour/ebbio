let Victor = require('victor');

class PBody{

    constructor(loc, vel, accel, mass){
        this.loc = loc || new Victor(0,0);
        this.vel = vel || new Victor(0,0);
        this.accel = accel || new Victor(0,0);

        this.mass = mass || 10;
        this.density = 1;

        // Percentage each tick to decrease speed when over limit
        this.overageDampening = 1;

        // Speed limit override;
        this.overrideLimit = undefined;

        this.collider = global.COLLIDER.CIRCLE;
    }

    get size(){ return this.mass * this.density; }

    // F = m * a
    applyForce(force){
        let f = force.clone();
        f.x /= this.mass;
        f.y /= this.mass;
        this.accel.add(f);

    }

    move(limit){
        if (this.overrideLimit != undefined)
            limit = this.overrideLimit;

        this.vel.add(this.accel);

        // Limit velocity
        const mag = this.vel.magnitude();
        if(mag > limit) {
            this.vel.normalize();
            const dampenedMag = mag - (mag - limit)*this.overageDampening;
            this.vel.x *= dampenedMag;
            this.vel.y *= dampenedMag;
        }

        this.loc.add(this.vel);

        this.accel.x = this.accel.y = 0;
    }

    isColliding(pb){
        switch(pb.collider){
            case COLLIDER.CIRCLE:
                let dist = this.loc.distance(pb.loc);
                if(dist < this.size + pb.size) return true;
                return false;
                break;
            case COLLIDER.SQUARE:
                // Unimplemented
                break;
            default:
                break;
        }
    }
}

module.exports.PBody = PBody;