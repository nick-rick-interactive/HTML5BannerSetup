class Banner {

    width: number;
    height: number;
    type: string;
    loop: number;
    curLoop: number;

    els: Object;

    switchInt:number;
    autoTimer:number;

    isExpanded:boolean;
    isCollapsed:boolean;

    constructor(_width: number = 0, _height: number = 0, _type: string = "in-page", _loop: number = 3) {

        this.width = _width;
        this.height = _height;
        this.type = _type;
        this.loop = _loop;
        this.curLoop = 1;

        /// STORE ELEMENTS THAT WILL BE ANIMATED ///

        this.els = $("#main").find(".ani-elem");

        /// ADD UI LISTENERS FOR EACH TYPE ///

        switch (this.type) {

            case "in-page": {

                $("#overlay").bind("click", this.exit);
                $("#cta").bind("click", this.exit);

                break;

            }

            case "expanding": {

                $("#overlay").bind("click", this.exit);
                $("#cta").bind("click", this.toggleExpand);

                $("#overlay-exp").bind("click", this.exit);
                $("#cta-exp").bind("click", this.exit);
                $("#close-exp").bind("click", this.toggleExpand);

                break;

            }

            case "floating": {

                $("#overlay").bind("click", this.exit);
                $("#cta").bind("click", this.toggleExpand);

                $("#overlay-float").bind("click", this.exit);
                $("#cta-float").bind("click", this.exit);
                $("#close-float").bind("click", this.close);

                break;

            }

        }

        /// ADD DOUBLE-CLICK LISTENERS ///

        if (this.type != "in-page") {

            Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, this.expandStartHandler);
            Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, this.expandFinishHandler);
            Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, this.collapseStartHandler);
            Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, this.collapseFinishHandler);

        }

        if (Enabler.isInitialized()) {

            this.enablerInitHandler(null);

        } else {

            Enabler.addEventListener(studio.events.StudioEvent.INIT, this.enablerInitHandler);

        }
    };

    enablerInitHandler = (e:studio.events.StudioEvent): void => {
        /// CHECK PAGE IS LOADED ///

        if (Enabler.isPageLoaded()) {

            this.checkVisible(null);

        } else {

            Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this.checkVisible);
        }

        if(e){

            console.log(e);

        }
    };

    checkVisible = (e:studio.events.StudioEvent):void => {

        /// CHECK PAGE IS VISIBLE ///

        if (Enabler.isVisible()) {

            this.init(null);

        } else {

            Enabler.addEventListener(studio.events.StudioEvent.VISIBLE,this.init);

        }

        if(e){

            console.log(e);

        }
    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    init = (e:studio.events.StudioEvent):void => {

        alert("you must add an init function to the extended type-script class");

        if(e){

            console.log(e);

        }

    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    expandInit = ():void => {

        alert("you must add an expand init function to the extended type-script class");

    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    closeInit = ():void => {

        alert("you must add an close init function to the extended coffeescript class");

    };

    /// OVERWRITE FUNCTION ///

    expandStartHandler = ():void =>{

        Enabler.finishExpand();

    };

    /// OVERWRITE FUNCTION ///

    expandFinishHandler = ():void =>{

        this.isExpanded = true;

        this.expandInit();

    };

    /// OVERWRITE FUNCTION ///

    collapseStartHandler = ():void =>{

        Enabler.finishCollapse();

    };

    /// OVERWRITE FUNCTION ///

    collapseFinishHandler = ():void =>{

        this.isCollapsed = true;

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

    toggleExpand = () =>{

        this.isExpanded = (this.isExpanded) ? Enabler.requestCollapse() : Enabler.requestExpand();

    };

    close = () =>{

        Enabler.reportManualClose();
        Enabler.close();

        this.closeInit();
    };

    autoClose = () => {

        if (this.autoTimer){

            clearInterval(this.autoTimer);

        }

        Enabler.close();

        this.closeInit();
    };

    switchFunc = (_func:Function, _dur:number=0) => {

        if (this.switchInt){

            clearInterval(this.switchInt);

        }

        this.switchInt = setInterval(_func,_dur*1000);
    };

    addCounter = (_el:Object, _text:string) => {

        $(_el).click( () => {

            Enabler.counter(_text)

        });

    }

}