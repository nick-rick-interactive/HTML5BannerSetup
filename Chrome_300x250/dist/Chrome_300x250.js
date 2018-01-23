var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BannerCanvas = (function () {
    function BannerCanvas(_width, _height, _type, _loop) {
        if (_width === void 0) { _width = 0; }
        if (_height === void 0) { _height = 0; }
        if (_type === void 0) { _type = "in-page"; }
        if (_loop === void 0) { _loop = 3; }
        var _this = this;
        this.loadImages = function () {
            for (var img in _this.imgLoads) {
                $(_this.imgLoads[img].el.image).bind("load", _this.checkLoad);
                _this.imgLoads[img].el.image.src = _this.imgLoads[img].src;
            }
        };
        this.checkLoad = function () {
            _this.imgsLoaded++;
            if (_this.imgsLoaded == _this.imgLoads.length) {
                for (var img in _this.imgLoads) {
                    _this.imgLoads[img].el.cache(0, 0, _this.imgLoads[img].el.getBounds().width, _this.imgLoads[img].el.getBounds().height);
                }
            }
            if (Enabler.isInitialized()) {
                _this.enablerInitHandler(null);
            }
            else {
                Enabler.addEventListener(studio.events.StudioEvent.INIT, _this.enablerInitHandler);
            }
        };
        this.enablerInitHandler = function (e) {
            if (Enabler.isPageLoaded()) {
                _this.checkVisible(null);
            }
            else {
                Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, _this.checkVisible);
            }
            if (e) {
                console.log(e);
            }
        };
        this.checkVisible = function (e) {
            if (Enabler.isVisible()) {
                _this.init(null);
            }
            else {
                Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, _this.init);
            }
            if (e) {
                console.log(e);
            }
        };
        this.init = function (e) {
            alert("you must add an init function to the extended type-script class");
            if (e) {
                console.log(e);
            }
        };
        this.expandInit = function () {
            alert("you must add an expand init function to the extended type-script class");
        };
        this.closeInit = function () {
            alert("you must add an close init function to the extended coffeescript class");
        };
        this.expandStartHandler = function () {
            Enabler.finishExpand();
        };
        this.expandFinishHandler = function () {
            _this.isExpanded = true;
            _this.expandInit();
        };
        this.collapseStartHandler = function () {
            Enabler.finishCollapse();
        };
        this.collapseFinishHandler = function () {
            _this.isCollapsed = true;
        };
        this.end = function (_func, _dur, _excludeStyleRemovalList) {
            if (_dur === void 0) { _dur = 0; }
            if (_excludeStyleRemovalList === void 0) { _excludeStyleRemovalList = []; }
            if (_this.curLoop == _this.loop) {
                clearInterval(_this.switchInt);
            }
            else {
                _this.curLoop++;
                _this.replay(_func, _dur, _excludeStyleRemovalList);
            }
        };
        this.exit = function () {
            if (_this.switchInt) {
                clearInterval(_this.switchInt);
            }
            Enabler.exit("exit");
        };
        this.replay = function (_func, _dur, _excludeStyleRemovalList) {
            if (_dur === void 0) { _dur = 0; }
            if (_excludeStyleRemovalList === void 0) { _excludeStyleRemovalList = []; }
            for (var el in _this.els) {
                if ($.inArray($(_this.els[el]).attr("id"), _excludeStyleRemovalList) > -1) {
                    $(_this.els[el]).removeAttr("style");
                }
            }
            _this.switchFunc(_func, _dur);
        };
        this.storeElements = function (_els, _cont) {
            if (_cont === void 0) { _cont = null; }
            for (var el in _els.reverse()) {
                _this.storeElement(_els[el], _cont);
            }
        };
        this.storeElement = function (_el, _cont) {
            if (_cont === void 0) { _cont = null; }
            var nCont;
            var obj;
            if ($(_el).children().length > 0) {
                nCont = new createjs.Container();
                nCont.name = $(_el).attr("id");
                nCont.x = Number($(_el).css("left").replace("px", ""));
                nCont.y = Number($(_el).css("top").replace("px", ""));
                nCont.alpha = Number($(_el).css("opacity").replace("px", ""));
                _this.els[$(_el).attr("id")] = nCont;
                _this.OG[$(_el).attr("id")] = nCont.clone;
                _this.stage.addChild(nCont);
                _this.storeElements($(_el).children().toArray(), nCont);
                nCont.set(0);
            }
            else {
                if ($(_el).is("img")) {
                    obj = new createjs.Bitmap("");
                    $(_el).attr("src");
                    var imgLoad = {
                        el: obj,
                        src: $(_el).attr("src")
                    };
                    _this.imgLoads.push(imgLoad);
                }
                else {
                    obj = new createjs.Shape();
                    obj.graphics.beginFill("rgba(255,0,0,0)");
                    obj.graphics.drawRect(0, 0, Number($(_el).css("width").replace("px", "")), Number($(_el).css("height").replace("px", "")));
                }
                obj.name = $(_el).attr("id");
                obj.x = Number($(_el).css("left").replace("px", ""));
                obj.y = Number($(_el).css("top").replace("px", ""));
                obj.alpha = Number($(_el).css("opacity").replace("px", ""));
                _this.els[$(_el).attr("id")] = obj;
                _this.OG[$(_el).attr("id")] = obj.clone;
                if (_cont) {
                    _cont.addChild(obj);
                }
                else {
                    _this.stage.addChild(obj);
                }
            }
        };
        this.toggleExpand = function () {
            _this.isExpanded = (_this.isExpanded) ? Enabler.requestCollapse() : Enabler.requestExpand();
        };
        this.close = function () {
            Enabler.reportManualClose();
            Enabler.close();
            _this.closeInit();
        };
        this.autoClose = function () {
            if (_this.autoTimer) {
                clearInterval(_this.autoTimer);
            }
            Enabler.close();
            _this.closeInit();
        };
        this.switchFunc = function (_func, _dur) {
            if (_dur === void 0) { _dur = 0; }
            if (_this.switchInt) {
                clearInterval(_this.switchInt);
            }
            _this.switchInt = setInterval(_func, _dur * 1000);
        };
        this.addCounter = function (_el, _text) {
            $(_el).click(function () {
                Enabler.counter(_text);
            });
        };
        this.centerReg = function (_el) {
            _el.regX = _el.getBounds().width / 2;
            _el.regY = _el.getBounds().height / 2;
        };
        this.rightReg = function (_el) {
            _el.regX = _el.getBounds().width;
        };
        this.width = _width;
        this.height = _height;
        this.type = _type;
        this.loop = _loop;
        this.curLoop = 1;
        this.imgLoads = [];
        this.imgsLoaded = 0;
        this.canvas = document.getElementById('main');
        this.stage = new createjs.Stage(this.canvas);
        this.els = {};
        this.OG = {};
        this.storeElements($("#elements").children().toArray());
        if (TweenMax) {
            TweenMax.ticker.addEventListener("tick", this.stage.update, this.stage);
        }
        else {
            TweenLite.ticker.addEventListener("tick", this.stage.update, this.stage);
        }
        $("#main-container").bind("click", this.exit);
        this.stage.update();
        this.els['overlay'].cursor = "pointer";
        this.els['overlay'].enableMouseOver = true;
        this.els['ctacont'].cursor = "pointer";
        this.els['ctacont'].enableMouseOver = true;
        if (this.type != "in-page") {
            Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, this.expandStartHandler);
            Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, this.expandFinishHandler);
            Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, this.collapseStartHandler);
            Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, this.collapseFinishHandler);
        }
        this.loadImages();
    }
    ;
    return BannerCanvas;
}());
var Chrome_300x250 = (function (_super) {
    __extends(Chrome_300x250, _super);
    function Chrome_300x250(_width, _height, _type, _loop) {
        if (_width === void 0) { _width = 0; }
        if (_height === void 0) { _height = 0; }
        if (_type === void 0) { _type = "in-page"; }
        if (_loop === void 0) { _loop = 3; }
        var _this = _super.call(this, _width, _height, _type, _loop) || this;
        _this.init = function () {
            _this.pace = 1;
            _this.origVals = {};
            _this.setup();
        };
        _this.setup = function () {
            TweenLite.set(_this.els["ball"], { alpha: 0, y: _this.height / 2, x: _this.width / 2 + 70 });
            _this.centerReg(_this.els["ball"]);
            for (var i = 1; i < 4; i++) {
                if (i < 3) {
                    TweenLite.set(_this.els["h2_" + i], { alpha: 0, y: _this.height / 2, x: _this.width / 2, scaleX: 0.95, scaleY: 0.95 });
                    _this.centerReg(_this.els["h2_" + i]);
                }
                TweenLite.set(_this.els["h" + i], { alpha: 0, y: _this.height / 2, x: _this.width / 2, scaleX: 0.95, scaleY: 0.95 });
                _this.centerReg(_this.els["h" + i]);
            }
            TweenMax.set(_this.els["cta"], { alpha: 0 });
            TweenMax.set(_this.els["chevron"], { alpha: 0, x: -5 });
            _this.phase1();
        };
        _this.phase1 = function () {
            for (var i = 1; i < 4; i++) {
                TweenMax.to(_this.els['h' + i], 1, { alpha: 1, scaleX: 1, scaleY: 1, ease: Expo.easeInOut, delay: 0.2 * i });
            }
            _this.switchFunc(_this.phase2, _this.pace + 1.5);
        };
        _this.phase2 = function () {
            for (var i = 1; i < 4; i++) {
                TweenMax.to(_this.els['h' + i], 1, { alpha: 0, scaleX: 0.9, scaleY: 0.9, ease: Expo.easeInOut, delay: 0.05 * i });
            }
            TweenMax.to(_this.els['ball'], 1, { alpha: 1, ease: Cubic.easeOut, delay: 0.75 });
            TweenMax.to(_this.els['ball'], 1, { x: _this.width / 2, ease: Expo.easeInOut, delay: 1.75 });
            _this.switchFunc(_this.phase3, _this.pace + 0.5);
        };
        _this.phase3 = function () {
            for (var i = 1; i < 3; i++) {
                TweenMax.to(_this.els['h2_' + i], 1, { alpha: 1, scaleX: 1, scaleY: 1, ease: Expo.easeInOut, delay: 0.2 * i });
            }
            TweenMax.to(_this.els['cta'], 1, { alpha: 1, ease: Cubic.easeOut, delay: 1 });
            TweenMax.to(_this.els['chevron'], 1, { alpha: 1, ease: Cubic.easeOut, delay: 1 });
            TweenMax.to(_this.els['chevron'], 1, { x: 0, ease: Cubic.easeOut, delay: 1.05 });
            _this.switchFunc(_this.phase4, _this.pace + 0.5);
        };
        _this.phase4 = function () {
            $("#main").on("mouseover", _this.overBanner);
            $("#main").on("mouseout", _this.outBanner);
            _this.switchFunc(_this.finish, _this.pace + 6);
        };
        _this.finish = function () {
            if (_this.curLoop == _this.loop) {
                _this.end(_this.setup);
            }
            else {
                TweenLite.to(_this.els["bg"], 0.3, {
                    alpha: 1, ease: Cubic.easeInOut, onComplete: function () {
                        return _this.end(_this.setup);
                    }
                });
            }
        };
        _this.overBanner = function () {
            TweenMax.to(_this.els['chevron'], 0.5, { x: -5, ease: Cubic.easeOut });
        };
        _this.outBanner = function () {
            TweenMax.to(_this.els['chevron'], 0.5, { x: 0, ease: Cubic.easeOut });
        };
        _this.shuffle = function (array) {
            var counter = array.length;
            while (counter > 0) {
                var index = Math.floor(Math.random() * counter);
                counter--;
                var temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        };
        return _this;
    }
    return Chrome_300x250;
}(BannerCanvas));
$(document).ready(function () {
    banner = new Chrome_300x250(300, 250, "in-page", 1);
});
