/**
 * Created by nricken on 3/16/17.
 */
class JSLangJavascript extends JSLang{

    constructor(B:Banner){

        super(B);

        this.storeElements($(".ani-elem").toArray());

        this.loadImages();

    }

    // PRELOAD IMAGES

    loadImages = () => {

        if(this.imgLoads.length>0) {

            for (let img in this.imgLoads) {

                $(this.imgLoads[img].el).bind("load", this.checkLoad);
                this.imgLoads[img].el.src = this.imgLoads[img].src;

            }

        }else{

            this.B.publisherSetup();

        }

    };

    checkLoad = () =>{

        this.imgsLoaded++;

        if(this.imgsLoaded==this.imgLoads.length){

            this.B.publisherSetup();

        }

    };

    // UTILS

    storeElements = (_els:Array<any>, _cont:JQuery = null) => {

        for( let el in _els.reverse()) {

            this.storeElement(_els[el], _cont);

        }

    };

    storeElement = (_el:JQuery, _cont:JQuery = null) => {

        let obj: any;

        if ($(_el).children().length > 0) {

            this.els[$(_el).attr("id")] = $(_el);
            this.OG[$(_el).attr("id")] = $(_el).clone();

            this.storeElements($(_el).children().toArray());

        } else {

            if ($(_el).is("img")) {

                obj = new Image();
                let imgLoad:CJSImg = {
                    el: obj,
                    src: $(_el).attr("src")
                };
                this.imgLoads.push(imgLoad)

            }

            this.els[$(_el).attr("id")] = $(_el);
            this.OG[$(_el).attr("id")] = $(_el).clone();

        }

    };
}