//色彩选择器一共由三部分组成，从左至右分别命名为：选择区、选择条、数值框
var colorSelector = function (config){
	this.width = '780' || config.width; // 色彩选择器的整体高度
	// this.height = '420' || config.height; // 色彩选择器的整体高度
	// this.gap = '30' || config.gap; // 选择区、选择条、数值框之间的间隔
	this.barBg = ['hsl(0,100%,50%)','hsl(60,100%,50%)','hsl(120,100%,50%)','hsl(180,100%,50%)','hsl(240,100%,50%)','hsl(300,100%,50%)','hsl(360,100%,50%)'] || config.barBg; //设置选择条的背景，数组格式
	this.barDotPos = '210' || config.barDotPos; //设置选择条上选择区域的初始位置

	this._init();
}

colorSelector.prototype = {
	_init:function(){
		this.height = this.width * 7 / 13;
		this.gap = this.width / 26;
		this.barWidth = this.width / 26;
		this.boxWidth = this.width * 9 / 26;
		this.element = document.getElementById('colorSelector');
		this.element.style.width = this.width+'px';
		this.element.style.height = this.height +'px';
		this.addElement();
		this.calColor(0); //初始状态
		this.calColor(0,0); //初始状态
		this.chooseDot();
		this.hslToRgb();
		this.rgbToHtml();
		this.setInput();

		this.changValue();
	},
	createElements:function(nodeName,classValue){
		var ele = document.createElement(nodeName);
		if(classValue){
			ele.className = classValue;
		}
		return ele;
	},
	//嵌入dom节点-选择区、选择条、数值框
	addElement: function(){
		var colorContent = this.createElements('div','colorContent');
		var colorConDot = this.createElements('div','colorConDot');
		var colorBar = this.createElements('div','colorBar')
		var colorBarDot = this.createElements('div','colorBarDot');
		var colorBox = this.createElements('div','colorBox');
		var colorBlock = this.createElements('div','colorBlock');
		var rgbBlock = this.createElements('div','rgbBlock');
		var hslBlock = this.createElements('div','hslBlock');
		var htmlBlock = this.createElements('div','htmlBlock');

		colorContent.appendChild(colorConDot);
		this.element.appendChild(colorContent);
		colorBar.appendChild(colorBarDot);
		this.element.appendChild(colorBar);
		var rgbArr = ['R',"G","B"];
		var hslArr = ['H',"S","L"];
		var htmlArr = ['HTML'];
		for(var i = 0; i < rgbArr.length; i++){
			var divBlock = this.createElements('div','rgb-item');
			var spanBlock = this.createElements('span');
			spanBlock.innerText = rgbArr[i];
			var inputBlock = this.createElements('input');
			inputBlock.setAttribute('type','number');
			inputBlock.style.height = this.gap + 'px';
			inputBlock.setAttribute('min','0');
			inputBlock.setAttribute('max','255');
			divBlock.appendChild(spanBlock);
			divBlock.appendChild(inputBlock);
			rgbBlock.appendChild(divBlock);
		}
		for(var i = 0; i < hslArr.length; i++){
			var divBlock = this.createElements('div','hsl-item');
			var spanBlock = this.createElements('span');
			spanBlock.innerText = hslArr[i];
			var inputBlock = this.createElements('input');
			inputBlock.setAttribute('type','number');
			if(i == 0){
				inputBlock.setAttribute('min','0');
				inputBlock.setAttribute('max','360');
			}else{
				inputBlock.setAttribute('min','0');
				inputBlock.setAttribute('max','100');
			}
			
			inputBlock.style.height = this.gap + 'px';
			divBlock.appendChild(spanBlock);
			divBlock.appendChild(inputBlock);
			hslBlock.appendChild(divBlock);
		}
		for(var i = 0; i < htmlArr.length; i++){
			var divBlock = this.createElements('div','html-item');
			var spanBlock = this.createElements('span');
			spanBlock.innerText = htmlArr[i];
			var inputBlock = this.createElements('input');
			inputBlock.setAttribute('type','text');
			inputBlock.style.height = this.gap + 'px';
			// inputBlock.setAttribute('min','0');
			// inputBlock.setAttribute('max','255');
			divBlock.appendChild(spanBlock);
			divBlock.appendChild(inputBlock);
			htmlBlock.appendChild(divBlock);
		}
		colorBox.appendChild(colorBlock);
		colorBox.appendChild(hslBlock);
		colorBox.appendChild(rgbBlock);
		colorBox.appendChild(htmlBlock);
		this.element.appendChild(colorBox);

		//colorContent 的样式
		colorContent.style.marginRight = this.gap + 'px';
		colorContent.style.width = (colorContent.currentStyle ? colorContent.currentStyle : window.getComputedStyle(colorContent, null)).height;
		//colorConDot 的样式
		var colorConDotStyle  = {
			width: this.barWidth / 3 + 'px',
			height: this.barWidth / 3 + 'px',
			border: '3px solid #333',
			borderRadius: '5px',
			position: 'relative' 
		}
		var styleStr = ''
		for (var item in colorConDotStyle){
			styleStr += item +":"+ colorConDotStyle[item]+";";
		}
		// console.log(styleStr);
		colorConDot.style.cssText = styleStr;
		// console.log(parseFloat(colorConDotStyle));

		//colorBar 的样式
		colorBar.style.width = this.barWidth + 'px';
		colorBar.style.marginRight = this.gap + 'px';
		colorBar.style.background = 'linear-gradient(to bottom,'+this.barBg.join(',')+')';
		//colorBarDot 的样式
		colorBarDot.style.width = this.barWidth / 3 + 'px';
		colorBarDot.style.height = colorBarDot.style.width;
		colorBarDot.style.border = '3px solid #333';
		colorBarDot.style.borderRadius = '50%';
		colorBarDot.style.position = 'relative';
		colorBarDot.style.margin = "0 auto";
		// colorBarDot.style.
		//colorBox 的样式
		colorBox.style.width = this.boxWidth + 'px';
		//colorBlock 的样式
		
		colorBlock.style.width = "100%";
		colorBlock.style.height = this.gap+'px';
		colorBlock.style.border = '1px solid #ddd';

	},
	chooseDot: function(){
		var that = this;
		document.getElementsByClassName('colorBar')[0].addEventListener('mousedown',function(e){
			if(e.target.className == 'colorBar' && e.button == 0){
				that.setDot('colorBarDot',e.offsetY);
				that.calColor(e.offsetY);
				var conDotTop = document.getElementsByClassName('colorConDot')[0].style.top;
				var conDotLeft = document.getElementsByClassName('colorConDot')[0].style.left;
				if(!conDotTop){
					conDotTop = 0;
				}else{
					conDotTop = parseInt(conDotTop);
				}
				if(!conDotLeft){
					conDotLeft = 0;
				}else{
					conDotLeft = parseInt(conDotLeft);
				}
				that.calColor(conDotLeft,conDotTop);
				that.hslToRgb();
				that.rgbToHtml();
				that.setInput();

			}
		});
		document.getElementsByClassName('colorContent')[0].addEventListener('mousedown',function(e){
			if(e.target.className == 'colorContent' && e.button == 0){
				that.setDot('colorConDot',e.offsetY,e.offsetX);
				that.calColor(e.offsetY,e.offsetX);
				that.hslToRgb();
				that.rgbToHtml();
				that.setInput();
			}
		})

	},
	setDot:function(className, offsetY, offsetX){
		var classNode = document.getElementsByClassName(className)[0];

		classNode.style.top = offsetY+'px';	
		if(offsetX){
			classNode.style.left = offsetX+'px';
		}
	},
	calColor:function(offsetY,offsetX){
		if(typeof(offsetX) != 'undefined'){
			var totalHeight = this.height * Math.sqrt(2);
			var curHeight = Math.sqrt(2)*(offsetX + offsetY) /2;

			var hsl_3 = parseInt(100 -(curHeight*100/totalHeight));
			this.curHsl[2] = hsl_3;
			var curHslStr = 'hsl('+this.curHsl[0]+','+this.curHsl[1]+'%,'+hsl_3+"%)";
			document.getElementsByClassName('colorBlock')[0].style.background = curHslStr;


		}else{
			var oneFieldHeight = this.height / (this.barBg.length - 1);
			var fieldIndex = Math.floor(offsetY / oneFieldHeight);
			var remainHeight = offsetY % oneFieldHeight;
	
			this.curHsl = [];
			if(fieldIndex >= 0 && fieldIndex <= this.barBg.length-1){
				var startHsl = this.barBg[fieldIndex].replace('hsl(','').replace(')','').split(',');
				var endHsl = this.barBg[fieldIndex + 1].replace('hsl(','').replace(')','').split(',');
				
				for(var i = 0; i < 3; i++){
					var sHsl = startHsl[i].replace('%','');
					var eHsl = endHsl[i].replace('%','');
					this.curHsl.push(parseInt(sHsl-((sHsl-eHsl)*remainHeight / oneFieldHeight)));
				}
			}
			this.setColorContent();
		}
	},
	setColorContent:function(){
		var hsl_12 = this.curHsl[0] + ',' +this.curHsl[1] + '%';
		var startHsl = 'hsl('+hsl_12+',100%)';
		var endHsl = 'hsl('+hsl_12+',0%)';
		var curHsl = 'hsl('+hsl_12+','+this.curHsl[2]+'%)';
		document.getElementsByClassName('colorContent')[0].style.background = 'linear-gradient(135deg,'+startHsl+','+curHsl+','+endHsl+')';
	},
	setInput:function(){
		if(this.curHsl){
			var hslInput = document.getElementsByClassName('hslBlock')[0].getElementsByTagName('input');
			for (var i = 0; i < 3; i++) {
				hslInput[i].value = this.curHsl[i];
			}
		}
		if(this.curRgb){
			var rgbInput = document.getElementsByClassName('rgbBlock')[0].getElementsByTagName('input');
			for(var r = 0; r < 3; r++) {
				rgbInput[r].value = this.curRgb[r];
			}
		}
		if(this.curHtml){
			var htmlInput = document.getElementsByClassName('htmlBlock')[0].getElementsByTagName('input')[0];
			htmlInput.value = "#"+this.curHtml.join('');
		}
	},
	//监听input框值的变化
	changValue:function(){
		//hsl值变化-响应
		var hslInputs = document.getElementsByClassName('hslBlock')[0].getElementsByTagName('input');
		var that = this;
		var newHsl = [];
		for(var i = 0; i < hslInputs.length; i++){
			hslInputs[i].addEventListener('change',function(){
				newHsl = [].slice.call(hslInputs).map(function(inputItem){
					return inputItem.value;
				});
				that.curHsl = newHsl;
				that.hslToRgb();
				that.rgbToHtml();
				that.setInput();
				document.getElementsByClassName('colorBlock')[0].style.background = 'hsl('+newHsl[0]+','+newHsl[1]+'%,'+newHsl[2]+'%)';
				that.calPos();	
			})
		}
		//rgb值变化-响应
		var rgbInputs = document.getElementsByClassName('rgbBlock')[0].getElementsByTagName('input');
		var newRgb = [];
		for(var j = 0; j < rgbInputs.length; j++){
			rgbInputs[j].addEventListener('change',function(){
				newRgb = [].slice.call(rgbInputs).map(function(inputItem){
					return inputItem.value;
				});
				that.curRgb = newRgb;
				that.rgbToHsl();
				that.rgbToHtml();
				that.setInput();
				document.getElementsByClassName('colorBlock')[0].style.background = 'rgb('+newRgb.join(',')+')';
				that.calPos();
			})
		}
		//html值变化-响应
		var htmlInput = document.getElementsByClassName('htmlBlock')[0].getElementsByTagName('input')[0];
		htmlInput.addEventListener('change',function(){
			var htmlValue = htmlInput.value.replace('#','');
			that.curHtml = [htmlValue.substring(0,2),htmlValue.substring(2,4),htmlValue.substring(4,6)];
			that.htmlToRgb();
			that.rgbToHsl();
			that.setInput();
			document.getElementsByClassName('colorBlock')[0].style.background = htmlInput.value;
			that.calPos();
		})
		
	},
	calPos:function(){
		var barTop = this.curHsl[0] * 360 / this.height;

		this.setDot('colorBarDot',barTop);

		this.setColorContent();

		var conLeft = (100 - this.curHsl[2]) * this.height / (100 * Math.sqrt(2));

		this.setDot('colorConDot',conLeft,conLeft);


	},
	/**
 	* HSL颜色值转换为RGB. 
 	* 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 	* h, s, 和 l 设定在 [0, 1] 之间
 	* 返回的 r, g, 和 b 在 [0, 255]之间
 	*
 	* @param   Number  h       色相
 	* @param   Number  s       饱和度
 	* @param   Number  l       亮度
 	* @return  Array           RGB色值数值
 	*/
	hslToRgb:function(){
		var h = this.curHsl[0]/360;
		var s = this.curHsl[1]/100;
		var l = this.curHsl[2]/100;
	    var r, g, b;
	
	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        var hue2rgb = function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }
	
	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }
	
	    this.curRgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	},
	rgbToHtml:function(){
		var r = this.curRgb[0];
		var g = this.curRgb[1];
		var b = this.curRgb[2];
		var h1 = r.toString(16);
		var h2 = g.toString(16);
		var h3 = b.toString(16);

		h1 = r < 16 ? "0" + h1 : h1;
		h2 = g < 16 ? "0" + h2 : h2;
		h3 = b < 16 ? "0" + h3 : h3;
		this.curHtml = [h1,h2,h3];

	},
	/**
	 * RGB 颜色值转换为 HSL.
	 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
	 * r, g, 和 b 需要在 [0, 255] 范围内
	 * 返回的 h, s, 和 l 在 [0, 1] 之间
	 *
	 * @param   Number  r       红色色值
	 * @param   Number  g       绿色色值
	 * @param   Number  b       蓝色色值
	 * @return  Array           HSL各值数组
	 */
	rgbToHsl: function (r, g, b){
		if(this.curRgb){
			var r = this.curRgb[0]/255;
			var g = this.curRgb[1]/255;
			var b = this.curRgb[2]/255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    	var h, s, l = (max + min) / 2;
	
	    	if(max == min){
	    	    h = s = 0; // achromatic
	    	}else{
	    	    var d = max - min;
	    	    s = l >= 0.5 ? d / (2 - max - min) : d / (max + min);
	    	    switch(max){
	    	        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	    	        case g: h = (b - r) / d + 2; break;
	    	        case b: h = (r - g) / d + 4; break;
	    	    }
	    	    ;
	    	}
	    	h = parseInt((h * 60 + 360)%360);
	    	s = parseInt(s * 100);
	    	l = parseInt(l * 100);

			this.curHsl = [h,s,l];

		}
	    
	},
	htmlToRgb:function(){
		if(this.curHtml){
			this.curRgb = this.curHtml.map(function(item){
				return parseInt('0x'+item);
			})
		}
	}
	
};

new colorSelector();