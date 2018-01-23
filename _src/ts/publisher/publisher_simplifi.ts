/**
 * Created by nricken on 3/16/17.
 */
class PublisherSimplifi extends Publisher{

    constructor(B:Banner, type:string="in-page") {

        super(B, type);

        /// ADD UI LISTENERS FOR EACH TYPE ///

        this.init();

    }

    /// OVERWRITE FUNCTION (REQUIRED) ///

    expandInit = ():void => {

        //

    };

    /// OVERWRITE FUNCTION (REQUIRED) ///

    closeInit = ():void => {

        //

    };

    exit = ():void =>{

        if (this.switchInt){

            clearInterval(this.switchInt);

        }

        window.open(clickTag, "_blank");

    };


}