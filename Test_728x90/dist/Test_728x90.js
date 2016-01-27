var BannerCanvas, Test_728x90, banner,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BannerCanvas = (function() {
  function BannerCanvas(_width, _height, _type, _loop) {
    if (_width == null) {
      _width = 0;
    }
    if (_height == null) {
      _height = 0;
    }
    if (_type == null) {
      _type = "in-page";
    }
    if (_loop == null) {
      _loop = 3;
    }
    this.addCounter = bind(this.addCounter, this);
    this.switchFunc = bind(this.switchFunc, this);
    this.autoClose = bind(this.autoClose, this);
    this.close = bind(this.close, this);
    this.toggleExpand = bind(this.toggleExpand, this);
    this.storeElement = bind(this.storeElement, this);
    this.storeElements = bind(this.storeElements, this);
    this.replay = bind(this.replay, this);
    this.exit = bind(this.exit, this);
    this.end = bind(this.end, this);
    this.collapseFinishHandler = bind(this.collapseFinishHandler, this);
    this.collapseStartHandler = bind(this.collapseStartHandler, this);
    this.expandFinishHandler = bind(this.expandFinishHandler, this);
    this.expandStartHandler = bind(this.expandStartHandler, this);
    this.closeInit = bind(this.closeInit, this);
    this.expandInit = bind(this.expandInit, this);
    this.init = bind(this.init, this);
    this.checkVisible = bind(this.checkVisible, this);
    this.enablerInitHandler = bind(this.enablerInitHandler, this);
    this.width = _width;
    this.height = _height;
    this.type = _type;
    this.loop = _loop;
    this.curLoop = 1;
    this.canvas = document.getElementById('main');
    this.stage = new createjs.Stage(this.canvas);
    this.els = {};
    this.storeElements($("#elements").children().toArray());
    console.log(this.els);
    TweenMax.ticker.addEventListener("tick", this.stage.update, this.stage);
    this.stage.update();
    switch (this.type) {
      case "in-page":
        this.els["overlay"].addEventListener("click", this.exit);
        this.els["cta"].addEventListener("click", this.exit);
        break;
      case "expanding":
        this.els["overlay"].addEventListener("click", this.exit);
        this.els["cta"].addEventListener("click", this.toggleExpand);
        this.els["overlay-exp"].addEventListener("click", this.exit);
        this.els["cta-exp"].addEventListener("click", this.exit);
        this.els["close-exp"].addEventListener("click", this.toggleExpand);
        break;
      case "floating":
        this.els["overlay"].addEventListener("click", this.exit);
        this.els["cta"].addEventListener("click", this.toggleExpand);
        this.els["overlay-float"].addEventListener("click", this.exit);
        this.els["cta-float"].addEventListener("click", this.exit);
        this.els["close-float"].addEventListener("click", this.close);
    }
    if (this.type !== "in-page") {
      Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, this.expandStartHandler);
      Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, this.expandFinishHandler);
      Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, this.collapseStartHandler);
      Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, this.collapseFinishHandler);
    }
    if (Enabler.isInitialized()) {
      this.enablerInitHandler();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.INIT, this.enablerInitHandler);
    }
  }

  BannerCanvas.prototype.enablerInitHandler = function(e) {
    if (Enabler.isPageLoaded()) {
      return this.checkVisible();
    } else {
      return Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this.checkVisible);
    }
  };

  BannerCanvas.prototype.checkVisible = function(e) {
    if (Enabler.isVisible()) {
      return this.init();
    } else {
      return Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, this.init);
    }
  };

  BannerCanvas.prototype.init = function(e) {
    return alert("you must add an init function to the extended coffeescript class");
  };

  BannerCanvas.prototype.expandInit = function() {
    return alert("you must add an expand init function to the extended coffeescript class");
  };

  BannerCanvas.prototype.closeInit = function() {
    return alert("you must add an close init function to the extended coffeescript class");
  };

  BannerCanvas.prototype.expandStartHandler = function(e) {
    return Enabler.finishExpand();
  };

  BannerCanvas.prototype.expandFinishHandler = function(e) {
    this.isExpanded = true;
    return this.expandInit();
  };

  BannerCanvas.prototype.collapseStartHandler = function(e) {
    return Enabler.finishCollapse();
  };

  BannerCanvas.prototype.collapseFinishHandler = function(e) {
    return this.isCollapsed = true;
  };

  BannerCanvas.prototype.end = function(_func, _dur, _excludeStyleRemovalList) {
    if (_excludeStyleRemovalList == null) {
      _excludeStyleRemovalList = [];
    }
    if (this.curLoop === this.loop) {
      return clearInterval(this.switchInt);
    } else {
      this.curLoop++;
      return this.replay(_func, _dur, _excludeStyleRemovalList);
    }
  };

  BannerCanvas.prototype.exit = function(e) {
    if (this.switchInt) {
      clearInterval(this.switchInt);
    }
    return Enabler.exit("exit");
  };

  BannerCanvas.prototype.replay = function(_func, _dur, _excludeStyleRemovalList) {
    var el, i, len, ref;
    ref = this.els;
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      if ($.inArray($(el).attr("id"), _excludeStyleRemovalList) > -1) {
        $(el).removeAttr("style");
      }
    }
    return this.switchFunc(_func, _dur);
  };

  BannerCanvas.prototype.storeElements = function(_els, _cont) {
    var el, i, len, ref, results;
    if (_cont == null) {
      _cont = null;
    }
    ref = _els.reverse();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      results.push(this.storeElement(el, _cont));
    }
    return results;
  };

  BannerCanvas.prototype.storeElement = function(_el, _cont) {
    var nCont, obj;
    if (_cont == null) {
      _cont = null;
    }
    console.log($(_el).attr("id"));
    if ($(_el).children().length > 0) {
      nCont = new createjs.Container();
      nCont.x = Number($(_el).css("left").replace("px", ""));
      nCont.y = Number($(_el).css("top").replace("px", ""));
      this.els[$(_el).attr("id")] = nCont;
      this.stage.addChild(nCont);
      return this.storeElements($(_el).children().toArray(), nCont);
    } else {
      if ($(_el).is("img")) {
        obj = new createjs.Bitmap($(_el).attr("src"));
      } else {
        obj = new createjs.Shape;
        obj.graphics.drawRect(0, 0, Number($(_el).css("width").replace("px", "")), Number($(_el).css("height").replace("px", "")));
      }
      obj.x = Number($(_el).css("left").replace("px", ""));
      obj.y = Number($(_el).css("top").replace("px", ""));
      console.log(obj.x + " " + $(_el).css("left"));
      this.els[$(_el).attr("id")] = obj;
      if (_cont) {
        return _cont.addChild(obj);
      } else {
        return this.stage.addChild(obj);
      }
    }
  };

  BannerCanvas.prototype.toggleExpand = function() {
    return this.isExpanded = this.isExpanded ? Enabler.requestCollapse() : Enabler.requestExpand();
  };

  BannerCanvas.prototype.close = function() {
    Enabler.reportManualClose();
    Enabler.close();
    return this.closeInit();
  };

  BannerCanvas.prototype.autoClose = function() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
    }
    Enabler.close();
    return this.closeInit();
  };

  BannerCanvas.prototype.switchFunc = function(_func, _dur) {
    if (_dur == null) {
      _dur = 0;
    }
    if (this.switchInt) {
      clearInterval(this.switchInt);
    }
    return this.switchInt = setInterval(_func, _dur * 1000);
  };

  BannerCanvas.prototype.addCounter = function(_el, _text) {
    return $(_el).click((function(_this) {
      return function() {
        return Enabler.counter(_text);
      };
    })(this));
  };

  return BannerCanvas;

})();

Test_728x90 = (function(superClass) {
  extend(Test_728x90, superClass);

  function Test_728x90() {
    this.finish = bind(this.finish, this);
    this.phase1 = bind(this.phase1, this);
    this.init = bind(this.init, this);
    return Test_728x90.__super__.constructor.apply(this, arguments);
  }

  Test_728x90.prototype.init = function() {
    /SETUPASSETS/;
    /STARTANIMATION/;
    return this.phase1();
  };

  Test_728x90.prototype.phase1 = function() {
    /FIRSTANIMATION/;
    return this.switchFunc(this.finish, 1.5);
  };

  Test_728x90.prototype.finish = function() {
    if (this.curLoop === this.loop) {
      /ENDNOANIMATION/;
      return this.end(this.init);
    } else {
      /ENDWITHANIMATION/;
      return TweenMax.to($("#start"), 0.3, {
        rotationX: -90,
        opacity: 0,
        y: $("#start").height() / 2,
        ease: Back.easeIn,
        delay: 0.3,
        onComplete: (function(_this) {
          return function() {
            return _this.end(_this.init);
          };
        })(this)
      });
    }
  };

  return Test_728x90;

})(BannerCanvas);

banner = "";

$(document).ready(function() {
  return banner = new Test_728x90(728, 90, "in-page", 3);
});
