(function (window,$){
	var initial = {
		itemsClass: '.waterfall-item',
		itemsAnimate: true,
		fallEndCallback: function(){}
	}
	$.fn.waterfall = function (options){
		var setting = $.extend({}, initial, options),
			self = this, //.waterfall-container
			item = self.find(setting.itemsClass),
			itemW,
			selfW,
			colNum,
			firstRow = [],
			imgLoad = 0,
			imgLoadWT = 100,
			WF = $.fn.waterfall;

		WF._initDomStyle = function(){
			self.css({'position':'relative','margin':'0 auto'})
			item.css({'position':'absolute'})
			if(setting.itemsAnimate){
				item.css({
					'transition-property':'top,left',
					'transition-duration':'400ms',
					'transition-timing-function':'ease-out'
				})
			}
			//get items width
			itemW = parseInt(item.css('width'))
			return this;
		}

		WF._setContainerWidth = function(){
			self.width('auto')
			selfW = self.width();
			colNum = Math.floor(selfW / itemW);
			self.width(colNum * itemW);

			return this;
		}
		WF._imgLoadIng = function(){
			item.each(function(k,v){
				var thisImg = $(this).find('img'),
					_NIMG = new Image();
				_NIMG.src = thisImg.attr('src')
				if(_NIMG.complete){
					imgLoad ++;
					return;
				}
				thisImg.on('load',function(){
					imgLoad ++
				})
			})

			return this;
		}
		WF._checkImgloadstatus = function(){
			var arg = arguments;
			WF._setItemPosition()
			if(imgLoad < item.length && imgLoadWT < 3000){
				setTimeout(function(){
					// console.log('wait time: '+ imgLoadWT +'ms')
					imgLoadWT +=100
					arg.callee()
				},imgLoadWT)
			}else if(imgLoad === item.length){
				WF._setItemPosition()
			}else{
				WF._setItemPosition()
				console.error('waterfall_ERR: ' + (item.length - imgLoad) + '_TIMED_OUT')
			}

			return this;
		}
		WF._setItemPosition = function(){
			firstRow = [] //clear Array;
			item.each(function(k,v){
				if(k < colNum){
					firstRow.push(parseInt($(this).css('height')))
					$(this).css({
						'top': 0,
						'left': k * itemW,
						'position': 'absolute'
					})
				}else{
					var minH = findArrayMaximin('min',firstRow),
						minkey = findArraykey(minH,firstRow)
					$(this).css({
						'top': minH,
						'left': itemW * minkey,
						'position': 'absolute'
					})
					firstRow[minkey] += parseInt($(this).css('height'))
				}
			})
			this._setContainerHeight();
			setting.fallEndCallback();
			return this;
		}

		WF._setContainerHeight = function(){
			var maxH = findArrayMaximin('max',firstRow);
			self.height(maxH);

			return this;
		}

		WF._bindEvent = function(){
			var tremble = true;
			$(window).on('resize',function(){
				if(tremble){
					WF
					._setContainerWidth()
					._setItemPosition()
					tremble = false;
					setTimeout(function(){
						tremble = true;
					},600)
				}
			})

			return this;
		}

		if($(this).length){
            init();
        }
        function init(){
        	WF
        	._initDomStyle()
        	._setContainerWidth()
        	._imgLoadIng()
        	._checkImgloadstatus()
        	._bindEvent()
        }
        function findArrayMaximin(maximin,array){
        	if(maximin=="max"){ 
				return Math.max.apply(Math,array);
			}else if(maximin=="min") {
				return Math.min.apply(Math, array);
			}

        }
        function findArraykey(value,array){
        	for(var i = 0;i<array.length;i++){
        		if(array[i] === value){
		        	return i;
        		}
        	}
        }
	}
})(window,window.jQuery)