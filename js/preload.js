//图片预加载
(function($) {

	function PreLoad(imgs, options) {
		this.imgs = (typeof imgs === 'string') ? [imgs] : imgs; //如果传过来的imgs是一个字符串，则自动将它包成一个数组，否则返回这个传过来的数组
		this.opts = $.extend({}, PreLoad.DEFAULTS, options); //将PreLoad.DEFAULTS和options融合一下，生成一个新的对象放在{}里面，即将后一个覆盖前一个，生成一个新对象，然后将这个新对象返回给opts属性保存下来

		if (this.opts.order === 'ordered'){
			this._ordered();
		}else{
			this._unordered();
		}
	}
	PreLoad.DEFAULTS = {
		order:'unordered',	//无序加载
		each: null, //每一张图片加载完毕后执行这个方法
		all: null //所有图片加载完毕后执行这个方法
	};
	
	//有序加载
	PreLoad.prototype._ordered = function(){
		var opts = this.opts,
			imgs = this.imgs,
			len = imgs.length,
			count = 0;
			
			load();
			
			//有序预加载
			function load(){
				var imgObj = new Image();
				$(imgObj).on('load error',function(){
					opts.each &&opts.each(count);
					
					if (count >= len) {
						//所有图片已经加载完毕
						opts.all && opts.all();
					} else{
						load();
					}
					
					count++;
				});
				imgObj.src = imgs[count];
			}
	},

	//无序加载
	PreLoad.prototype._unordered = function() { //将它写在原型上，保证实例化的时候都可以使它保持一份
		var imgs = this.imgs,
			opts = this.opts,
			count = 0,
			len = imgs.length;

		$.each(imgs, function(i, src) {
			if(typeof src != 'string') return;

			var imgObj = new Image();

			$(imgObj).on('load error', function() {
				opts.each && opts.each(count);
				//					$progress.html(Math.round((count+1)/len *100)+'%')

				if(count >= len - 1) {
					opts.all && opts.all();
					//					$('.loading').hide();
					//					document.title = '1/' + len;
				}
				count++;
			});
			imgObj.src = src;
		});
	};

	//		$.fn.extend -> $('#img').preload() //调用方式1：先选择一个元素之后，再调用
	//		$.fn.extend -> $.preload();	//调用方式2：直接跟在JQuery对象上面，它的调用形式就是一个工具函数

	$.extend({
		preload: function(imgs, opts) {
			new PreLoad(imgs, opts);
		}
	});

})(jQuery); //使用闭包来模拟局部作用域