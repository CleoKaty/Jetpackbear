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
    let horrorbear;
    let hits;
    let background;
    //let gravity: number;
    let graph;
    let cmpCamera;
    let cmpRigidbodyfussel;
    let oppoTimer = 0;
    let hitme;
    let gamestate;
    let roomcount;
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
        //vui
        gamestate = new Script.Gamestate(config);
        //set up viewport
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        //build world
        generateworld(config.worldlength);
        setupChar();
        hitme = false;
        Script.lightsource = Script.character.getChildrenByName("Light")[0];
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
        followCamera();
        fusselCollides();
        if (gamestate.health > 0) {
            gamestate.points = parseFloat((Script.character.mtxLocal.translation.x * 100).toFixed(1));
        }
    }
    //functions
    function fly() {
        let cmpRigidbody = Script.character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.addVelocity(ƒ.Vector3.X(config.xpush));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            changeAnimation("fly", "horrorfly");
            cmpRigidbody.addVelocity(ƒ.Vector3.Y(config.ypush));
        }
        else {
            changeAnimation("fall", "horrorfall");
        }
    }
    function setupChar() {
        // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
        Script.character = Script.viewport.getBranch().getChildrenByName("Character")[0];
        hits = Script.viewport.getBranch().getChildrenByName("Hitables")[0];
        Script.fussel = hits.getChildrenByName("Enemy")[0];
        let cmpRigidbody = Script.character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
        gamestate.updatehealth();
        bear = Script.character.getChildrenByName("Bear")[0];
        horrorbear = Script.character.getChildrenByName("Horrorbear")[0];
    }
    function changeAnimation(_animation, _animationH) {
        let currentAnim = bear.getComponent(ƒ.ComponentAnimator).animation;
        const newAnim = ƒ.Project.getResourcesByName(_animation)[0];
        let currentAnimH = horrorbear.getComponent(ƒ.ComponentAnimator).animation;
        const newAnimH = ƒ.Project.getResourcesByName(_animationH)[0];
        if (currentAnim != newAnim) {
            bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
        }
        if (currentAnimH != newAnimH) {
            // console.log("i change");
            horrorbear.getComponent(ƒ.ComponentAnimator).animation = newAnimH;
        }
    }
    function followCamera() {
        let mutator = Script.character.mtxLocal.getMutator();
        Script.viewport.camera.mtxPivot.mutate({ "translation": { "x": mutator.translation.x } });
    }
    function fusselCollides() {
        cmpRigidbodyfussel = Script.fussel.getComponent(ƒ.ComponentRigidbody);
        let vctCollisionx = Script.character.mtxWorld.translation.x - Script.fussel.mtxWorld.translation.x;
        let vctCollisiony = Script.character.mtxWorld.translation.y - Script.fussel.mtxWorld.translation.y;
        if (vctCollisiony < 0) {
            vctCollisiony *= -1;
        }
        if (vctCollisionx < 0) {
            vctCollisionx *= -1;
        }
        // console.log(vctCollisionx)
        if (vctCollisionx <= 0.6 && vctCollisiony <= 0.7 || vctCollisionx <= 0.8 && vctCollisiony <= 0.5) { // collision next to fussel
            oppoTimer += ƒ.Loop.timeFrameGame / 1000;
            if (hitme == false) {
                oppoTimer = 0;
                console.log("hit");
                let customEvent = new CustomEvent("collide", { bubbles: true, detail: Script.fussel.getChildrenByName("Fussel") });
                Script.fussel.dispatchEvent(customEvent);
                hitme = true;
                console.log(hitme);
                gamestate.health -= 1;
                gamestate.updatehealth();
                horrorworld();
                if (gamestate.health == 0) {
                    // bear = character.getChildrenByName("Bear")[0];
                    // horrorbear = character.getChildrenByName("Horrorbear")[0];
                    let customEvent = new CustomEvent("horror", { bubbles: true });
                    Script.fussel.dispatchEvent(customEvent);
                    horrorlight();
                    bear.mtxLocal.scale(new ƒ.Vector3(0, 0, 0));
                    horrorbear.getComponent(ƒ.ComponentMaterial).activate(true);
                }
            }
        }
        if (oppoTimer > 1) {
            console.log("tier");
            hitme = false;
            oppoTimer = 0;
        }
    }
    //world
    function horrorlight() {
        console.log("changeligth");
        let cmplight = Script.lightsource.getComponent(ƒ.ComponentLight);
        let colour = ƒ.Color.CSS("gray");
        cmplight.light.color = colour;
    }
    function horrorworld() {
        if (gamestate.health == 0) {
            for (let room = 0; room < roomcount; room++) {
                let raumchange = Script.viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("picture")[0];
                let cmpMaterial = raumchange.getComponent(ƒ.ComponentMaterial);
                cmpMaterial.material = ƒ.Project.getResourcesByName("horrorroomtext")[0];
                console.log(Script.viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildren());
                let up = Script.viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("walls")[0];
                let cmpMaterialup = up.getComponent(ƒ.ComponentMaterial);
                cmpMaterialup.clrPrimary = ƒ.Color.CSS("DarkRed");
                let down = Script.viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("walls")[1];
                let cmpMaterialdown = down.getComponent(ƒ.ComponentMaterial);
                cmpMaterialdown.clrPrimary = ƒ.Color.CSS("DarkRed");
                for (let ob = 0; ob < 3; ob++) {
                    let obstacle1 = Script.viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("obstacle")[ob];
                    obstacle1.removeComponent(obstacle1.getComponent(ƒ.ComponentMaterial));
                    let cmpMaterialob = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("goore")[0]);
                    obstacle1.addComponent(cmpMaterialob);
                    if (ob == 2) {
                        let dangli = obstacle1.getChildrenByName("obstacle")[0];
                        dangli.removeComponent(dangli.getComponent(ƒ.ComponentMaterial));
                        let cmpMaterialdan = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("goore")[0]);
                        dangli.addComponent(cmpMaterialdan);
                    }
                }
            }
        }
    }
    function generateworld(_length) {
        let xPos = 24;
        roomcount = 0;
        for (let y = 0; y < _length; y++) {
            createRoom(xPos, roomcount);
            xPos += 21;
            roomcount += 1;
        }
    }
    function createRoom(_xPos, _roomNumber) {
        let upsi1 = new Script.upsi(_xPos);
        let downsi1 = new Script.downsi(_xPos);
        let left1 = new Script.left(_xPos);
        let right1 = new Script.right(_xPos);
        let picture1 = new Script.picture(_xPos, "room");
        let max = _xPos + 10;
        let min = _xPos - 10;
        let randomnumberkiste = Math.random() * (max - min) + min;
        let randomnumbertwist = Math.random() * (max - min) + min;
        let randomnumberspin = Math.random() * (max - min) + min;
        let kiste1 = new Script.kiste(randomnumberkiste);
        let twist1 = new Script.twist(randomnumbertwist);
        let spin1 = new Script.spin(randomnumberspin);
        let room = new ƒ.Node("room");
        background = Script.viewport.getBranch().getChildrenByName("Background")[0];
        background.addChild(room);
        let roomPlace = background.getChildrenByName("room")[_roomNumber];
        roomPlace.addChild(upsi1);
        roomPlace.addChild(downsi1);
        roomPlace.addChild(left1);
        roomPlace.addChild(right1);
        roomPlace.addChild(picture1);
        roomPlace.addChild(kiste1);
        roomPlace.addChild(twist1);
        roomPlace.addChild(spin1);
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
        updatehealth() {
            let lifebar = document.querySelector("#img");
            if (this.health == 2) {
                // console.log("two");
                lifebar.setAttribute('src', 'Resoources/heart2.png');
            }
            if (this.health == 1) {
                lifebar.setAttribute('src', 'Resoources/heart1.png');
                // console.log("one");
            }
            if (this.health == 0) {
                lifebar.setAttribute('src', 'Resoources/horrorhearts.png');
                document.getElementById("scorein").style.fontFamily = 'Frank';
                // console.log("zero");
            }
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
        gone = false;
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
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
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
        update = (_event) => {
            if (!Script.character) {
                return;
            }
            let vctCollisionx = Script.character.mtxWorld.translation.x - Script.fussel.mtxWorld.translation.x;
            if (vctCollisionx > 3 && this.gone == true) {
                let rigid = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CYLINDER, ƒ.COLLISION_GROUP.DEFAULT);
                rigid.effectGravity = 0;
                this.node.addComponent(rigid);
                this.gone = false;
            }
        };
        fusselreset = (_event) => {
            console.log("reset");
            let max = 6;
            let min = 0;
            let randomnumber = Math.random() * (max - min) + min;
            let rigid = this.node.getComponent(ƒ.ComponentRigidbody);
            if (!rigid) {
                return;
            }
            this.node.removeComponent(rigid);
            this.fusselfollow(randomnumber - 3);
            this.gone = true;
        };
        fusselfollow = (_randomnumber) => {
            console.log("removed");
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
            cmpMaterial.clrPrimary = ƒ.Color.CSS("gray");
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
    class obstacle extends ƒ.Node {
        static mesh = new ƒ.MeshCube("meshpic");
        static mat;
        constructor(_positionX) {
            super("obstacle");
            this.addComponent(new ƒ.ComponentMesh(obstacle.mesh));
            this.addComponent(new ƒ.ComponentTransform());
            let max = 4;
            let min = 0;
            let randomnumber = Math.random() * (max - min) + min;
            let positionVector = new ƒ.Vector3(_positionX, randomnumber - 3, 0);
            this.mtxLocal.translation = positionVector;
            let rigid = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.DEFAULT);
            this.addComponent(rigid);
        }
    }
    Script.obstacle = obstacle;
    class kiste extends obstacle {
        constructor(_positionX) {
            super(_positionX);
            let cmpMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("kiste")[0]);
            this.addComponent(cmpMaterial);
        }
    }
    Script.kiste = kiste;
    class twist extends obstacle {
        constructor(_positionX) {
            super(_positionX);
            this.getComponent(ƒ.ComponentRigidbody).typeBody = ƒ.BODY_TYPE.KINEMATIC;
            let cmpMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("wood")[0]);
            let cmpAnimate = new ƒ.ComponentAnimator(ƒ.Project.getResourcesByName("turn")[0]);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpAnimate);
            let max = 2;
            let min = 1;
            let randomnumber = Math.random() * (max - min) + min;
            this.mtxLocal.scale(new ƒ.Vector3(randomnumber, 0.1, 1));
        }
    }
    Script.twist = twist;
    class spin extends obstacle {
        constructor(_positionX) {
            super(_positionX);
            let cmpMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("wood")[0]);
            let dangle1 = new dangle(_positionX);
            this.addChild(dangle1);
            let cmpJoint = new ƒ.JointSpherical(this.getComponent(ƒ.ComponentRigidbody), dangle1.getComponent(ƒ.ComponentRigidbody));
            this.addComponent(cmpMaterial);
            this.addComponent(cmpJoint);
            let positionVector = new ƒ.Vector3(_positionX, 1, 0);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(0.3, 0.3, 1));
        }
    }
    Script.spin = spin;
    class dangle extends obstacle {
        constructor(_positionX) {
            super(_positionX);
            this.removeComponent(this.getComponent(ƒ.ComponentRigidbody));
            let cmpMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("wood")[0]);
            this.addComponent(cmpMaterial);
            let positionVector = new ƒ.Vector3(0, -2.8, 0);
            this.mtxLocal.translation = positionVector;
            let max = 4;
            let min = 1;
            let randomnumber = Math.random() * (max - min) + min;
            this.mtxLocal.scale(new ƒ.Vector3(1, randomnumber, 1));
            let rigid = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.DEFAULT);
            this.addComponent(rigid);
        }
    }
    Script.dangle = dangle;
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
                // console.log("attack");
                _machine.transit(MODE.ATTACK);
                let customEvent = new CustomEvent("attack", { bubbles: true });
                Script.fussel.dispatchEvent(customEvent);
            }
            else if (posx > posxf) {
                // console.log("follow");
                if (!_machine.node.getComponent(ƒ.ComponentRigidbody)) {
                    return;
                }
                let cmpRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
                cmpRigidbody.addVelocity(ƒ.Vector3.X(0.01));
            }
        }
        static async actAttack(_machine) {
            if (!_machine.node.getComponent(ƒ.ComponentRigidbody)) {
                return;
            }
            let cmpRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
            cmpRigidbody.addVelocity(ƒ.Vector3.X(0.05));
            let distancebetween = _machine.node.mtxWorld.translation.x - Script.character.mtxWorld.translation.x;
            if (distancebetween >= 6) {
                _machine.transit(MODE.IDLE);
                let customEvent = new CustomEvent("far", { bubbles: true });
                console.log("far");
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