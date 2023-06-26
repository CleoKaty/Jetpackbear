namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");


  //needed variables
  let viewport: ƒ.Viewport;
  let character: ƒ.Node;
  let bear: ƒ.Node;
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
   
    //set up viewport
    viewport = (<CustomEvent>_event).detail;
    graph = <ƒ.Graph>viewport.getBranch();
 


    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    //start loop
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
   
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
    setupChar();
    fly();
    death();
  }

  function fly():void{
    let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      changeAnimation("fly");
      cmpRigidbody.addVelocity(ƒ.Vector3.Y(config.ypush));
    }
    else{
      changeAnimation("fall");
    }

  
}
function setupChar(): void {
  // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
  character = viewport.getBranch().getChildrenByName("Character")[0];
  let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
  cmpRigidbody.effectRotation = ƒ.Vector3.Y();
  //cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
}

function death():void{
  if (character.mtxWorld.translation.y <= -3){
    console.log("death");
  }
}
function changeAnimation(_animation: string): void {
  bear = character.getChildrenByName("Bear")[0];
  let currentAnim: ƒ.AnimationSprite = bear.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
  const newAnim: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animation)[0] as ƒ.AnimationSprite;
  if (currentAnim != newAnim) {
    bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
  }
}

}
