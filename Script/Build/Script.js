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
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        ƒ.Physics.simulate();
        viewport.draw();
        ƒ.AudioManager.default.update();
        setupChar();
        fly();
        death();
    }
    function fly() {
        let cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            changeAnimation("fly");
            cmpRigidbody.addVelocity(ƒ.Vector3.Y(config.ypush));
        }
        else {
            changeAnimation("fall");
        }
    }
    function setupChar() {
        // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
        character = viewport.getBranch().getChildrenByName("Character")[0];
        let cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
        //cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
    }
    function death() {
        if (character.mtxWorld.translation.y <= -3) {
            console.log("death");
        }
    }
    function changeAnimation(_animation) {
        bear = character.getChildrenByName("Bear")[0];
        let currentAnim = bear.getComponent(ƒ.ComponentAnimator).animation;
        const newAnim = ƒ.Project.getResourcesByName(_animation)[0];
        if (currentAnim != newAnim) {
            bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
        }
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
//# sourceMappingURL=Script.js.map