/**
 * Created by nricken on 3/16/17.
 */
class JSLangCanvas extends JSLang{

    canvas: HTMLCanvasElement;
    stage: createjs.Stage;

    constructor(B:Banner){

        super(B);

        this.canvas = document.getElementById('main') as HTMLCanvasElement;
        this.stage = new createjs.Stage(this.canvas);

        this.storeElements($("#elements").children().toArray());

        if(TweenMax){

            TweenMax.ticker.addEventListener("tick", this.stage.update, this.stage);

        }else {

            TweenLite.ticker.addEventListener("tick", this.stage.update, this.stage);

        }

        this.stage.update();

        this.els['overlay'].cursor = "pointer";
        this.els['overlay'].enableMouseOver = true;
        this.els['ctacont'].cursor = "pointer";
        this.els['ctacont'].enableMouseOver = true;

        this.loadImages();

    }

    // PRELOAD IMAGES

    loadImages = () => {

        //

        for( let img in this.imgLoads) {

            $(this.imgLoads[img].el.image).bind("load", this.checkLoad);
            this.imgLoads[img].el.image.src = this.imgLoads[img].src;

        }

    };

    checkLoad = () =>{

        //

        this.imgsLoaded++;

        if(this.imgsLoaded==this.imgLoads.length){

            for( let img in this.imgLoads){

                this.imgLoads[img].el.cache(0, 0, this.imgLoads[img].el.getBounds().width, this.imgLoads[img].el.getBounds().height);

            }

            this.B.publisherSetup();

        }


    };

    // UTILS

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
}