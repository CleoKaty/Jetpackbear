namespace Script {
    import ƒ = FudgeCore;
    
    export class walls extends ƒ.Node{
  
        static wallsmesh: ƒ.MeshCube = new ƒ.MeshCube("walls");
        static wallsmaterial: ƒ.Material = new ƒ.Material("walls", ƒ.ShaderFlat, new ƒ.CoatRemissive());
    
        constructor() {
          super("walls");
          this.addComponent(new ƒ.ComponentMesh(walls.wallsmesh));
          
          let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(walls.wallsmaterial);
          cmpMaterial.clrPrimary = ƒ.Color.CSS("gray");
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

    export class obstacle extends ƒ.Node{
        static mesh: ƒ.MeshCube = new ƒ.MeshCube("meshpic");
        static mat: ƒ.Material;
        constructor(_positionX: number) {
            super("obstacle");
          
            this.addComponent(new ƒ.ComponentMesh(obstacle.mesh));       
            this.addComponent(new ƒ.ComponentTransform());
            let max: number = 4;
            let min: number = 0;
            let randomnumber: number = Math.random()* (max - min) + min;

            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, randomnumber-3, 0);
            this.mtxLocal.translation = positionVector;
            let rigid: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1,ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.DEFAULT);
            this.addComponent(rigid);
          }
    }

    export class kiste extends obstacle{
        constructor(_positionX: number) {
            super(_positionX);
          
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("kiste")[0] as ƒ.Material);
            this.addComponent(cmpMaterial);
            
          }
    }
    export class twist extends obstacle{
        constructor(_positionX: number) {
            super(_positionX);
            this.getComponent(ƒ.ComponentRigidbody).typeBody = ƒ.BODY_TYPE.KINEMATIC;
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("wood")[0] as ƒ.Material);
            let cmpAnimate: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(ƒ.Project.getResourcesByName("turn")[0] as ƒ.Animation);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpAnimate);
            let max: number = 2;
            let min: number = 1;
            let randomnumber: number = Math.random()* (max - min) + min;
            this.mtxLocal.scale(new ƒ.Vector3(randomnumber, 0.1, 1));
            
          }
    }
    export class spin extends obstacle{
        constructor(_positionX: number) {
            super(_positionX);
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("wood")[0] as ƒ.Material);
            let dangle1: dangle = new dangle(_positionX);
            this.addChild(dangle1);
            let cmpJoint: ƒ.JointSpherical = new ƒ.JointSpherical(this.getComponent(ƒ.ComponentRigidbody), dangle1.getComponent(ƒ.ComponentRigidbody),);
            
            this.addComponent(cmpMaterial);
            this.addComponent(cmpJoint);
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(_positionX, 1, 0);
            this.mtxLocal.translation = positionVector;
            this.mtxLocal.scale(new ƒ.Vector3(0.3, 0.3, 1));
            
          }
    }
    export class dangle extends obstacle{
        constructor(_positionX: number) {
            super(_positionX);
            this.removeComponent(this.getComponent(ƒ.ComponentRigidbody));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("wood")[0] as ƒ.Material);
            this.addComponent(cmpMaterial);
            let positionVector: ƒ.Vector3 = new ƒ.Vector3(0, -2.8, 0);
            this.mtxLocal.translation = positionVector;
            
            let max: number = 4;
            let min: number = 1;
            let randomnumber: number = Math.random()* (max - min) + min;
            this.mtxLocal.scale(new ƒ.Vector3(1, randomnumber, 1));
   
            let rigid: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1,ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.DEFAULT);
            this.addComponent(rigid);
            
          }
    }
  }