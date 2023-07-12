namespace Script {
    import ƒ = FudgeCore;
    
    export class walls extends ƒ.Node{
  
        static wallsmesh: ƒ.MeshCube = new ƒ.MeshCube("walls");
        static wallsmaterial: ƒ.Material = new ƒ.Material("walls", ƒ.ShaderFlatTextured);
    
        constructor() {
          super("walls");
          this.addComponent(new ƒ.ComponentMesh(walls.wallsmesh));
          
          let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(walls.wallsmaterial);
          this.addComponent(cmpMaterial);
             
          this.addComponent(new ƒ.ComponentTransform());
    
          let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
          this.addComponent(cmpRigidbody);
          // cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, () => console.log("Collision"));
        }
    }
    export class upsi extends walls{
     
        constructor(_positionX: number) {
          super();
        
          let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, 3, 0);
          this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
          this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
        }
    }

    export class downsi extends walls{
  
        constructor(_positionX: number) {
            super();
          
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -4, 0);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
      
          }
    }

    export class left extends walls{
  
        constructor(_positionX: number) {
            super();
          
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -0.5, 1);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
      
          }
    }
    export class right extends walls{
  
        constructor(_positionX: number) {
            super();
          
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -0.5, -1);
            this.mtxLocal.translation.set(positionVector.x, positionVector.y, positionVector.z);
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
      
          }
    }
  }