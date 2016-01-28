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
    this.OG = {};
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
    console.log("enabler");
    if (Enabler.isPageLoaded()) {
      return this.checkVisible();
    } else {
      return Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this.checkVisible);
    }
  };

  BannerCanvas.prototype.checkVisible = function(e) {
    console.log("visible");
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
    var el, j, k, len, len1, prop, ref, ref1;
    console.log("yee");
    ref = this.els;
    for (j = 0, len = ref.length; j < len; j++) {
      el = ref[j];
      if ($.inArray(el, _excludeStyleRemovalList) > -1) {
        ref1 = this.els[el];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          prop = ref1[k];
          console.log(el(+" " + prop(+" = " + this.OG[el][prop] + " " + this.els[el][prop])));
          this.els[el][prop] = this.OG[el][prop];
        }
      }
    }
    return this.switchFunc(_func, _dur);
  };

  BannerCanvas.prototype.storeElements = function(_els, _cont) {
    var el, j, len, ref, results;
    if (_cont == null) {
      _cont = null;
    }
    ref = _els.reverse();
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      el = ref[j];
      results.push(this.storeElement(el, _cont));
    }
    return results;
  };

  BannerCanvas.prototype.storeElement = function(_el, _cont) {
    var nCont, obj;
    if (_cont == null) {
      _cont = null;
    }
    if ($(_el).children().length > 0) {
      nCont = new createjs.Container().set();
      nCont.x = Number($(_el).css("left").replace("px", ""));
      nCont.y = Number($(_el).css("top").replace("px", ""));
      nCont.alpha = Number($(_el).css("opacity").replace("px", ""));
      this.els[$(_el).attr("id")] = nCont;
      this.OG[$(_el).attr("id")] = nCont.clone;
      this.stage.addChild(nCont);
      return this.storeElements($(_el).children().toArray(), nCont);
    } else {
      if ($(_el).is("img")) {
        obj = new createjs.Bitmap($(_el).attr("src"));
      } else {
        console.log($(_el).attr("id"));
        obj = new createjs.Shape;
        obj.width = Number($(_el).css("width").replace("px", ""));
        obj.height = Number($(_el).css("height").replace("px", ""));
        obj.graphics.beginFill("rgba(255,0,0,0)");
        obj.graphics.drawRect(0, 0, Number($(_el).css("width").replace("px", "")), Number($(_el).css("height").replace("px", "")));
      }
      obj.name = $(_el).attr("id");
      obj.x = Number($(_el).css("left").replace("px", ""));
      obj.y = Number($(_el).css("top").replace("px", ""));
      obj.alpha = Number($(_el).css("opacity").replace("px", ""));
      this.els[$(_el).attr("id")] = obj;
      this.OG[$(_el).attr("id")] = obj.clone;
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
    this.ctaOut = bind(this.ctaOut, this);
    this.ctaOver = bind(this.ctaOver, this);
    this.preLoop = bind(this.preLoop, this);
    this.finish = bind(this.finish, this);
    this.phase3 = bind(this.phase3, this);
    this.phase2 = bind(this.phase2, this);
    this.phase1 = bind(this.phase1, this);
    this.setup = bind(this.setup, this);
    this.init = bind(this.init, this);
    return Test_728x90.__super__.constructor.apply(this, arguments);
  }

  Test_728x90.prototype.init = function() {
    this.clubSpeed = 0.4;
    this.els["blur_club"].filters = [new createjs.BlurFilter(24, 24, 2)];
    this.setup();
    return this.phase1();
  };

  Test_728x90.prototype.setup = function() {
    var i, j;
    console.log("setup");
    TweenMax.set(this.els["cta"], {
      x: this.OG["cta"].x - 50
    });
    TweenMax.set(this.els["boeing"], {
      x: this.OG["boeing"].x - 30
    });
    TweenMax.set(this.els["blur_club"], {
      x: this.OG["blur_club"].x - 50,
      alpha: 1
    });
    for (i = j = 3; j >= 1; i = --j) {
      TweenMax.set(this.els["txt_" + i], {
        x: 0,
        alpha: 1,
        scale: 0.9
      });
      TweenMax.set(this.els["scene_" + i], {
        x: 0,
        alpha: 1
      });
      this.els["scene_" + i + "_mask"].cache(0, 0, this.els["scene_" + i + "_mask"].width, this.els["scene_" + i + "_mask"].height);
      this.els["scene_" + i].cache(0, 0, this.els["scene_" + i + "_mask"].width, this.els["scene_" + i + "_mask"].height);
      this.els["scene_" + i].mask = this.els["scene_" + i + "_mask"];
      TweenMax.set(this.els["scene_" + i + "_mask"], {
        x: 0,
        width: this.OG["scene_" + i + "_mask"].width,
        alpha: 1
      });
    }
    return TweenMax.set(this.els["club"], {
      x: this.OG["club"].x - 50,
      alpha: 1
    });
  };

  Test_728x90.prototype.phase1 = function() {
    console.log("phase1");
    TweenMax.set(this.els["blur_club"], {
      x: 0
    });
    TweenMax.to(this.els["txt_1"], 1, {
      x: 0,
      delay: 0.1,
      scale: 1
    });
    TweenMax.to(this.els["scene_1_mask"], this.clubSpeed - 0.1, {
      width: this.width,
      delay: 0.1,
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["blur_club"], this.clubSpeed, {
      x: (this.width * 2) + 50,
      ease: "Linear.easeNone"
    });
    return this.switchFunc(this.phase2, 2.5);
  };

  Test_728x90.prototype.phase2 = function() {
    TweenMax.set(this.els["txt_3"], {
      alpha: 1
    });
    TweenMax.set(this.els["scene_3"], {
      x: 0,
      width: "0px",
      alpha: 1
    });
    TweenMax.set(this.els["club"], {
      x: 200,
      alpha: 1
    });
    TweenMax.set(this.els["blur_club"], {
      x: 0
    });
    TweenMax.to(this.els["txt_1"], this.clubSpeed, {
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["scene_1_mask"], this.clubSpeed, {
      x: this.width,
      width: 0,
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["txt_2"], 1, {
      x: 0,
      delay: 0.1,
      scale: 1
    });
    TweenMax.to(this.els["scene_2_mask"], this.clubSpeed - 0.1, {
      width: this.width,
      delay: 0.1,
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["boeing"], 0.6, {
      x: 0,
      alpha: 1,
      delay: 0.1
    });
    TweenMax.to(this.els["blur_club"], this.clubSpeed, {
      x: (this.width * 2) + 50,
      ease: "Linear.easeNone"
    });
    return this.switchFunc(this.phase3, 2.5);
  };

  Test_728x90.prototype.phase3 = function() {
    TweenMax.set(this.els["blur_club"], {
      x: 0
    });
    TweenMax.to(this.els["txt_2"], this.clubSpeed, {
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["scene_2_mask"], this.clubSpeed, {
      x: this.width,
      width: 0,
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["txt_3"], 0.5, {
      x: 0,
      delay: 0.3
    });
    TweenMax.to(this.els["scene_3_mask"], this.clubSpeed - 0.1, {
      width: this.width,
      delay: 0.1,
      ease: "Linear.easeNone"
    });
    TweenMax.to(this.els["club"], 0.5, {
      x: this.OG["club"].x,
      delay: 0.2
    });
    TweenMax.to(this.els["cta"], 0.5, {
      x: this.OG["cta"].x,
      alpha: 1,
      delay: 1
    });
    this.els["cta"].addEventListener("mouseover", this.ctaOver);
    this.els["cta"].addEventListener("mouseout", this.ctaOut);
    TweenMax.to(this.els["blur_club"], this.clubSpeed, {
      x: (this.width * 2) + 50,
      ease: "Linear.easeNone"
    });
    return this.switchFunc(this.finish, 3.5);
  };

  Test_728x90.prototype.finish = function() {
    if (this.curLoop === this.loop) {
      return this.end(this.init);
    } else {
      TweenMax.to(this.els["boeing"], 0.3, {
        alpha: 0,
        x: 20
      });
      return TweenMax.to(this.els["cta"], 0.3, {
        alpha: 0,
        x: 20,
        onComplete: (function(_this) {
          return function() {
            return _this.end(_this.preLoop, 0, ["txt_3", "scene_3", "club"]);
          };
        })(this)
      });
    }
  };

  Test_728x90.prototype.preLoop = function() {
    this.setup();
    console.log("postsetup");
    this.els["cta"].removeEventListener("mouseover", this.ctaOver);
    this.els["cta"].removeEventListener("mouseout", this.ctaOut);
    TweenMax.set(this.els["txt_3"], {
      x: this.OG["txt_3"].x
    });
    TweenMax.set(this.els["scene_3"], {
      width: this.width
    });
    TweenMax.set(this.els["club"], {
      x: this.OG["club"].x
    });
    TweenMax.to(this.els["txt_3"], this.clubSpeed, {});
    TweenMax.to(this.els["club"], this.clubSpeed, {
      x: -this.width
    });
    TweenMax.to(this.els["scene_3"], this.clubSpeed, {
      x: this.width,
      width: 0
    });
    return this.phase1();
  };

  Test_728x90.prototype.ctaOver = function() {
    return TweenMax.to(this.els["cta"], 0.2, {
      x: 3
    });
  };

  Test_728x90.prototype.ctaOut = function() {
    return TweenMax.to(this.els["cta"], 0.2, {
      x: 0
    });
  };

  return Test_728x90;

})(BannerCanvas);

banner = "";

$(document).ready(function() {
  return banner = new Test_728x90(728, 90, "in-page", 3);
});
