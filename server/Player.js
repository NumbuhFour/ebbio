let PBody = require('./PBody.js').PBody;
let Victor = require('victor');

//@temp
const Dash = require('./abilities/dash').DashAbility;

const PLAYER_STATE = {
    'DEFAULT': 0,
    'INVULNERABLE': 1
};

class Player{
    constructor(id){
        this.id = id;
        this.state = PLAYER_STATE.DEFAULT;
        this.color = global.randomFromArray(global.PALETTE.PLAYER) || 'white';

        this.pbody = new PBody();
        this.speed = 10;
        this.maxSpeed = 10;

        this.dash = new Dash();

        // Event/input handlers
        this._onCollision = undefined;
        this._onClick = (mouseVector) => {
          this.dash.dash(this, new Victor(mouseVector.x, mouseVector.y));//???
        };
        this._onRightClick = undefined;
    }

    get onCollision(){
        if(this._onCollision) return this._onCollision;
        return () => {};
    }

    get onClick(){
        if(this._onClick) return this._onClick;
        return () => {};
    }

    get onRightClick(){
        if(this._onRightClick) return this._onRightClick;
        return () => {};
    }

    moveToMouse(data){
        // Camera coords in world space
        let cameraLoc = new Victor(this.pbody.loc.x + data.w/2, this.pbody.loc.y + data.h/2);
        // Mouse coords in world space
        let mouseLoc = cameraLoc.clone().subtract(new Victor(data.x, data.y));
        // Vector from player to mouse
        let playerToMouse = this.pbody.loc.clone().subtract(mouseLoc);

        // If the mouse is close enough to the player, hold still
        if(playerToMouse.magnitude() < 10){
            this.pbody.vel.x = this.pbody.vel.y = 0;
            return;
        }

        // Vector from player to mouse
        let force = playerToMouse.normalize();
        force.x *= this.speed;
        force.y *= this.speed;
        this.pbody.applyForce(force);
    }

    update(){
        this.pbody.move(this.maxSpeed);
        this.dash.update(this);
    }
}

module.exports.Player = Player;