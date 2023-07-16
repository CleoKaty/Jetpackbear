"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let bear;
    let hits;
    let life;
    let background;
    //let gravity: number;
    let graph;
    let cmpCamera;
    let cmpRigidbodyfussel;
    let config;
    let keywords;
    (function (keywords) {
        keywords["l"] = "l";
    })(keywords || (keywords = {}));
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        //fetch config
        let response = await fetch("config.json");
        config = await response.json();
        console.log(keywords);
        life = 3;
        //vui
        let gamestate = new Script.Gamestate(config);
        console.log(gamestate);
        //set up viewport
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        Script.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        //build world
        generateworld(config.worldlength);
        setupChar();
        cmpRigidbodyfussel = Script.fussel.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbodyfussel.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, fusselCollides);
        //start loop
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        ƒ.Physics.simulate();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
        fly();
        hurt();
        death();
        followCamera();
    }
    //functions
    function fly() {
        let cmpRigidbody = Script.character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.addVelocity(ƒ.Vector3.X(config.xpush));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            changeAnimation("fly");
            cmpRigidbody.addVelocity(ƒ.Vector3.Y(config.ypush));
        }
        else {
            changeAnimation("fall");
        }
    }
    function death() {
        if (life == 0) {
            console.log("death");
        }
    }
    function hurt() {
        if (falldeath() == true) {
            life -= 1;
        }
    }
    function setupChar() {
        // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
        Script.character = Script.viewport.getBranch().getChildrenByName("Character")[0];
        hits = Script.viewport.getBranch().getChildrenByName("Hitables")[0];
        Script.fussel = hits.getChildrenByName("Enemy")[0];
        let cmpRigidbody = Script.character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
        //cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
    }
    function falldeath() {
        let death = false;
        if (Script.character.mtxWorld.translation.y <= -3.5) {
            death = true;
        }
        return death;
    }
    function changeAnimation(_animation) {
        bear = Script.character.getChildrenByName("Bear")[0];
        let currentAnim = bear.getComponent(ƒ.ComponentAnimator).animation;
        const newAnim = ƒ.Project.getResourcesByName(_animation)[0];
        if (currentAnim != newAnim) {
            bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
        }
    }
    function followCamera() {
        let mutator = Script.character.mtxLocal.getMutator();
        Script.viewport.camera.mtxPivot.mutate({ "translation": { "x": mutator.translation.x } });
    }
    function fusselCollides(_event) {
        console.log("here");
        let vctCollision = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, Script.character.mtxWorld.translation);
        let customEvent = new CustomEvent("collide", { bubbles: true, detail: Script.fussel.getChildrenByName("Fussel") });
        if (Math.abs(vctCollision.x) <= 0 && Math.abs(vctCollision.z) < 0.1 && vctCollision.y < 0.1) { // collision next to fussel
            console.log("hit");
            Script.fussel.dispatchEvent(customEvent);
        }
    }
    //world
    function generateworld(_length) {
        let xPos = 24;
        let roomcount = 0;
        for (let y = 0; y < _length; y++) {
            createRoom(xPos, roomcount);
            xPos += 20;
            xPos += 1;
        }
    }
    function createRoom(_xPos, _roomNumber) {
        let upsi1 = new Script.upsi(_xPos);
        let downsi1 = new Script.downsi(_xPos);
        let left1 = new Script.left(_xPos);
        let right1 = new Script.right(_xPos);
        let picture1 = new Script.picture(_xPos, "room");
        let room = new ƒ.Node("room");
        background = Script.viewport.getBranch().getChildrenByName("Background")[0];
        background.addChild(room);
        let roomPlace = background.getChildrenByName("room")[_roomNumber];
        roomPlace.addChild(upsi1);
        roomPlace.addChild(downsi1);
        roomPlace.addChild(left1);
        roomPlace.addChild(right1);
        roomPlace.addChild(picture1);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class Gamestate extends ƒ.Mutable {
        points;
        health;
        controller;
        constructor(_config) {
            super();
            this.points = 0;
            this.health = _config.heart;
            let vui = document.querySelector("div#vui");
            this.controller = new ƒUi.Controller(this, vui);
        }
        reduceMutator(_mutator) { }
        ;
    }
    Script.Gamestate = Gamestate;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class reset extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(reset);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        attacktrue = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    this.node.addEventListener("collide", this.fusselreset);
                    this.node.addEventListener("far", this.fusselreset);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        fusselreset = (_event) => {
            console.log("reset");
            let max = 6;
            let min = 0;
            let randomnumber = Math.random() * (max - min) + min;
            let rigid = this.node.getComponent(ƒ.ComponentRigidbody);
            rigid.addVelocity(ƒ.Vector3.X(-5));
            this.fusselfollow(randomnumber - 3);
        };
        fusselfollow = (_randomnumber) => {
            let positionVec = new ƒ.Vector3(Script.character.mtxWorld.translation.x - 1, _randomnumber, 0);
            this.node.mtxWorld.translation = positionVec;
        };
    }
    Script.reset = reset;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class walls extends ƒ.Node {
        static wallsmesh = new ƒ.MeshCube("walls");
        static wallsmaterial = new ƒ.Material("walls", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor() {
            super("walls");
            this.addComponent(new ƒ.ComponentMesh(walls.wallsmesh));
            let cmpMaterial = new ƒ.ComponentMaterial(walls.wallsmaterial);
            cmpMaterial.clrPrimary = new ƒ.Color(165, 165, 165, 1);
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform());
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(cmpRigidbody);
            // cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, () => console.log("Collision"));
        }
    }
    Script.walls = walls;
    class upsi extends walls {
        constructor(_positionX) {
            super();
            this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
            let positionVector = new ƒ.Vector3(_positionX, 3, 0);
            this.mtxLocal.translation = positionVector;
        }
    }
    Script.upsi = upsi;
    class downsi extends walls {
        constructor(_positionX) {
            super();
            this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
            let positionVector = new ƒ.Vector3(_positionX, -4, 0);
            this.mtxLocal.translation = positionVector;
        }
    }
    Script.downsi = downsi;
    class left extends walls {
        constructor(_positionX) {
            super();
            let cmpmat = this.getComponent(ƒ.ComponentMaterial);
            this.removeComponent(cmpmat);
            let positionVector = new ƒ.Vector3(_positionX, -0.5, 1);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
        }
    }
    Script.left = left;
    class right extends walls {
        constructor(_positionX) {
            super();
            let cmpmat = this.getComponent(ƒ.ComponentMaterial);
            this.removeComponent(cmpmat);
            let positionVector = new ƒ.Vector3(_positionX, -0.5, -1);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
        }
    }
    Script.right = right;
    class picture extends ƒ.Node {
        static picturemesh = new ƒ.MeshQuad("meshpic");
        static picturemat;
        constructor(_positionX, _meterial) {
            super("picture");
            this.addComponent(new ƒ.ComponentMesh(picture.picturemesh));
            let cmpMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName(_meterial)[0]);
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform());
            let positionVector = new ƒ.Vector3(_positionX, -0.36, -0.5);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(21, 7, 1));
        }
    }
    Script.picture = picture;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let MODE;
    (function (MODE) {
        MODE[MODE["IDLE"] = 0] = "IDLE";
        MODE[MODE["ATTACK"] = 1] = "ATTACK";
    })(MODE || (MODE = {}));
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Script);
    /**
     * Instruction set to be used by StateMachine and ComponentStateMachine for this test.
     * In production code, the instructions are most likely defined within the state machines.
     */
    class Fusselactions extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(Fusselactions);
        static instructions = Fusselactions.get();
        constructor() {
            super();
            this.instructions = Fusselactions.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = Fusselactions.transitDefault;
            setup.actDefault = Fusselactions.actDefault;
            setup.setAction(MODE.IDLE, this.actIdle);
            setup.setAction(MODE.ATTACK, this.actAttack);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            console.log(MODE[_machine.stateCurrent]);
        }
        static async actIdle(_machine) {
            Script.character = Script.viewport.getBranch().getChildrenByName("Character")[0];
            _machine.node.mtxLocal.rotateZ(1);
            let posy = Script.character.mtxWorld.translation.y;
            let posyf = _machine.node.mtxWorld.translation.y;
            let posx = Script.character.mtxWorld.translation.x;
            let posxf = _machine.node.mtxWorld.translation.x;
            let distancey = posy - posyf;
            if (distancey < 0) {
                distancey *= -1;
            }
            if (distancey < 0.01 && posx > posxf) {
                console.log("attack");
                _machine.transit(MODE.ATTACK);
                let customEvent = new CustomEvent("attack", { bubbles: true });
                Script.fussel.dispatchEvent(customEvent);
            }
            else if (posx > posxf) {
                console.log("follow");
                let cmpRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
                cmpRigidbody.addVelocity(ƒ.Vector3.X(0.01));
            }
        }
        static async actAttack(_machine) {
            let cmpRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
            cmpRigidbody.addVelocity(ƒ.Vector3.X(0.05));
            let distancebetween = _machine.node.mtxWorld.translation.x - Script.character.mtxWorld.translation.x;
            if (distancebetween >= 6) {
                _machine.transit(MODE.IDLE);
                let customEvent = new CustomEvent("far", { bubbles: true });
                Script.fussel.dispatchEvent(customEvent);
            }
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    this.transit(MODE.IDLE);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    this.transit(MODE.IDLE);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.Fusselactions = Fusselactions;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map