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
    //needed variables
    let viewport;
    let character;
    let bear;
    let life;
    //let gravity: number;
    let graph;
    let cmpCamera;
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
        //set up viewport
        viewport = _event.detail;
        graph = viewport.getBranch();
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        //start loop
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        //build world
        //generateworld(config.worldlength);
        setupChar();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        ƒ.Physics.simulate();
        viewport.draw();
        ƒ.AudioManager.default.update();
        fly();
        hurt();
        death();
        followCamera();
    }
    //functions
    function fly() {
        let cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
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
        character = viewport.getBranch().getChildrenByName("Character")[0];
        let cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
        //cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
    }
    function falldeath() {
        let death = false;
        if (character.mtxWorld.translation.y <= -3) {
            death = true;
        }
        return death;
    }
    function changeAnimation(_animation) {
        bear = character.getChildrenByName("Bear")[0];
        let currentAnim = bear.getComponent(ƒ.ComponentAnimator).animation;
        const newAnim = ƒ.Project.getResourcesByName(_animation)[0];
        if (currentAnim != newAnim) {
            bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
        }
    }
    function followCamera() {
        let mutator = character.mtxLocal.getMutator();
        viewport.camera.mtxPivot.mutate({ "translation": { "x": mutator.translation.x } });
    }
    //world
    function generateworld(_length) {
        let xPos = 24;
        let roomcount = 0;
        for (let y = 0; y < _length; y++) {
            createRoom(xPos, roomcount);
            xPos += 21;
            xPos += 1;
        }
    }
    function createRoom(_xPos, _roomNumber) {
        let upsi1 = new Script.upsi(_xPos);
        let downsi1 = new Script.downsi(_xPos);
        let left1 = new Script.left(_xPos);
        let right1 = new Script.right(_xPos);
        let room;
        let background = viewport.getBranch().getChildrenByName("Background")[0];
        background.addChild(room);
        let roomPlace = background.getChildrenByName("room")[_roomNumber];
        roomPlace.addChild(upsi1);
        roomPlace.addChild(downsi1);
        roomPlace.addChild(left1);
        roomPlace.addChild(right1);
    }
})(Script || (Script = {}));
// namespace Script{
//     import ƒ = FudgeCore;
//     import ƒUi = FudgeUserInterface;
//     class Gamestate extends ƒ.Mutable{
//         public points: number;
//         public health: number;
//         public name: string;
//         constructor(){
//             super();
//             this.points = 0;
//             this.health = 3;
//             this.name = "Jetpakbear";
//             let vui: HTMLDivElement = document.querySelector("div#vui");
//             new ƒUi.Controller(this, vui);
//         }
//         protected reduceMutator(_mutator: ƒ.Mutator):void{};
//     }
// }
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class walls extends ƒ.Node {
        static wallsmesh = new ƒ.MeshCube("walls");
        static wallsmaterial = new ƒ.Material("walls", ƒ.ShaderFlatTextured);
        constructor() {
            super("walls");
            this.addComponent(new ƒ.ComponentMesh(walls.wallsmesh));
            let cmpMaterial = new ƒ.ComponentMaterial(walls.wallsmaterial);
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
            let positionVector = new ƒ.Vector3(_positionX, 3, 0);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
        }
    }
    Script.upsi = upsi;
    class downsi extends walls {
        constructor(_positionX) {
            super();
            let positionVector = new ƒ.Vector3(_positionX, -4, 0);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
        }
    }
    Script.downsi = downsi;
    class left extends walls {
        constructor(_positionX) {
            super();
            let positionVector = new ƒ.Vector3(_positionX, -0.5, 1);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
        }
    }
    Script.left = left;
    class right extends walls {
        constructor(_positionX) {
            super();
            let positionVector = new ƒ.Vector3(_positionX, -0.5, -1);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
        }
    }
    Script.right = right;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map