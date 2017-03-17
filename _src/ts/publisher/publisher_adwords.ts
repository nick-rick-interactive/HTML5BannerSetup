/**
 * Created by nricken on 3/16/17.
 */
class PublisherAdWords extends Publisher{

    constructor(B:Banner, type:string="in-page") {

        super(B, type);

        /// ADD UI LISTENERS FOR EACH TYPE ///

        let els = B.L.els;

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

        ExitApi.exit();

    };


}