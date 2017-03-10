class BannerAW {

    width: number;
    height: number;
    loop: number;
    curLoop: number;

    els: Object;

    switchInt:number;

    constructor(_width: number = 0, _height: number = 0, _loop: number = 3) {

        this.width = _width;
        this.height = _height;
        this.loop = _loop;
        this.curLoop = 1;

        /// STORE ELEMENTS THAT WILL BE ANIMATED ///

        this.els = $("#main").find(".ani-elem");

        this.init(null);
    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    init = (e:studio.events.StudioEvent):void => {

        alert("you must add an init function to the extended type-script class");

        if(e){

            console.log(e);

        }

    };

    /// BASE CLASS FUNCTIONS ///

    end = (_func:Function, _dur:number = 0, _excludeStyleRemovalList:Array<string> = []):void => {

        if(this.curLoop == this.loop) {

            clearInterval(this.switchInt);

        }else {

            this.curLoop++;
            this.replay(_func, _dur, _excludeStyleRemovalList);

        }

    };

    exit = ():void =>{

        if (this.switchInt){

            clearInterval(this.switchInt);

        }

        Enabler.exit("exit");

    };

    replay = (_func:Function, _dur:number = 0, _excludeStyleRemovalList:Array<string> = []):void => {

        for( let el in this.els){

            if($.inArray($(this.els[el]).attr("id"),_excludeStyleRemovalList) > -1){

                $(this.els[el]).removeAttr("style");

            }
        }

        this.switchFunc(_func, _dur);

    };


    /// UTILITY CLASS FUNCTIONS ///

    switchFunc = (_func:Function, _dur:number=0) => {

        if (this.switchInt){

            clearInterval(this.switchInt);

        }

        this.switchInt = setInterval(_func,_dur*1000);
    };

}