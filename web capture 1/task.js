phantom.outputEncoding="gb2312"

var page = require('webpage').create(),
    system = require('system'),
    time,
    keyword,
    url;

if (system.args.length === 1) {
    console.log('Usage: task.js <keyword>');
    phantom.exit();
}

time = Date.now();
keyword = system.args[1];
url = "https://www.baidu.com/s?wd=" + keyword

page.open(url, function(status) {
	
    page.includeJs('https://code.jquery.com/jquery-3.2.1.js',function() {
            var results = page.evaluate(function() {
           		var content = $(".result");
           		var dataArr = [];
           		content.each(function(index,item){
           			var data = {};
           			data['title'] = $(item).find('.t').eq(0).text();
           			data['info'] = $(item).find('.c-abstract').eq(0).text();
           			data['link'] = $(item).find('.t').find('a').eq(0).attr('href');
           			data['pic'] = $(item).find('.general_image_pic').find('.c-img').eq(0).attr('src');
           			dataArr.push(data);
           		})
            	return dataArr    
            })
            var jsonData = {
            	code: status === 'success' ? 1 : 0,
            	msg: status === 'success' ? '抓取成功' : '抓取失败',
            	word: keyword,
            	time: Date.now()-time,
            	dataList: results
            }
            console.log(JSON.stringify(jsonData))
            phantom.exit()

    });
    
});
