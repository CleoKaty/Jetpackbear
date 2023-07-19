namespace Script{
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class Gamestate extends ƒ.Mutable{
        public points: number;
        public health: number;
        private controller: ƒUi.Controller;

        constructor(_config: {[key: string]: number}){
            super();
            this.points = 0;
            this.health = _config.heart;

            let vui: HTMLDivElement = document.querySelector("div#vui");
            this.controller = new ƒUi.Controller(this,vui)
        }

        public updatehealth():void {
            console.log("minus");
            let lifebar: HTMLImageElement = document.querySelector("#img");
            if(this.health == 2){
                console.log("two");
                lifebar.setAttribute('src', 'Resoources/heart2.png');
            }
            if(this.health == 1){
                lifebar.setAttribute('src', 'Resoources/heart1.png');
                console.log("one");
            }
            if(this.health == 0){
                lifebar.setAttribute('src', 'Resoources/horrorhearts.png');
                console.log("zero");
            }
        }
        

        protected reduceMutator(_mutator: ƒ.Mutator):void{};
    }
}