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

  async function start(_event: Event): Promise<void> {
    //fetch config
    let response = await fetch("config.json");
    config = await response.json();
    console.log(config);
    console.log(keywords);

    //start loop
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    //set up viewport
    //viewport = (<CustomEvent>_event).detail;
    // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    // viewport.canvas.addEventListener("contextmenu", _event => _event.preventDefault());
    

     //declare variables
     graph = <ƒ.Graph>viewport.getBranch();
     character = graph.getChildrenByName("Character")[0];
     cmpCamera = character.getComponent(ƒ.ComponentCamera);
     viewport.camera = cmpCamera;
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  
}