class _PREFIX___WIDTH_x_HEIGHT__C extends Banner {

  pace: number;

  constructor(_langType:string = "javascript", _pubType:string = "doubleclick", _width: number = 0, _height: number = 0, _loop: number = 3, _type:string = "in-page") {

    super(_langType, _pubType, _width, _height, _loop, _type);

  }

  init = () => {

    this.pace = 1;

    /// SETUP ASSETS ///

    this.setup();

    /// START ANIMATION ///

  };

  setup = () => {

    /// SETUP ASSETS ///

    this.phase1();

  };

  phase1 = () => {

    /// FIRST ANIMATION ///

    this.P.switchFunc(this.finish, this.pace);

  };

  finish = () => {

    if (this.P.curLoop == this.loop) {

      /// END NO ANIMATION ///

      this.P.end(this.setup)

    } else {

      /// END WITH ANIMATION ///

      TweenLite.to($("#start"), 0.3, {alpha: 1, ease: Cubic.easeInOut, onComplete: () =>

          this.P.end(this.setup)

      })

    }

  };

}

$(document).ready(() => {

  let TSLANG = "_LANG_";
  let TSPUB = "_PUB_";
  let TSTYPE = "_TYPE_";

  banner = new _PREFIX___WIDTH_x_HEIGHT__C(TSLANG, TSPUB, 728, 90, 1, TSTYPE);

});

