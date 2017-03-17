/**
 * Created by nricken on 3/16/17.
 */

class Publisher implements PublisherI{

    loop:number;
    curLoop:number;

    switchInt:number;
    autoTimer:number;

    isExpanded:boolean;
    isCollapsed:boolean;

    constructor(public B:Banner, public type:string="in-page"){

        this.curLoop = 1;

    }

    init = (e?:any):void => {

        alert("you must add an init function to the extended type-script class");

    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    expandInit = ():void => {

        alert("you must add an expand init function to the extended type-script class");

    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    closeInit = ():void => {

        alert("you must add an close init function to the extended coffeescript class");

    };


    expandStartHandler = ():void =>{

        //

    };

    expandFinishHandler = ():void =>{

        this.isExpanded = true;

        this.expandInit();

    };

    /// OVERWRITE FUNCTION ///

    collapseStartHandler = ():void =>{

        //

    };

    /// OVERWRITE FUNCTION ///

    collapseFinishHandler = ():void =>{

        this.isCollapsed = true;

    };

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

    };

    replay = (_func:Function, _dur:number = 0, _excludeStyleRemovalList:Array<string> = []):void => {

        let els = this.B.L.els;

        if(_excludeStyleRemovalList.length>0) {

            for (let el in els) {

                if ($.inArray($(els[el]).attr("id"), _excludeStyleRemovalList) > -1) {

                    $(els[el]).removeAttr("style");

                }
            }
        }

        this.switchFunc(_func, _dur);

    };

    close = () =>{

        this.closeInit();
    };

    autoClose = () => {

        if (this.autoTimer){

            clearInterval(this.autoTimer);

        }

        this.closeInit();
    };

    switchFunc = (_func:Function, _dur:number=0) => {

        if (this.switchInt){

            clearInterval(this.switchInt);

        }

        this.switchInt = setInterval(_func,_dur*1000);
    };

}