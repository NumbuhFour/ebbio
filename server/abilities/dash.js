
/**
 * This dash is split up into 3 sections:
 *  - Initial burst : An initial burst of force to propell the player forward
 *  - Fast coast : A period after the burst and before dash expires where the player is faster than normal
 *  - Fade : After the dash is spent, the player fades to normal speed
 */

class DashAbility {
    constructor(){
        // Stare into the void
        this.dashing = false;
        this.initialForce = 800;
        this.duration = 1300;
        this.cooldown = this.duration + 500;

        // How long to slow down to regular speed
        this.speedFadeOutLength = 600;

        // How low does dampening go?
        this.minDampening = 0.1;
        // Speed limit when coasting
        this.newSpeedLimit = 20;

        // Real-time when last dash started
        this.dashStartTime = 0;
    }

    bite(a, b){

    }

    dash(a, playerToMouse){
        if (Date.now() - this.dashStartTime > this.cooldown) {
            this.dashStartTime = Date.now();
            this.dashing = true;
            console.log('startdash');

            a.pbody.overageDampening = this.minDampening;
            a.pbody.overrideLimit = this.newSpeedLimit;
            let forceVec = playerToMouse.clone().normalize();
            forceVec.x *= this.initialForce;
            forceVec.y *= this.initialForce;
            a.pbody.applyForce(forceVec);
        }
    }

    update(a) {
        if (this.dashing) {
            const time =  Date.now() - this.dashStartTime;
            console.log('dash time', time, a.pbody.vel.magnitude());
            if (time > this.duration) {
                this.dashing = false;
                a.pbody.overageDampening = 1;
                a.pbody.overrideLimit = undefined;
            }
            else {
                // Reset limit, while slowly increasing overage dampening until matching limit
                a.pbody.overrideLimit = undefined;
                const fadePerc = (time - (this.duration - this.speedFadeOutLength)) / this.speedFadeOutLength;
                //console.log('damp', a.pbody.overageDampening, fadePerc, time );
                if (fadePerc > 0) {
                    a.pbody.overageDampening = fadePerc * (1-this.minDampening) + this.minDampening;
                }
            }
        }
    }
}

module.exports.DashAbility = DashAbility;