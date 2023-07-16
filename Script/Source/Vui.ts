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
        

        protected reduceMutator(_mutator: ƒ.Mutator):void{};
    }
}