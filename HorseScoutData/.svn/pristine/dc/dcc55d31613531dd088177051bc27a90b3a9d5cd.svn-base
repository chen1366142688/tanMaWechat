/*
 * 公共 接口请求地址
 */

var H5url = 'https://patriarch-tm.tanmasports.com/static/data/page';  // 数据测试data访问地址
var appurl = 'https://patriarch-tm.tanmasports.com/gateway';  // 数据测试gateway接口地址
//var H5url = 'https://patriarch.tanmasports.com/static/data/page'//数据正式data访问地址
//var appurl = 'https://patriarch.tanmasports.com/gateway';  // 数据正式gateway接口地址
//var appurl ='http://192.168.3.4:8181'

/*
 * 获取URL的参数值
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

