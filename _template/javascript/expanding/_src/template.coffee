class _PREFIX___WIDTH_x_HEIGHT__exp__EXP_W_x_EXP_H_ extends Banner

  /// COLLAPSED ///

  init: () =>

    /// SETUP ASSETS ///

    ## SET FOR BANNER - left, top, opt_expandedWidth, opt_expandedHeight, opt_StartExpanded, opt_isMultiDirectional
    Enabler.setExpandingPixelOffsets(_OFFSET_Y_, _OFFSET_X_, _EXP_W_, _EXP_H_, false, true);

    ## AUTO EXPAND
    #Enabler.setStartExpanded(true);

    /// OR START ANIMATION ///

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


  /// EXPANDED ///

  expandInit: () =>

    /// SETUP ASSETS ///




  /// HANDLERS ///

  expandStartHandler: (e) =>

    ##Get Expand Direction
    $('#expanded-panel')addClass('direction-' + Enabler.getExpandDirection());

    Enabler.finishExpand();


  expandFinishHandler: (e) =>

    @isExpanded = true;


  collapseStartHandler: (e) =>

    Enabler.finishCollapse();


  collapseFinishHandler: (e) =>

    @isCollapsed = true;


banner = ""

$(document).ready ->

  # Change name here too
  banner = new _PREFIX___WIDTH_x_HEIGHT__exp__EXP_W_x_EXP_H_ _EXP_W_, _EXP_H_, "expanding", 3