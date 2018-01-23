/**
 * Created by nricken on 3/16/17.
 */



class JSLang implements JSLangI{

    els:Object;
    OG:Object;

    imgLoads: Array<CJSImg>;
    imgsLoaded: number;

    constructor(public B:Banner){

        this.els = {};
        this.OG = {};
        this.imgsLoaded = 0;
        this.imgLoads = [];

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

    storeElements = (_els:Array<any>, _cont:createjs.Container|JQuery = null) => {

        for( let el in _els.reverse()) {

            this.storeElement(_els[el], _cont);

        }

    };

    storeElement = (_el:JQuery, _cont:createjs.Container|JQuery = null) => {

        //

    };


}