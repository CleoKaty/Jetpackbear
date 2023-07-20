namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");


  //needed variables
  export let viewport: ƒ.Viewport;
  export let character: ƒ.Node;
  export let gameState: Gamestate;
  export let lightsource: ƒ.Node; 
  let bear: ƒ.Node;
  let horrorbear: ƒ.Node;
  export let fussel:ƒ.Node;
  let hits: ƒ.Node;
  let background: ƒ.Node;
  //let gravity: number;
  let graph: ƒ.Graph;
  let cmpCamera: ƒ.ComponentCamera;
  let cmpRigidbodyfussel: ƒ.ComponentRigidbody;
  let oppoTimer: number = 0;
  let hitme: boolean;
  let gamestate: Gamestate;
  let roomcount: number;
  
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
    
  

   //vui
   gamestate = new Gamestate(config);
   

    //set up viewport
    viewport = (<CustomEvent>_event).detail;
    graph = <ƒ.Graph>viewport.getBranch();
    // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    

 


    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    //build world
    generateworld(config.worldlength);
    setupChar();
    
    hitme = false;
    lightsource = character.getChildrenByName("Light")[0];
    addAudioSound("happy.mp3");

  

    //start loop
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    viewport.draw();
    // ƒ.AudioManager.default.update();
    

    
    fly();
    addAudio();
    followCamera();
    fusselCollides();
    if(gamestate.health > 0){
      gamestate.points = parseFloat((character.mtxLocal.translation.x*100).toFixed(1));
    }
    
  }

  //functions

  function fly():void{
    let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.addVelocity(ƒ.Vector3.X(config.xpush));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      changeAnimation("fly", "horrorfly");
      cmpRigidbody.addVelocity(ƒ.Vector3.Y(config.ypush));
      let audio = character.getComponent(ƒ.ComponentAudio);
      audio.play(true);

    }
    else{
      changeAnimation("fall", "horrorfall");
      let audio = character.getComponent(ƒ.ComponentAudio);
      audio.play(false);

    }
}
function setupChar(): void {
  // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
  character = viewport.getBranch().getChildrenByName("Character")[0];
  hits = viewport.getBranch().getChildrenByName("Hitables")[0];
  fussel = hits.getChildrenByName("Enemy")[0];
  let cmpRigidbody: ƒ.ComponentRigidbody = character.getComponent(ƒ.ComponentRigidbody);
  cmpRigidbody.effectRotation = ƒ.Vector3.Y();
  gamestate.updatehealth();
  bear = character.getChildrenByName("Bear")[0];
  horrorbear = character.getChildrenByName("Horrorbear")[0];

}
function changeAnimation(_animation: string, _animationH: string): void {
  
  let currentAnim: ƒ.AnimationSprite = bear.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
  const newAnim: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animation)[0] as ƒ.AnimationSprite;
  let currentAnimH: ƒ.AnimationSprite = horrorbear.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
  const newAnimH: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animationH)[0] as ƒ.AnimationSprite;
  if (currentAnim != newAnim) {
    bear.getComponent(ƒ.ComponentAnimator).animation = newAnim;
  }
  if (currentAnimH != newAnimH) {
    // console.log("i change");
    horrorbear.getComponent(ƒ.ComponentAnimator).animation = newAnimH;
  }
}
function followCamera() {
  let mutator: ƒ.Mutator = character.mtxLocal.getMutator();
  viewport.camera.mtxPivot.mutate(
    { "translation": { "x": mutator.translation.x } }
  );
  
}

//audiosetup
function addAudio() {
  let audioListener: ƒ.ComponentAudioListener = viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
  ƒ.AudioManager.default.listenWith(audioListener);
  ƒ.AudioManager.default.listenTo(viewport.getBranch());

}
function addAudioSound(_audio: string) {
  const newAudio: ƒ.Audio = ƒ.Project.getResourcesByName(_audio)[0] as ƒ.Audio;
  // console.log(newAudio);
  let audio:ƒ.ComponentAudio = character.getComponent(ƒ.ComponentAudio);
  audio.setAudio(newAudio);
  audio.play(true);
}

//collisiondetection
function fusselCollides(): void {
  cmpRigidbodyfussel= fussel.getComponent(ƒ.ComponentRigidbody);
  let vctCollisionx: number = character.mtxWorld.translation.x - fussel.mtxWorld.translation.x ;
  let vctCollisiony: number = character.mtxWorld.translation.y - fussel.mtxWorld.translation.y ;
  if (vctCollisiony < 0){
    vctCollisiony *= -1;
  }
  if (vctCollisionx < 0){
    vctCollisionx *= -1;
  }
  // console.log(vctCollisionx)
  if (vctCollisionx <= 0.6 && vctCollisiony <= 0.7 || vctCollisionx <= 0.8 && vctCollisiony <= 0.7){ // collision next to fussel
    oppoTimer += ƒ.Loop.timeFrameGame/1000;
    if (hitme == false){
      oppoTimer= 0;
      // console.log("hit");
      let customEvent: CustomEvent = new CustomEvent("collide", { bubbles: true, detail: fussel.getChildrenByName("Fussel") })
      fussel.dispatchEvent(customEvent);
      hitme = true;
      // console.log(hitme);
      gamestate.health -= 1;
      gamestate.updatehealth();
      horrorworld();
      
      if(gamestate.health == 0){
        // bear = character.getChildrenByName("Bear")[0];
        // horrorbear = character.getChildrenByName("Horrorbear")[0];
        let customEvent: CustomEvent = new CustomEvent("horror", { bubbles: true })
        fussel.dispatchEvent(customEvent);
        horrorlight();
        bear.mtxLocal.scale(new ƒ.Vector3(0,0,0));
        horrorbear.getComponent(ƒ.ComponentMaterial).activate(true);
        let uno: ƒ.Node = fussel.getChildrenByName("fussel")[0];
        uno.getComponent(ƒ.ComponentMaterial).activate(false);
        let dos:ƒ.Node = fussel.getChildrenByName("fusselhorror")[0];
        dos.getComponent(ƒ.ComponentMaterial).activate(true);
        addAudioSound("horrormusic.mp3");
        const newAudio: ƒ.Audio = ƒ.Project.getResourcesByName("ah.mp3")[0] as ƒ.Audio;
        let audio:ƒ.ComponentAudio = fussel.getComponent(ƒ.ComponentAudio);
        audio.setAudio(newAudio);
        audio.play(true);
        audio.volume = 0.02;
        
      }
    }
  }
  if (oppoTimer > 1){
    console.log("tier");
    hitme = false;
    oppoTimer= 0;

  
  }
  
}



//world
function horrorlight():void{
  console.log("changeligth");
  let cmplight:ƒ.ComponentLight = lightsource.getComponent(ƒ.ComponentLight);
  let colour:ƒ.Color= ƒ.Color.CSS("gray");
   cmplight.light.color = colour;
}

function horrorworld(): void{
  if(gamestate.health == 0){
    for (let room = 0; room < roomcount; room++) {
      let raumchange:ƒ.Node = viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("picture")[0];
      let cmpMaterial: ƒ.ComponentMaterial = raumchange.getComponent(ƒ.ComponentMaterial);
      cmpMaterial.material = ƒ.Project.getResourcesByName("horrorroomtext")[0] as ƒ.Material;
      console.log(viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildren());

      let up: upsi = viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("walls")[0];
      let cmpMaterialup: ƒ.ComponentMaterial = up.getComponent(ƒ.ComponentMaterial);
      cmpMaterialup.clrPrimary = ƒ.Color.CSS("DarkRed");

      let down: downsi = viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("walls")[1];
      let cmpMaterialdown: ƒ.ComponentMaterial = down.getComponent(ƒ.ComponentMaterial);
      cmpMaterialdown.clrPrimary = ƒ.Color.CSS("DarkRed");

      for(let ob = 0; ob < 3; ob++){
        let obstacle1: obstacle = viewport.getBranch().getChildrenByName("Background")[0].getChildrenByName("room")[room].getChildrenByName("obstacle")[ob];
        obstacle1.removeComponent(obstacle1.getComponent(ƒ.ComponentMaterial));
        let cmpMaterialob: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("goore")[0] as ƒ.Material);
        obstacle1.addComponent(cmpMaterialob);

        if(ob == 2){
          let dangli: dangle = obstacle1.getChildrenByName("obstacle")[0];
          dangli.removeComponent(dangli.getComponent(ƒ.ComponentMaterial));
          let cmpMaterialdan: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("goore")[0] as ƒ.Material);
          dangli.addComponent(cmpMaterialdan);
        }
      }
      
    }
  }
}

function generateworld(_length: number):void{
  let xPos:number = 24;
  roomcount = 0;
  for (let y: number = 0; y < _length; y++) {
        createRoom(xPos, roomcount);
        xPos += 21;
        roomcount += 1;
      }
}


    function createRoom(_xPos: number, _roomNumber: number): void {
      let upsi1: upsi = new upsi(_xPos);
      let downsi1: downsi = new downsi(_xPos);
      let left1: left = new left(_xPos);
      let right1: right = new right(_xPos);
      let picture1: picture = new picture(_xPos, "room");

      let max: number = _xPos + 10;
      let min: number = _xPos - 10;
      let randomnumberkiste: number = Math.random()* (max - min) + min;
      let randomnumbertwist: number = Math.random()* (max - min) + min;
      let randomnumberspin: number = Math.random()* (max - min) + min;

      let kiste1: kiste = new kiste(randomnumberkiste);
      let twist1: twist = new twist(randomnumbertwist);
      let spin1: spin = new spin(randomnumberspin);

      let room: ƒ.Node = new ƒ.Node("room");
      background = viewport.getBranch().getChildrenByName("Background")[0];
      background.addChild(room);
      let roomPlace: ƒ.Node = background.getChildrenByName("room")[_roomNumber];
      roomPlace.addChild(upsi1);
      roomPlace.addChild(downsi1);
      roomPlace.addChild(left1);
      roomPlace.addChild(right1);
      roomPlace.addChild(picture1);
      roomPlace.addChild(kiste1);
      roomPlace.addChild(twist1);
      roomPlace.addChild(spin1);
    
    }

}





