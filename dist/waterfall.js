(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.waterfall = factory());
}(this, (function () { 'use strict';

  var Settings = {
    containerClass: '',
    container: '',
    items: [],
    itemsClass: '.waterfall-item',
    itemsAnimate: true,
    fallEndCallback: function () {}
  };

  function Waterfall(element, opts) {
    return (this instanceof Waterfall)
      ? this.init(element, opts)
      : new Waterfall(element, opts);
  }

  Waterfall.prototype.init = function(element, opts) {
    this.imgLoad = 0;
    this.imgLoadWT = 100;
    this.itemWidth = 0;
    this.containerWidth = 0;
    this.firstRow = [];

    if (typeof element !== 'string') {
      opts = element;
      element = undefined;
    }
    this.configure(opts);
    console.log(Settings);
    if (element) {
      Settings['container'] = document.querySelector(element);
    } else if (!Settings['container'] && Settings['containerClass']) {
      Settings['container'] = document.querySelector(Settings['containerClass']);
    }
    if (!Settings['items'].length) {
      Settings['items'] = document.querySelectorAll(Settings['itemsClass']);
    }
    this.initDomStyle()
      .setContainerWidth()
      .imgLoadIng()
      .checkImgloadstatus()
      .bindEvent();
    return this

  };

  Waterfall.prototype.configure = function(opts) {
    var key, value;
    for (key in opts) {
      value = opts[key];
      if (value !== undefined && opts.hasOwnProperty(key)) { Settings[key] = value; }
    }
    return this
  };

  Waterfall.prototype.initDomStyle = function(){
    Settings.container.style.position = 'relative';
    Settings.container.style.margin = '0 auto';
    Settings.items.forEach(function (v) {
      v.style.position = 'absolute';
      if (Settings.itemsAnimate) {
        v.setAttribute('style', v.getAttribute('style') + "\n        transition-property: top, left;\n        transition-duration: 400ms;\n        transition-timing-function: ease-out"
        );
      }
    });
    //get items width
    this.itemWidth = Settings.items[0].offsetWidth;
    return this
  };

  Waterfall.prototype.setContainerWidth = function() {
    Settings.container.style.width = 'auto';
    this.containerWidth = Settings.container.offsetWidth;
    this.colNum = Math.floor(this.containerWidth / this.itemWidth);
    Settings.container.style.width = this.colNum * this.itemWidth + 'px';

    return this
  };

  Waterfall.prototype.imgLoadIng = function() {
    var this$1 = this;

    Settings.items.forEach(function (v) {
      var img = v.getElementsByTagName('img')[0];
      var _NIMG = new Image();
      _NIMG.src = img.getAttribute('src');
      if (_NIMG.complete) {
        this$1.imgLoad ++;
        return
      }
      img.onload = function () {
        this$1.imgLoad ++;
      };
    });

    return this
  };

  Waterfall.prototype.checkImgloadstatus = function() {
    var this$1 = this;

    // var arg = arguments
    this._setItemPosition();
    if (this.imgLoad < Settings.items.length && this.imgLoadWT < 3000) {
      setTimeout(function () {
        // console.log('wait time: '+ imgLoadWT +'ms')
        this$1.imgLoadWT += 100;
        // arg.callee()
        this$1.checkImgloadstatus();
      }, this.imgLoadWT);
    } else if (this.imgLoad === Settings.items.length) {
      this._setItemPosition();
    }else {
      this._setItemPosition();
      console.error('waterfall_ERR: ' + (Settings.items.length - this.imgLoad) + '_TIMED_OUT');
    }

    return this
  };

  Waterfall.prototype._setItemPosition = function() {
      var this$1 = this;

      this.firstRow = []; // clear Array;
      Settings.items.forEach(function (v, k) {
        if (k < this$1.colNum) {
          this$1.firstRow.push(parseInt(v.offsetHeight));
          v.style.top = 0;
          v.style.left = k * this$1.itemWidth + 'px';
          v.style.position = 'absolute';
        } else {
          var minH = findArrayMaximin('min', this$1.firstRow);
          var minkey = findArraykey(minH, this$1.firstRow);
          v.style.top = minH + 'px';
          v.style.left = this$1.itemWidth * minkey + 'px';
          v.style.position = 'absolute';
          this$1.firstRow[minkey] += parseInt(v.offsetHeight);
        }
      });
      this._setContainerHeight();
      Settings.fallEndCallback();
      return this
  };

  Waterfall.prototype._setContainerHeight = function() {
    var maxH = findArrayMaximin('max', this.firstRow);
    Settings.container.height = maxH + 'px';
    return this
  };

  Waterfall.prototype.bindEvent = function() {
    var this$1 = this;

    var tremble = true;
    window.onresize = function () {
      if (tremble) {
        this$1
          .setContainerWidth()
          ._setItemPosition();
        tremble = false;
        setTimeout(function () {
          tremble = true;
        }, 600);
      }
    };

    return this
  };

  function findArrayMaximin(maximin,array){
      if(maximin == "max") { 
          return Math.max.apply(Math,array)
      }else if(maximin == "min") {
          return Math.min.apply(Math, array)
      }

  }
  function findArraykey(value,array){
      for(var i = 0;i<array.length;i++){
          if(array[i] === value){
              return i;
          }
      }
  }

  return Waterfall;

})));
