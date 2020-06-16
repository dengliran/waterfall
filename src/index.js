
let Settings = {
  containerClass: '',
  container: '',
  items: [],
  itemsClass: '.waterfall-item',
  itemsAnimate: true,
  fallEndCallback: () => {}
}

function Waterfall(element, opts) {
  return (this instanceof Waterfall)
    ? this.init(element, opts)
    : new Waterfall(element, opts);
}

Waterfall.prototype.init = function(element, opts) {
  this.imgLoad = 0
  this.imgLoadWT = 100
  this.itemWidth = 0
  this.containerWidth = 0
  this.firstRow = []

  if (typeof element !== 'string') {
    opts = element
    element = undefined
  }
  this.configure(opts)
  if (element) {
    Settings['container'] = document.querySelector(element)
  } else if (!Settings['container'] && Settings['containerClass']) {
    Settings['container'] = document.querySelector(Settings['containerClass'])
  }
  if (!Settings['items'].length) {
    Settings['items'] = document.querySelectorAll(Settings['itemsClass'])
  }
  this.initDomStyle()
    .setContainerWidth()
    .imgLoadIng()
    .checkImgloadstatus()
    .bindEvent()
  return this

}

Waterfall.prototype.configure = function(opts) {
  var key, value
  for (key in opts) {
    value = opts[key]
    if (value !== undefined && opts.hasOwnProperty(key)) Settings[key] = value
  }
  return this
}

Waterfall.prototype.initDomStyle = function(){
  Settings.container.style.position = 'relative'
  Settings.container.style.margin = '0 auto'
  Settings.items.forEach(v => {
    v.style.position = 'absolute'
    if (Settings.itemsAnimate) {
      v.setAttribute('style', v.getAttribute('style') + `
        transition-property: top, left;
        transition-duration: 400ms;
        transition-timing-function: ease-out`
      )
    }
  })
  //get items width
  this.itemWidth = Settings.items[0].offsetWidth
  return this
}

Waterfall.prototype.setContainerWidth = function() {
  Settings.container.style.width = 'auto'
  this.containerWidth = Settings.container.offsetWidth
  this.colNum = Math.floor(this.containerWidth / this.itemWidth)
  Settings.container.style.width = this.colNum * this.itemWidth + 'px'

  return this
}

Waterfall.prototype.imgLoadIng = function() {
  Settings.items.forEach(v => {
    let img = v.getElementsByTagName('img')[0]
    let _NIMG = new Image()
    _NIMG.src = img.getAttribute('src')
    if (_NIMG.complete) {
      this.imgLoad ++
      return
    }
    img.onload = () => {
      this.imgLoad ++
    }
  })

  return this
}

Waterfall.prototype.checkImgloadstatus = function() {
  // var arg = arguments
  this._setItemPosition()
  if (this.imgLoad < Settings.items.length && this.imgLoadWT < 3000) {
    setTimeout(() => {
      // console.log('wait time: '+ imgLoadWT +'ms')
      this.imgLoadWT += 100
      // arg.callee()
      this.checkImgloadstatus()
    }, this.imgLoadWT)
  } else if (this.imgLoad === Settings.items.length) {
    this._setItemPosition()
  }else{
    this._setItemPosition()
    console.error('waterfall_ERR: ' + (Settings.items.length - this.imgLoad) + '_TIMED_OUT')
  }

  return this
}

Waterfall.prototype._setItemPosition = function() {
    this.firstRow = [] // clear Array;
    Settings.items.forEach((v, k) => {
      if (k < this.colNum) {
        this.firstRow.push(parseInt(v.offsetHeight))
        v.style.top = 0
        v.style.left = k * this.itemWidth + 'px'
        v.style.position = 'absolute'
      } else {
        let minH = findArrayMaximin('min', this.firstRow)
        let minkey = findArraykey(minH, this.firstRow)
        v.style.top = minH + 'px'
        v.style.left = this.itemWidth * minkey + 'px'
        v.style.position = 'absolute'
        this.firstRow[minkey] += parseInt(v.offsetHeight)
      }
    })
    this._setContainerHeight()
    Settings.fallEndCallback()
    return this
}

Waterfall.prototype._setContainerHeight = function() {
  let maxH = findArrayMaximin('max', this.firstRow)
  Settings.container.height = maxH + 'px'
  return this
}

Waterfall.prototype.bindEvent = function() {
  let tremble = true
  window.onresize = () => {
    if (tremble) {
      this
        .setContainerWidth()
        ._setItemPosition()
      tremble = false
      setTimeout(() => {
        tremble = true
      }, 600)
    }
  }

  return this
}

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


export default Waterfall
