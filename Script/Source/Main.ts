namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");


  //needed variables
  let viewport: ƒ.Viewport;
  let character: ƒ.Node;
  //let gravity: number;
  let graph: ƒ.Graph;
  let cmpCamera: ƒ.ComponentCamera;
  
  let config: {[key: string]: number}; 

  enum keywords {
   l = "l"
  }

  document.addEventListener("interactiveViewportStarted", start);

  async function configGrap(_event: Event): Promise<void> {
    let response = await fetch("config.json");
    config = await response.json();
    console.log(config);
    console.log(keywords);
  };

  async function start(_event: Event): Promise<void> {
    //fetch config
    await configGrap;
   

    //start loop
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    //set up viewport
    viewport = (<CustomEvent>_event).detail;
    graph = <ƒ.Graph>viewport.getBranch();
    


    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
    setupChar();
    fly();
  }

  function fly():void{
    let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      cmpRigidbody.addVelocity(ƒ.Vector3.Y(5));
      console.log("fly");
  }

  
}
function setupChar(): void {
  // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
  character = viewport.getBranch().getChildrenByName("Character")[0];
  viewport.camera = character.getChild(0).getComponent(ƒ.ComponentCamera);
  let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
  cmpRigidbody.effectRotation = ƒ.Vector3.Y();
  //cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
}

}
