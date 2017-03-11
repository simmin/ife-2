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

		colorContent.appendChild(colorConDot);
		this.element.appendChild(colorContent);
		colorBar.appendChild(colorBarDot);
		this.element.appendChild(colorBar);
		var rgbArr = ['R',"G","B"];
		var hslArr = ['H',"S","L"];
		for(var i = 0; i < 3; i++){
			var divBlock = this.createElements('div','hsl-item');
			var spanBlock = this.createElements('span');
			spanBlock.innerText = hslArr[i];
			var inputBlock = this.createElements('input');
			inputBlock.setAttribute('type','number');
			// inputBlock.setAttribute('min','0');
			// inputBlock.setAttribute('max','255');
			divBlock.appendChild(spanBlock);
			divBlock.appendChild(inputBlock);
			hslBlock.appendChild(divBlock);
		}
		for(var i = 0; i < 3; i++){
			var divBlock = this.createElements('div','rgb-item');
			var spanBlock = this.createElements('span');
			spanBlock.innerText = rgbArr[i];
			var inputBlock = this.createElements('input');
			inputBlock.setAttribute('type','number');
			inputBlock.setAttribute('min','0');
			inputBlock.setAttribute('max','255');
			divBlock.appendChild(spanBlock);
			divBlock.appendChild(inputBlock);
			rgbBlock.appendChild(divBlock);
		}
		colorBox.appendChild(colorBlock);
		colorBox.appendChild(hslBlock);
		colorBox.appendChild(rgbBlock);
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
		colorBlock.style.height = '30px';
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
				that.setInput();

			}
		});
		document.getElementsByClassName('colorContent')[0].addEventListener('mousedown',function(e){
			if(e.target.className == 'colorContent' && e.button == 0){
				that.setDot('colorConDot',e.offsetY,e.offsetX);
				that.calColor(e.offsetY,e.offsetX);
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
	},
	//监听input框值的变化
	changValue:function(){
		var hslInputs = document.getElementsByClassName('hslBlock')[0].getElementsByTagName('input');
		var that = this;
		var newColor = [];
		for(var i = 0; i < hslInputs.length; i++){
			hslInputs[i].addEventListener('change',function(){
				newColor = [].slice.call(hslInputs).map(function(inputItem){
					return inputItem.value;
				});
				that.curHsl = newColor;
				that.calPos();	
			})
		}
		
	},
	calPos:function(){
		var barTop = this.curHsl[0] * 360 / this.height;

		this.setDot('colorBarDot',barTop);

		this.setColorContent();

		var conLeft = (100 - this.curHsl[2]) * this.height / (100 * Math.sqrt(2));

		this.setDot('colorConDot',conLeft,conLeft);


	},
	plusMinus:function(diff){
		if(diff > 0){
			return 1;
		}
		if(diff < 0){
			return -1;
		}
		if(diff = 0){
			return 0;
		}
	},
	setPos:function(){

	}

	//验证this.barBg的是否为rgb格式，如果不是转成rgb格式
	//Hex转RGB
	//RGB转Hex
	//RGB转HSL
	
};

new colorSelector();