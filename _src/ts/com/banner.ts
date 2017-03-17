class Banner implements BannerI{

    P:Publisher;
    L:JSLang;

    constructor(public langType:string="javascript", public pubType:string="doubleclick", public width: number = 0, public height: number = 0, public loop: number = 3, public type: string = "in-page") {

        switch (this.langType) {

            case "javascript": {

                this.L = new JSLangJavascript(this);

                break;

            }

            case "canvas": {

                this.L = new JSLangCanvas(this);

                break;

            }

        }

    };

    publisherSetup = ():void => {

        switch (this.pubType) {

            case "doubleclick": {

                this.P = new PublisherDoubleClick(this);

                break;

            }

            case "adwords": {

                this.P = new PublisherDoubleClick(this);

                break;

            }

            case "simplifi": {

                this.P = new PublisherDoubleClick(this);

                break;

            }

        }

    }

    /// OVERWRITE FUNCTION (REQUIRED) ///

    init = (e?:any):void => {

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

}

function applyCompany(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}