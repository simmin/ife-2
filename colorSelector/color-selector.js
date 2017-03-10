var colorSelector = function (config){
	this.colorBarHeight = '400' || config.colorBarHeight;

	this._init();
}

colorSelector.prototype = {
	_init:function(){
		this.getMouseBarPos();
	},
	getMouseBarPos:function(){
		var that = this;
		document.getElementsByClassName('colorBar')[0].addEventListener('mousedown',function(e){
			if(e.target.className == 'colorBar' && e.button == 0){
				that.calcColor(e.offsetY);
				that.setColorBarDot(e.offsetY);
			}
		})
	},
	setColorBarDot:function(offsetY){
		document.getElementsByClassName('colorBarDot')[0].style.top = offsetY+'px';
	},
	calcColor:function(offsetY){
		var oneFieldHeight = this.colorBarHeight/6;
		var relativeHeight = offsetY%oneFieldHeight;
		var relativeVal = parseInt((255/oneFieldHeight)*relativeHeight);
		var rgbStr = '';
		if(offsetY <= oneFieldHeight){
			rgbStr = 'rgb(255,'+relativeVal+',0)';
		}else if(offsetY <= oneFieldHeight*2){
			rgbStr = 'rgb('+(255-relativeVal)+',255,0)';
		}else if(offsetY <= oneFieldHeight*3){
			rgbStr = 'rgb(0,255,'+relativeVal+')';
		}else if(offsetY <= oneFieldHeight*4){
			rgbStr = 'rgb(0,'+(255-relativeVal)+',255)';
		}else if(offsetY <= oneFieldHeight*5){
			rgbStr = 'rgb('+relativeVal+',0,255)';
		}else if(offsetY <= oneFieldHeight*6){
			rgbStr = 'rgb(255,0,'+(255-relativeVal)+')';	
		}else{

		}

		this.setColorContent(rgbStr);
	},
	setColorContent:function(rgbStr){
		// document.getElementsByClassName('colorContent')[0].style.background = 'linear-gradient(to bottom, #FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)';
		document.getElementsByClassName('colorContent')[0].style.background = 'linear-gradient(135deg, rgb(255,255,255),'+rgbStr+' 50%,rgb(0,0,0))';
	}
};

new colorSelector();