//色彩选择器一共由三部分组成，从左至右分别命名为：选择区、选择条、数值框
var colorSelector = function (config){
	this.width = '780' || config.width; // 色彩选择器的整体高度
	// this.height = '420' || config.height; // 色彩选择器的整体高度
	// this.gap = '30' || config.gap; // 选择区、选择条、数值框之间的间隔
	this.barBg = ['rgb(255,0,0)','rgb(255,255,0)','rgb(0,255,0)','rgb(0,255,255)','rgb(0,0,255)','rgb(255,0,255)','rgb(255,0,0)'] || config.barBg; //设置选择条的背景，数组格式
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
		

		colorContent.appendChild(colorConDot);
		this.element.appendChild(colorContent);
		colorBar.appendChild(colorBarDot);
		this.element.appendChild(colorBar);
		var rgbArr = ['R',"G","B"];
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
				// console.log(conDotLeft.replace('px',''));
				that.calColor(conDotLeft,conDotTop);

			}
		});
		document.getElementsByClassName('colorContent')[0].addEventListener('mousedown',function(e){
			if(e.target.className == 'colorContent' && e.button == 0){
				that.setDot('colorConDot',e.offsetY,e.offsetX);
				that.calColor(e.offsetY,e.offsetX);
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
			var ofh = this.height * Math.sqrt(2) / 2;
			var fi = Math.floor((Math.sqrt(2)*(offsetX + offsetY) /2) / ofh);
			var rh = (Math.sqrt(2)*(offsetX + offsetY) /2) % ofh;

			this.curColor = [];
			var rgbInput = document.getElementsByClassName('rgbBlock')[0].getElementsByTagName('input');
			if(fi == 0){
				for(var i = 0; i < 3; i++){
					var theValue = parseInt(255-((255-this.curRgb[i])*rh / ofh));
					this.curColor.push(theValue);
					rgbInput[i].value = theValue;
				}
			}
			if(fi == 1){
				for(var i = 0; i < 3; i++){
					var theValue = parseInt(this.curRgb[i]-(this.curRgb[i]*rh / ofh));
					this.curColor.push(theValue);
					rgbInput[i].value = theValue;
				}
			}
			document.getElementsByClassName('colorBlock')[0].style.background = "rgb("+this.curColor.join(",")+")";


		}else{
			var oneFieldHeight = this.height / (this.barBg.length - 1);
			var fieldIndex = Math.floor(offsetY / oneFieldHeight);
			var remainHeight = offsetY % oneFieldHeight;
	
			this.curRgb = [];
			if(fieldIndex >= 0 && fieldIndex <= this.barBg.length-1){
				var startRgb = this.barBg[fieldIndex].replace('rgb(','').replace(')','').split(',');
				var endRgb = this.barBg[fieldIndex + 1].replace('rgb(','').replace(')','').split(',');
				
				for(var i = 0; i < 3; i++){
					this.curRgb.push(parseInt(startRgb[i]-((startRgb[i]-endRgb[i])*remainHeight / oneFieldHeight)));
				}
			}
			this.curRgbStr = 'rgb('+this.curRgb.join(",")+')';
			console.log(this.curRgbStr);
	
			this.setColorContent(this.curRgbStr);
		}
	},
	setColorContent:function(rgbStr){
		document.getElementsByClassName('colorContent')[0].style.background = 'linear-gradient(135deg, rgb(255,255,255),'+rgbStr+',rgb(0,0,0))';
	},
	//监听input框值的变化
	changValue:function(){
		var rgbInputs = document.getElementsByClassName('rgbBlock')[0].getElementsByTagName('input');
		var that = this;
		var oldColor = that.curColor;
		var newColor = [];
		for(var i = 0; i < rgbInputs.length; i++){
			rgbInputs[i].addEventListener('change',function(){
				newColor = [].slice.call(rgbInputs).map(function(inputItem){
					return inputItem.value;
				});
				that.calPos(newColor);	
			})
		}
		
	},
	calPos:function(newColor){
		for(var r = 0; r < this.barBg.length-2; r++){
			var startRgb = this.barBg[r];
			var endRgb = this.barBg[r+1];
			var arr1 = [];
			var arr2 = [];
			for(var g = 0; g < 3; g++){
				var diff1 = plusMinus(parseInt(startRgb[g]) - parseInt(newColor[g]));
				var diff2 = plusMinus(parseInt(newColor[g]) - parseInt(endRgb[g]));
				if(diff1 != diff2){
					break;
				} 
			}
		}
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