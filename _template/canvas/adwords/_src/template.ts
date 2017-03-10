class _PREFIX___WIDTH_x_HEIGHT__CAW extends BannerCanvasAW {

    pace: number;

    constructor(_width: number = 0, _height: number = 0, _loop: number = 3) {

        super(_width, _height, _loop);

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

        this.switchFunc(this.finish, this.pace);

    };

    finish = () => {

        if (this.curLoop == this.loop) {

            /// END NO ANIMATION ///

            this.end(this.setup)

        } else {

            /// END WITH ANIMATION ///

            TweenLite.to($("#start"), 0.3, {
                alpha: 1, ease: Cubic.easeInOut, onComplete: () =>

                    this.end(this.setup)

            })

        }

    };

}

$(document).ready(() => {

    banner = new _PREFIX___WIDTH_x_HEIGHT__AW(728, 90, 1);

});

