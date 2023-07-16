namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");


  //needed variables
  export let viewport: ƒ.Viewport;
  export let character: ƒ.Node;
  export let gameState: Gamestate;
  let bear: ƒ.Node;
  let fussel:ƒ.Node;
  let hits: ƒ.Node;
  let life: number;
  let background: ƒ.Node;
  //let gravity: number;
  let graph: ƒ.Graph;
  let cmpCamera: ƒ.ComponentCamera;
  
  let config: {[key: string]: number}; 

  enum keywords {
   l = "l"
  }

  document.addEventListener("interactiveViewportStarted", start);


  async function start(_event: Event): Promise<void> {
    //fetch config
    let response = await fetch("config.json");
    config = await response.json();
    console.log(keywords);
    life = 3;

   //vui
   let gamestate: Gamestate = new Gamestate(config);
   console.log(gamestate);

    //set up viewport
    viewport = (<CustomEvent>_event).detail;
    graph = <ƒ.Graph>viewport.getBranch();
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS

    

 


    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    //build world
    generateworld(config.worldlength);
    setupChar();

    //start loop
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
    
    fly();
    hurt();
    death();
    followCamera();
    let cmpRigidbodyfussel: ƒ.ComponentRigidbody = fussel.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbodyfussel.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, fusselCollides);
  }

  //functions

  function fly():void{
    let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.addVelocity(ƒ.Vector3.X(config.xpush));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      changeAnimation("fly");
      cmpRigidbody.addVelocity(ƒ.Vector3.Y(config.ypush));
    }
    else{
      changeAnimation("fall");
    }
}
function death(){
  if (life == 0){
    console.log("death");

  }
}
function hurt():void{
  if(falldeath() == true){
    life -=1;
  }
 
  
  
}
function setupChar(): void {
  // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
  character = viewport.getBranch().getChildrenByName("Character")[0];
  hits = viewport.getBranch().getChildrenByName("Hitables")[0];
  fussel = hits.getChildrenByName("Enemy")[0];
  let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
  cmpRigidbody.effectRotation = ƒ.Vector3.Y();
  //cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
}

function falldeath():boolean{
  let death: boolean = false;
  if (character.mtxWorld.translation.y <= -3.5){
    death = true;
  }
  return death;
}
function changeAnimation(_animation: string): void {
  bear = character.getChildrenByName("Bear")[0];
  let currentAnim: ƒ.AnimationSprite = bear.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
  const newAnim: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animation)[0] as ƒ.AnimationSprite;
  if (currentAnim != newAnim) {
    bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
  }
}
function followCamera() {
  let mutator: ƒ.Mutator = character.mtxLocal.getMutator();
  viewport.camera.mtxPivot.mutate(
    { "translation": { "x": mutator.translation.x } }
  );
}

function fusselCollides(_event: ƒ.EventPhysics): void {
  console.log("here");
  let vctCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, character.mtxWorld.translation);
  let customEvent: CustomEvent = new CustomEvent("collide", { bubbles: true, detail: fussel.getChildrenByName("Fussel") })
  if (Math.abs(vctCollision.x) <= 0 && Math.abs(vctCollision.z) < 0.1 && vctCollision.y < 0.1){ // collision next to fussel
    console.log("hit");
   fussel.dispatchEvent(customEvent);
  }
}

//world
function generateworld(_length: number):void{
  let xPos:number = 24;
  let roomcount: number = 0;
  for (let y: number = 0; y < _length; y++) {
        createRoom(xPos, roomcount);
        xPos += 20;
        xPos += 1;
      }
}

    function createRoom(_xPos: number, _roomNumber: number): void {
      let upsi1: upsi = new upsi(_xPos);
      let downsi1: downsi = new downsi(_xPos);
      let left1: left = new left(_xPos);
      let right1: right = new right(_xPos);
      let picture1: picture = new picture(_xPos, "room");
      let room: ƒ.Node = new ƒ.Node("room");
      background = viewport.getBranch().getChildrenByName("Background")[0];
      background.addChild(room);
      let roomPlace: ƒ.Node = background.getChildrenByName("room")[_roomNumber];
      roomPlace.addChild(upsi1);
      roomPlace.addChild(downsi1);
      roomPlace.addChild(left1);
      roomPlace.addChild(right1);
      roomPlace.addChild(picture1);
    }
}





