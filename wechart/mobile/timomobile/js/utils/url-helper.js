/*
 * 公共 接口请求地址
 */
//var appurl ='http://192.168.3.4:8081';
//var appurl = 'https://www.timosports.cn/gateway';  // 服务器端接口请求地址 正式地址
var appurl = 'https://timosports.cn/gateway';  // 服务器端接口请求地址 测试地址

/*
 * 获取URL的参数值
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

