phantom.outputEncoding = "gb2312"
var fs = require('fs')
var page = require('webpage').create(),
    system = require('system'),
    time, keyword, device, url;
var infoClass, titleClass, linkClass;

if (system.args.length !== 3) {
    console.log('Usage: task.js <keyword> <device>');
    phantom.exit();
}

//初始化各项值
time = Date.now();
keyword = system.args[1];
device = system.args[2];
url = "https://www.baidu.com/s?wd=" + keyword;

// 读取配置文件并进行设置
try {
    var fileContent = fs.read('config.json');
    var config = JSON.parse(fileContent);
    // console.log(config.length)
    var configItem = config.filter(function(item) {
        if (device.toLowerCase() === item.mobile.toLowerCase()) {
            return item;
        }
    });


    configItem.forEach(function(item){
      device = item.mobile;
      infoClass = item.info;
      // console.log(infoClass);
      linkClass = item.link;
      titleClass =item.title;

      page.settings.userAgent = item.ua;
      page.viewportSize = {
            width: item.width,
            height: item.height
        };
        page.clipRect = {
            top: 0,
            left: 0,
            width: item.width,
            height: item.height
        };
    })





} catch (err) {
    console.log('Failed to open the configuration file!')
}
page.onConsoleMessage = function(msg) {
  console.log(msg);
}
page.open(url, function(status) {

    page.includeJs('https://code.jquery.com/jquery-3.2.1.js', function() {

        var results = page.evaluate(function(tClass,iClass,lClass) {
            var content = $(".result");
            var dataArr = [];
            content.each(function(index, item) {
                var data = {};
                data['title'] = $(item).find(tClass).eq(0).text() || '';
                data['info'] = $(item).find(iClass).eq(0).text() || '';
                data['link'] = $(item).find(lClass).eq(0).attr('href') || '';
                
                dataArr.push(data);
            })
            return dataArr
        },titleClass,infoClass,linkClass)
        var jsonData = {
            code: status === 'success' ? 1 : 0,
            msg: status === 'success' ? '抓取成功' : '抓取失败',
            word: keyword,
            time: Date.now() - time,
            device: device,
            dataList: results
        }
        console.log(JSON.stringify(jsonData))
        phantom.exit()

    });
    page.render('baidu-'+keyword+'-'+device+'.png');
    // phantom.exit()

});
