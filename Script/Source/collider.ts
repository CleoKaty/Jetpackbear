namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class reset extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(reset);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";
    public gone: boolean = false;


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
          this.node.addEventListener("far", this.fusselreset);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    private update = (_event: Event): void => {
      if(!character){
        return;
      }
      let vctCollisionx: number = character.mtxWorld.translation.x - fussel.mtxWorld.translation.x ;
      if (vctCollisionx > 3 && this.gone == true){
        let rigid: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1,ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CYLINDER, ƒ.COLLISION_GROUP.DEFAULT);
        rigid.effectGravity = 0;
        this.node.addComponent(rigid);
        this.gone = false;
        }
    }
    

    public fusselreset = (_event: Event): void =>{
      console.log("reset");
      let max: number = 6;
      let min: number = 0;
      let randomnumber: number = Math.random()* (max - min) + min;
      let rigid: ƒ.ComponentRigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
      if(!rigid){
        return;
      }
      this.node.removeComponent(rigid);
      this.fusselfollow(randomnumber-3);
      this.gone = true;
      
    }

    public fusselfollow = (_randomnumber: number): void =>{
      console.log("removed");
      let positionVec: ƒ.Vector3 = new ƒ.Vector3(character.mtxWorld.translation.x - 1, _randomnumber, 0);
      this.node.mtxWorld.translation = positionVec;
      
      
      

    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}