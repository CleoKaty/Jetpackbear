namespace Script {
    enum MODE {
      IDLE, ATTACK
    }
  
    import ƒAid = FudgeAid;
    type Fussel = ƒAid.StateMachine<MODE>;
    ƒ.Project.registerScriptNamespace(Script);
  
    /**
     * Instruction set to be used by StateMachine and ComponentStateMachine for this test.
     * In production code, the instructions are most likely defined within the state machines.
     */
    
        export class Fusselactions extends ƒAid.ComponentStateMachine<MODE> {
            public static readonly iSubclass: number = ƒ.Component.registerSubclass(Fusselactions);
            private static instructions: ƒAid.StateMachineInstructions<MODE> = Fusselactions.get();
        
            constructor() {
              super();
              this.instructions = Fusselactions.instructions; // setup instructions with the static set
        
              // Don't start when running in editor
              if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        
              // Listen to this component being added to or removed from a node
              this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
              this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
              this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
            }
        
            public static get(): ƒAid.StateMachineInstructions<MODE> {
              let setup: ƒAid.StateMachineInstructions<MODE> = new ƒAid.StateMachineInstructions();
              setup.transitDefault = Fusselactions.transitDefault;
              setup.actDefault = Fusselactions.actDefault;
              setup.setAction(MODE.IDLE, <ƒ.General>this.actIdle);
              setup.setAction(MODE.ATTACK, <ƒ.General>this.actAttack);
              return setup;
            }
        
            private static transitDefault(_machine: Fusselactions): void {
              console.log("Transit to", _machine.stateNext);
            }
        
            private static async actDefault(_machine: Fusselactions): Promise<void> {
              console.log(MODE[_machine.stateCurrent]);
            }
        
            private static async actIdle(_machine: Fusselactions): Promise<void> {
                character = viewport.getBranch().getChildrenByName("Character")[0];
              _machine.node.mtxLocal.rotateZ(1);
              let posy:number = character.mtxWorld.translation.y;
              let posyf:number = _machine.node.mtxWorld.translation.y;
              let posx:number = character.mtxWorld.translation.x;
              let posxf:number = _machine.node.mtxWorld.translation.x;
              let distancey: number = posy - posyf;
              if(distancey < 0){
                distancey *= -1;
              }
                if(distancey < 0.01 && posx > posxf){
                    // console.log("attack");
                    _machine.transit(MODE.ATTACK);
                    _machine.changeAnimation("attack","horrorattack");
                    let customEvent: CustomEvent = new CustomEvent("attack", { bubbles: true });
                    fussel.dispatchEvent(customEvent);
                }else if(posx > posxf){
                    // console.log("follow");
                    if(!_machine.node.getComponent(ƒ.ComponentRigidbody)){
                        return;
                    }
                    let cmpRigidbody: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
                    cmpRigidbody.addVelocity(ƒ.Vector3.X(0.01));
                    _machine.changeAnimation("wait","horrorfollow");
                }
            }
        
            private static async actAttack(_machine: Fusselactions): Promise<void> {
                if(!_machine.node.getComponent(ƒ.ComponentRigidbody)){
                    return;
                }
                let cmpRigidbody: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
                cmpRigidbody.addVelocity(ƒ.Vector3.X(0.05));
                let distancebetween: number = _machine.node.mtxWorld.translation.x -character.mtxWorld.translation.x;
                if(distancebetween >= 6){
                    _machine.transit(MODE.IDLE);
                    let customEvent: CustomEvent = new CustomEvent("far", { bubbles: true });
                    console.log("far");
                    fussel.dispatchEvent(customEvent);
                }
            }
            // Activate the functions of this component as response to events
            private hndEvent = (_event: Event): void => {
              switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                  ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                  this.transit(MODE.IDLE);
                  break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                  this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                  this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                  ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                  break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                  this.transit(MODE.IDLE);
                  break;
              }
            }
            private changeAnimation(_animation: string, _animationH: string): void {
                let fusselan: ƒ.Node = this.node.getChildrenByName("fussel")[0];
                let fusselanhorror: ƒ.Node = this.node.getChildrenByName("fusselhorror")[0];
                let currentAnim: ƒ.AnimationSprite = fusselan.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
                const newAnim: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animation)[0] as ƒ.AnimationSprite;
                let currentAnimH: ƒ.AnimationSprite = fusselanhorror.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
                const newAnimH: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animationH)[0] as ƒ.AnimationSprite;
                if (currentAnim != newAnim) {
                  fusselan.getComponent(ƒ.ComponentAnimator).animation = newAnim;
                }
                if (currentAnimH != newAnimH) {
                  // console.log("i change");
                  fusselanhorror.getComponent(ƒ.ComponentAnimator).animation = newAnimH;
                }
              }
        
            private update = (_event: Event): void => {
              this.act();
            }
          }
        }