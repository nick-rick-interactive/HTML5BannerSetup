class Banner

  constructor: (_width=0, _height=0, _loop=3) ->
    @width = _width
    @height = _height
    @loop = _loop
    @curLoop = 1

    @els = $("#main").find(".ani-elem");

    $("overlay").bind("click",@.exit)

    if (Enabler.isInitialized())
      Banner.enablerInitHandler();
    else
      Enabler.addEventListener(studio.events.StudioEvent.INIT, @enablerInitHandler);

  enablerInitHandler: (e) =>
    console.log e
    if (Enabler.isPageLoaded())
      Banner.checkVisible();
    else
      Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, @checkVisible);

  checkVisible: (e) =>
    if (Enabler.isVisible())
      Banner.init();
    else
      Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, @init);

  init: (e) =>
    alert "you must add an init function to the extended coffeescript class"

  end: (_func, _dur) =>
    if @curLoop == @loop
      clearInterval(@switchInt);
    else
      @curLoop++;
      @replay(_func, _dur);

  exit: (e) =>
    if (@switchInt)
      clearInterval(@switchInt);

    Enabler.exit(_exit="exit")

  replay: (_func, _dur) =>
    $(el)[0].removeAttribute("style") for el in @els
    @switchFunc(_func, _dur)

  switchFunc: (_func, _dur=0) =>
    if (@switchInt)
      clearInterval(@switchInt);

    @switchInt = setInterval(_func,_dur*1000);