var Banner, Banner728x90, banner,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Banner = (function() {
  function Banner(_width, _height, _loop) {
    if (_width == null) {
      _width = 0;
    }
    if (_height == null) {
      _height = 0;
    }
    if (_loop == null) {
      _loop = 3;
    }
    this.switchFunc = bind(this.switchFunc, this);
    this.replay = bind(this.replay, this);
    this.exit = bind(this.exit, this);
    this.end = bind(this.end, this);
    this.init = bind(this.init, this);
    this.checkVisible = bind(this.checkVisible, this);
    this.enablerInitHandler = bind(this.enablerInitHandler, this);
    this.width = _width;
    this.height = _height;
    this.loop = _loop;
    this.curLoop = 1;
    this.els = $("#main").find(".ani-elem");
    $("overlay").bind("click", this.exit);
    if (Enabler.isInitialized()) {
      Banner.enablerInitHandler();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.INIT, this.enablerInitHandler);
    }
  }

  Banner.prototype.enablerInitHandler = function(e) {
    console.log(e);
    if (Enabler.isPageLoaded()) {
      return Banner.checkVisible();
    } else {
      return Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this.checkVisible);
    }
  };

  Banner.prototype.checkVisible = function(e) {
    if (Enabler.isVisible()) {
      return Banner.init();
    } else {
      return Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, this.init);
    }
  };

  Banner.prototype.init = function(e) {
    return alert("you must add an init function to the extended coffeescript class");
  };

  Banner.prototype.end = function(_func, _dur) {
    if (this.curLoop === this.loop) {
      return clearInterval(this.switchInt);
    } else {
      this.curLoop++;
      return this.replay(_func, _dur);
    }
  };

  Banner.prototype.exit = function(e) {
    var _exit;
    if (this.switchInt) {
      clearInterval(this.switchInt);
    }
    return Enabler.exit(_exit = "exit");
  };

  Banner.prototype.replay = function(_func, _dur) {
    var el, i, len, ref;
    ref = this.els;
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      $(el)[0].removeAttribute("style");
    }
    return this.switchFunc(_func, _dur);
  };

  Banner.prototype.switchFunc = function(_func, _dur) {
    if (_dur == null) {
      _dur = 0;
    }
    if (this.switchInt) {
      clearInterval(this.switchInt);
    }
    return this.switchInt = setInterval(_func, _dur * 1000);
  };

  return Banner;

})();

Banner728x90 = (function(superClass) {
  extend(Banner728x90, superClass);

  function Banner728x90() {
    this.finish = bind(this.finish, this);
    this.phase5 = bind(this.phase5, this);
    this.phase4 = bind(this.phase4, this);
    this.phase3 = bind(this.phase3, this);
    this.phase2 = bind(this.phase2, this);
    this.phase1 = bind(this.phase1, this);
    this.init = bind(this.init, this);
    return Banner728x90.__super__.constructor.apply(this, arguments);
  }

  Banner728x90.prototype.init = function() {
    var el, i, len, ref;
    console.log("init");
    TweenMax.set($("#words"), {
      opacity: 2
    });
    ref = this.els;
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      TweenMax.set($(el), {
        transformPerspective: 200,
        opacity: 0,
        rotationX: 90,
        y: 0 - ($(el).height() / 2)
      });
    }
    return this.phase1();
  };

  Banner728x90.prototype.phase1 = function() {
    console.log("phase1");
    TweenMax.to($("#clean"), 0.3, {
      rotationX: 0,
      opacity: 1,
      y: 0,
      ease: Back.easeOut
    });
    return this.switchFunc(this.phase2, 1.5);
  };

  Banner728x90.prototype.phase2 = function() {
    console.log("phase2");
    TweenMax.to($("#clean"), 0.3, {
      rotationX: -90,
      opacity: 0,
      y: $("#clean").height() / 2,
      ease: Back.easeIn
    });
    TweenMax.to($("#friendly"), 0.3, {
      rotationX: 0,
      opacity: 1,
      y: 0,
      ease: Back.easeOut,
      delay: 0.3
    });
    return this.switchFunc(this.phase3, 1.5);
  };

  Banner728x90.prototype.phase3 = function() {
    console.log("phase2");
    TweenMax.to($("#friendly"), 0.3, {
      rotationX: -90,
      opacity: 0,
      y: $("#friendly").height() / 2,
      ease: Back.easeIn
    });
    TweenMax.to($("#fun"), 0.3, {
      rotationX: 0,
      opacity: 1,
      y: 0,
      ease: Back.easeOut,
      delay: 0.3
    });
    return this.switchFunc(this.phase4, 1.5);
  };

  Banner728x90.prototype.phase4 = function() {
    console.log("phase2");
    TweenMax.to($("#fun"), 0.3, {
      rotationX: -90,
      opacity: 0,
      y: $("#fun").height() / 2,
      ease: Back.easeIn
    });
    TweenMax.to($("#price"), 0.3, {
      rotationX: 0,
      opacity: 1,
      y: 0,
      ease: Back.easeOut,
      delay: 0.3
    });
    return this.switchFunc(this.phase5, 1.5);
  };

  Banner728x90.prototype.phase5 = function() {
    console.log("phase2");
    TweenMax.to($("#price"), 0.3, {
      rotationX: -90,
      opacity: 0,
      y: $("#price").height() / 2,
      ease: Back.easeIn
    });
    TweenMax.to($("#start"), 0.3, {
      rotationX: 0,
      opacity: 1,
      y: 0,
      ease: Back.easeOut,
      delay: 0.3
    });
    return this.switchFunc(this.finish, 3);
  };

  Banner728x90.prototype.finish = function() {
    console.log("end");
    if (this.curLoop === this.loop) {
      return this.end(this.init);
    } else {
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

  return Banner728x90;

})(Banner);

banner = "";

$(document).ready(function() {
  return banner = new Banner728x90(728, 90, 3);
});
