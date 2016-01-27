class BannerCanvas

  constructor: (_width=0, _height=0, _type="in-page", _loop=3) ->
    @width = _width
    @height = _height
    @type = _type
    @loop = _loop
    @curLoop = 1

    #/// STORE ELEMENTS THAT WILL BE ANIMATED ///

    @canvas = document.getElementById('main');
    @stage = new createjs.Stage(@canvas);

    @els = {};
    @storeElements($("#elements").children().toArray());

    console.log @els

    TweenMax.ticker.addEventListener("tick", @stage.update, @stage);
    @stage.update();

    #/// ADD UI LISTENERS FOR EACH TYPE ///

    switch @type

      when "in-page"

        @els["overlay"].addEventListener("click",@exit);
        @els["cta"].addEventListener("click",@exit);

      when "expanding"

        @els["overlay"].addEventListener("click",@exit);
        @els["cta"].addEventListener("click",@toggleExpand);

        @els["overlay-exp"].addEventListener("click",@exit);
        @els["cta-exp"].addEventListener("click",@exit);
        @els["close-exp"].addEventListener("click",@toggleExpand);

      when "floating"

        @els["overlay"].addEventListener("click",@exit);
        @els["cta"].addEventListener("click",@toggleExpand);

        @els["overlay-float"].addEventListener("click",@exit);
        @els["cta-float"].addEventListener("click",@exit);
        @els["close-float"].addEventListener("click",@close);

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

  storeElements: (_els,_cont = null) =>

    for el in _els.reverse()

      @storeElement(el,_cont);

  storeElement: (_el,_cont = null) =>

    console.log($(_el).attr("id"));

    if $(_el).children().length > 0

      nCont = new createjs.Container();
      nCont.x = Number($(_el).css("left").replace("px",""));
      nCont.y = Number($(_el).css("top").replace("px",""));

      @els[$(_el).attr("id")] = nCont;

      @stage.addChild(nCont);

      @storeElements($(_el).children().toArray(),nCont);

    else

      if $(_el).is("img")

        obj = new createjs.Bitmap $(_el).attr("src");

      else

        obj = new createjs.Shape;
        obj.graphics.drawRect 0, 0, Number($(_el).css("width").replace("px","")), Number($(_el).css("height").replace("px",""));


      obj.x = Number($(_el).css("left").replace("px",""));
      obj.y = Number($(_el).css("top").replace("px",""));

      @els[$(_el).attr("id")] = obj;

      if _cont

        _cont.addChild obj

      else

        @stage.addChild obj


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