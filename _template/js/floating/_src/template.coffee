class _PREFIX___WIDTH_x_HEIGHT__exp__EXP_W_x_EXP_H_ extends Banner

  /// FLOATING ///

  init: () =>

    /// SETUP ASSETS ///

    ## SET FOR BANNER - opt_expandedWidth, opt_expandedHeight
    Enabler.setFloatingPixelDimensions(_EXP_W_,_EXP_H_);

    ## AUTO CLOSE
    #@autoTimer = setInterval(@autoClose,15000)

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


  /// CLOSE FLOATING / START COLLAPSED ///

  closeInit: () =>

    /// SETUP ASSETS ///





banner = ""

$(document).ready ->

  # Change name here too
  banner = new _PREFIX___WIDTH_x_HEIGHT__exp__EXP_W_x_EXP_H_ _EXP_W_, _EXP_H_, "floating", 3