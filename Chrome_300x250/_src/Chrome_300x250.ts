class Chrome_300x250 extends BannerCanvas {

    pace: number;
    origVals: Object;
    img:HTMLImageElement;

    constructor(_width: number = 0, _height: number = 0, _type: string = "in-page", _loop: number = 3) {

        super(_width, _height, _type, _loop);

    }

    init = () => {

        this.pace = 1;

        /// SETUP ASSETS ///

        this.origVals = {};

        /// SETUP ASSETS ///

        this.setup();

        /// START ANIMATION ///

    };

    setup = () => {


        TweenLite.set(this.els["ball"], {alpha: 0,y:this.height/2,x:this.width/2+70});

        this.centerReg(this.els["ball"]);

        for (let i: number = 1; i < 4; i++) {

            if(i<3){
                TweenLite.set(this.els["h2_"+i],{alpha:0,y:this.height/2,x:this.width/2,scaleX:0.95,scaleY:0.95});
                this.centerReg(this.els["h2_"+i]);
            }
            TweenLite.set(this.els["h"+i],{alpha:0,y:this.height/2,x:this.width/2,scaleX:0.95,scaleY:0.95});
            this.centerReg(this.els["h"+i]);

        }

        TweenMax.set(this.els["cta"],{alpha:0})
        TweenMax.set(this.els["chevron"],{alpha:0,x:-5})

        this.phase1();
    };

    phase1 = () => {


        for (let i: number = 1; i < 4; i++) {
            TweenMax.to(this.els['h'+i], 1, {alpha:1, scaleX: 1, scaleY: 1, ease: Expo.easeInOut,delay:0.2*i})
        }

        this.switchFunc(this.phase2, this.pace+1.5);

    };

    phase2 = () => {

        /// FIRST ANIMATION ///


        for (let i: number = 1; i < 4; i++) {
            TweenMax.to(this.els['h'+i], 1, {alpha:0, scaleX: 0.9, scaleY: 0.9, ease: Expo.easeInOut,delay:0.05*i})
        }

        TweenMax.to(this.els['ball'],1,{alpha:1, ease: Cubic.easeOut,delay:0.75})
        TweenMax.to(this.els['ball'],1,{x:this.width/2, ease: Expo.easeInOut,delay:1.75})


        this.switchFunc(this.phase3, this.pace+0.5);

    };

    phase3 = () => {

        for (let i: number = 1; i < 3; i++) {
            TweenMax.to(this.els['h2_'+i], 1, {alpha:1, scaleX: 1, scaleY: 1, ease: Expo.easeInOut,delay:0.2*i})
        }

        TweenMax.to(this.els['cta'],1,{alpha:1,ease:Cubic.easeOut,delay:1})
        TweenMax.to(this.els['chevron'],1,{alpha:1,ease:Cubic.easeOut,delay:1})
        TweenMax.to(this.els['chevron'],1,{x:0,ease:Cubic.easeOut,delay:1.05})

        this.switchFunc(this.phase4, this.pace+0.5);

    };

    phase4 = () => {

        $("#main").on("mouseover", this.overBanner)
        $("#main").on("mouseout", this.outBanner)

        this.switchFunc(this.finish, this.pace + 6);

    };

    finish = () => {

        if (this.curLoop == this.loop) {

            /// END NO ANIMATION ///

            this.end(this.setup)

        } else {

            /// END WITH ANIMATION ///

            TweenLite.to(this.els["bg"], 0.3, {
                alpha: 1, ease: Cubic.easeInOut, onComplete: () =>

                    this.end(this.setup)

            })

        }

    };

    overBanner = () => {

        TweenMax.to(this.els['chevron'],0.5,{x:-5,ease:Cubic.easeOut})

    };

    outBanner = () => {

        TweenMax.to(this.els['chevron'],0.5,{x:0,ease:Cubic.easeOut})

    }

    shuffle = (array) => {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }


}

$(document).ready(() => {

    //start();
    banner = new Chrome_300x250(300, 250, "in-page", 1);

});

