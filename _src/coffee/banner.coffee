class Banner

  constructor: (_width=0, _height=0, _type="in-page", _loop=3) ->
    @width = _width
    @height = _height
    @type = _type
    @loop = _loop
    @curLoop = 1

    #/// STORE ELEMENTS THAT WILL BE ANIMATED ///

    @els = $("#main").find(".ani-elem");

    #/// ADD UI LISTENERS FOR EACH TYPE ///

    switch @type

      when "in-page"

        $("#overlay").bind("click",@exit);
        $("#cta").bind("click",@exit);

      when "expanding"

        $("#overlay").bind("click",@exit);
        $("#cta").bind("click",@toggleExpand);

        $("#overlay-exp").bind("click",@exit);
        $("#cta-exp").bind("click",@exit);
        $("#close-exp").bind("click",@toggleExpand);

      when "floating"

        $("#overlay").bind("click",@exit);
        $("#cta").bind("click",@toggleExpand);

        $("#overlay-float").bind("click",@exit);
        $("#cta-float").bind("click",@exit);
        $("#close-float").bind("click",@close);

    #/// ADD DOUBLECLICK LISTENERS ///

    if @type != "in-page"

      Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, @expandStartHandler);
      Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, @expandFinishHandler);
      Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, @collapseStartHandler);
      Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, @collapseFinishHandler);

    if (Enabler.isInitialized())

      @enablerInitHandler();

    else

      Enabler.addEventListener(studio.events.StudioEvent.INIT, @enablerInitHandler);

  enablerInitHandler: (e) =>

    #/// CHECK PAGE IS LOADED ///

    if (Enabler.isPageLoaded())

      @checkVisible();

    else

      Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, @checkVisible);

  checkVisible: (e) =>

    #/// CHECK PAGE IS VISIBLE ///

    if (Enabler.isVisible())

      @init();

    else

      Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, @init);



  #/// OVERWRITE FUNCTION (REQUIRED) ///

  init: (e) =>

    alert "you must add an init function to the extended coffeescript class"

  #/// OVERWRITE FUNCTION (REQUIRED) ///

  expandInit: () =>

    alert "you must add an expand init function to the extended coffeescript class"

  #/// OVERWRITE FUNCTION (REQUIRED) ///

  closeInit: () =>

    alert "you must add an close init function to the extended coffeescript class"


  #/// OVERWRITE FUNCTION ///

  expandStartHandler: (e) =>

    Enabler.finishExpand();


  #/// OVERWRITE FUNCTION ///

  expandFinishHandler: (e) =>

    @isExpanded = true;

    @expandInit();


  #/// OVERWRITE FUNCTION ///

  collapseStartHandler: (e) =>

    Enabler.finishCollapse();


  #/// OVERWRITE FUNCTION ///

  collapseFinishHandler: (e) =>

    @isCollapsed = true;



  #/// BASE CLASS FUNCTIONS ///

  end: (_func, _dur, _excludeStyleRemovalList = []) =>

    if @curLoop == @loop

      clearInterval(@switchInt);

    else

      @curLoop++;
      @replay(_func, _dur, _excludeStyleRemovalList);

  exit: (e) =>

    if (@switchInt)

      clearInterval(@switchInt);

    Enabler.exit("exit")

  replay: (_func, _dur, _excludeStyleRemovalList) =>

    for el in @els when $.inArray($(el).attr("id"),_excludeStyleRemovalList) > -1

      $(el).removeAttr("style")

    @switchFunc(_func, _dur)


  #/// UTILITY CLASS FUNCTIONS ///

  toggleExpand: =>

    @isExpanded = if @isExpanded then Enabler.requestCollapse() else Enabler.requestExpand();

  close: =>

    Enabler.reportManualClose();
    Enabler.close();

    @closeInit();

  autoClose: =>

    if(@autoTimer)

      clearInterval(@autoTimer);

    Enabler.close();

    @closeInit();


  switchFunc: (_func, _dur=0) =>

    if (@switchInt)

      clearInterval(@switchInt);

    @switchInt = setInterval(_func,_dur*1000);

  addCounter: (_el, _text) =>

    $(_el).click( () =>

      Enabler.counter(_text)

    )