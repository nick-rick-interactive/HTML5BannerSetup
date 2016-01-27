class BannerAW

  constructor: (_width=0, _height=0, _loop=3) ->
    @width = _width
    @height = _height
    @loop = _loop
    @curLoop = 1

    #/// STORE ELEMENTS THAT WILL BE ANIMATED ///

    @els = $("#main").find(".ani-elem");

    @init()


  #/// OVERWRITE FUNCTION (REQUIRED) ///

  init: (e) =>

    alert "you must add an init function to the extended coffeescript class"


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


  switchFunc: (_func, _dur=0) =>

    if (@switchInt)

      clearInterval(@switchInt);

    @switchInt = setInterval(_func,_dur*1000);