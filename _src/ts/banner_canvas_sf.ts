class BannerCanvasSF {

    width: number;
    height: number;
    type: string;
    loop: number;
    curLoop: number;

    imgLoads: Array<CJSImg>;
    imgsLoaded: number;

    canvas: HTMLCanvasElement;
    stage: createjs.Stage;

    els: Object;
    OG: Object;

    switchInt: number;
    autoTimer: number;

    isExpanded: boolean;
    isCollapsed: boolean;

    constructor(_width: number = 0, _height: number = 0, _type: string = "in-page", _loop: number = 3) {

        this.width = _width;
        this.height = _height;
        this.type = _type;
        this.loop = _loop;
        this.curLoop = 1;
        this.imgLoads = [];
        this.imgsLoaded = 0;

        /// STORE ELEMENTS THAT WILL BE ANIMATED ///

        this.canvas = document.getElementById('main') as HTMLCanvasElement;
        this.stage = new createjs.Stage(this.canvas);

        this.els = {};
        this.OG = {};
        this.storeElements($("#elements").children().toArray());

        TweenLite.ticker.addEventListener("tick", this.update);

        this.els['overlay'].cursor = "pointer";
        this.els['overlay'].enableMouseOver = true;
        this.els['ctacont'].cursor = "pointer";
        this.els['ctacont'].enableMouseOver = true;

        this.stage.update();

        $("#main").bind("click",this.exit);

        this.loadImages();
    };

    loadImages = () => {

        for( let img in this.imgLoads) {

            $(this.imgLoads[img].el.image).bind("load", this.checkLoad);
            this.imgLoads[img].el.image.src = this.imgLoads[img].src;

        }

    };

    checkLoad = () =>{

        this.imgsLoaded++;

        if(this.imgsLoaded==this.imgLoads.length){

            for( let img in this.imgLoads){

                this.imgLoads[img].el.cache(0, 0, this.imgLoads[img].el.getBounds().width, this.imgLoads[img].el.getBounds().height);

            }

            this.enablerInitHandler(null);

        }

    };

    enablerInitHandler = (e:studio.events.StudioEvent): void => {

        /// CHECK PAGE IS LOADED ///

        this.checkVisible(null);

        if(e){

            console.log(e);

        }

    };

    checkVisible = (e:studio.events.StudioEvent):void => {

        /// CHECK PAGE IS VISIBLE ///

        this.init(null);

        if(e){

            console.log(e);

        }

    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    init = (e:any):void => {

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

        window.open(clickTag, "_blank");

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


    storeElements = (_els:Array<any>, _cont:createjs.Container = null) => {

        for( let el in _els.reverse()) {

            this.storeElement(_els[el], _cont);

        }

    };

    storeElement = (_el:JQuery, _cont:createjs.Container = null) => {

        let nCont: createjs.Container;
        let obj: any;

        if ($(_el).children().length > 0) {

            nCont = new createjs.Container();
            nCont.x = Number($(_el).css("left").replace("px", ""));
            nCont.y = Number($(_el).css("top").replace("px", ""));
            nCont.alpha = Number($(_el).css("opacity").replace("px", ""));

            this.els[$(_el).attr("id")] = nCont;
            this.OG[$(_el).attr("id")] = nCont.clone;

            this.stage.addChild(nCont);

            this.storeElements($(_el).children().toArray(), nCont);

        } else {

            if ($(_el).is("img")) {

                obj = new createjs.Bitmap("");
                $(_el).attr("src");
                let imgLoad:CJSImg = {
                    el: obj,
                    src: $(_el).attr("src")
                };
                this.imgLoads.push(imgLoad)

            } else {

                obj = new createjs.Shape();
                //obj.width = Number($(_el).css("width").replace("px", ""));
                //obj.height = Number($(_el).css("height").replace("px", ""));
                obj.graphics.beginFill("rgba(255,0,0,0)");
                obj.graphics.drawRect(0, 0, Number($(_el).css("width").replace("px", "")), Number($(_el).css("height").replace("px", "")));

            }

            obj.name = $(_el).attr("id");
            obj.x = Number($(_el).css("left").replace("px", ""));
            obj.y = Number($(_el).css("top").replace("px", ""));
            obj.alpha = Number($(_el).css("opacity").replace("px", ""));

            this.els[$(_el).attr("id")] = obj;
            this.OG[$(_el).attr("id")] = obj.clone;

            if (_cont){

                _cont.addChild(obj);

            }else{

                this.stage.addChild(obj);

            }

        }

    };


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

    };

    centerReg = (_el:createjs.DisplayObject) => {

        _el.regX = _el.getBounds().width/2;
        _el.regY = _el.getBounds().height/2;

    };

    rightReg = (_el:createjs.DisplayObject) =>{

        _el.regX = _el.getBounds().width

    }

    update = () => {
        this.stage.update();
    }

}

interface CJSImg {
    el:any,
    src:string
}