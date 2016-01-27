class Test_728x90 extends BannerCanvas

  init: () =>

    /// SETUP ASSETS ///


    /// START ANIMATION ///

    @phase1()

  phase1: () =>

    /// FIRST ANIMATION ///

    @switchFunc(@finish,1.5);

  finish: () =>

    if @curLoop==@loop

      /// END NO ANIMATION ///

      @end(@init)

    else

      /// END WITH ANIMATION ///

      #example
      TweenMax.to($("#start"),0.3,{rotationX:-90,opacity:0,y:$("#start").height()/2,ease:Back.easeIn,delay:0.3,onComplete:()=>

        @end(@init)

      })


banner = ""

$(document).ready ->

  # Change name here too
  banner = new Test_728x90 728, 90, "in-page", 3