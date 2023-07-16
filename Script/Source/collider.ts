namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class reset extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(reset);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";
    public attack: boolean = false;


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.node.addEventListener("collide", this.fusselreset);
          this.node.addEventListener("attack", this.hyia);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }
    private update = (_event: Event): void => {
      if (!character){
        return;
      }
      if (this.attack == false){
        console.log("attackfalse")
      this.node.mtxWorld.translation.x = character.mtxWorld.translation.x - 4;
      }
    }

    public fusselreset(_event: Event): void{
      this.attack = false;
      console.log("reset");
      let max: number = 6;
      let min: number = 0;
      let randomnumber: number = Math.random()* (max - min) + min;
      this.fusselfollow(randomnumber-3);
      
    }

    public hyia(_event: Event):void{
      this.attack = true;
      if (this.node.mtxWorld.translation.x >= character.mtxWorld.translation.x+5){
        this.fusselreset;
      }
    }

    public fusselfollow(_randomnumber: number): void{
      if(this.attack == false){
      let positionVec: ƒ.Vector3 = new ƒ.Vector3(character.mtxWorld.translation.x - 4, _randomnumber, character.mtxWorld.translation.z);
      this.node.mtxWorld.translation = positionVec;
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}