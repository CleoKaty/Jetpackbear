namespace Script {
    import ƒ = FudgeCore;
    
    export class walls extends ƒ.Node{
  
        static wallsmesh: ƒ.MeshCube = new ƒ.MeshCube("walls");
        static wallsmaterial: ƒ.Material = new ƒ.Material("walls", ƒ.ShaderFlat, new ƒ.CoatRemissive());
    
        constructor() {
          super("walls");
          this.addComponent(new ƒ.ComponentMesh(walls.wallsmesh));
          
          let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(walls.wallsmaterial);
          cmpMaterial.clrPrimary = new ƒ.Color(165, 165, 165, 1);
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
          this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
          let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, 3, 0);
          this.mtxLocal.translation = positionVector;
          
        }
    }

    export class downsi extends walls{
  
        constructor(_positionX: number) {
            super();
            this.mtxLocal.scale(new ƒ.Vector3(21, 0.3, 1));
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -4, 0);
            this.mtxLocal.translation = positionVector;
            
      
          }
    }

    export class left extends walls{
  
        constructor(_positionX: number) {
            super();
            let cmpmat: ƒ.ComponentMaterial = this.getComponent(ƒ.ComponentMaterial);
            this.removeComponent(cmpmat);
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -0.5, 1);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
      
          }
    }
    export class right extends walls{
  
        constructor(_positionX: number) {
            super();
            let cmpmat: ƒ.ComponentMaterial = this.getComponent(ƒ.ComponentMaterial);
            this.removeComponent(cmpmat);
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -0.5, -1);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(21, 6, 1));
      
          }
    }

    export class picture extends ƒ.Node{
        static picturemesh: ƒ.MeshQuad = new ƒ.MeshQuad("meshpic");
        static picturemat: ƒ.Material;
        constructor(_positionX: number, _meterial: string) {
            super("picture");
          
            this.addComponent(new ƒ.ComponentMesh(picture.picturemesh));
            
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName(_meterial)[0] as ƒ.Material);
            this.addComponent(cmpMaterial);
            
               
            this.addComponent(new ƒ.ComponentTransform());
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, -0.36, -0.5);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(21, 7, 1));
          }
    }
  }