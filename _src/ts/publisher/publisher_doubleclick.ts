/**
 * Created by nricken on 3/16/17.
 */
class PublisherDoubleClick extends Publisher{

    constructor(B:Banner, type:string="in-page") {

        super(B, type);

        /// ADD UI LISTENERS FOR EACH TYPE ///

        let els = B.L.els;

        switch (this.type) {

            case "in-page": {

                $(els["overlay"]).bind("click", this.exit);
                $(els["cta"]).bind("click", this.exit);

                break;

            }

            case "expanding": {

                $(els["overlay"]).bind("click", this.exit);
                $(els["cta"]).bind("click", this.toggleExpand);

                $(els["overlay-exp"]).bind("click", this.exit);
                $(els["cta-exp"]).bind("click", this.exit);
                $(els["close-exp"]).bind("click", this.toggleExpand);

                break;

            }

            case "floating": {

                $(els["overlay"]).bind("click", this.exit);
                $(els["cta"]).bind("click", this.toggleExpand);

                $(els["overlay-float"]).bind("click", this.exit);
                $(els["cta-float"]).bind("click", this.exit);
                $(els["close-float"]).bind("click", this.close);

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

            this.enablerInitHandler();

        } else {

            Enabler.addEventListener(studio.events.StudioEvent.INIT, this.enablerInitHandler);

        }
    }


    private enablerInitHandler = (e?:studio.events.StudioEvent): void => {
        /// CHECK PAGE IS LOADED ///

        if (Enabler.isPageLoaded()) {

            this.checkVisible();

        } else {

            Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this.checkVisible);
        }

    };

    private checkVisible = (e?:studio.events.StudioEvent):void => {

        /// CHECK PAGE IS VISIBLE ///

        if (Enabler.isVisible()) {

            this.B.init();

        } else {

            Enabler.addEventListener(studio.events.StudioEvent.VISIBLE,this.B.init);

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


    expandStartHandler = ():void =>{

        Enabler.finishExpand();

    };

    /// OVERWRITE FUNCTION ///

    collapseStartHandler = ():void =>{

        Enabler.finishCollapse();

    };

    /// OVERWRITE FUNCTION ///

    collapseFinishHandler = ():void =>{

        this.isCollapsed = true;

    };

    toggleExpand = () =>{

        this.isExpanded = (this.isExpanded) ? Enabler.requestCollapse() : Enabler.requestExpand();

    };

    exit = ():void =>{

        if (this.switchInt){

            clearInterval(this.switchInt);

        }

        Enabler.exit("exit");

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

    addCounter = (_el:Object, _text:string) => {

        $(_el).click( () => {

            Enabler.counter(_text)

        });

    };


}