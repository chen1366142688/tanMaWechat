//接口 getQrWebsite 获取扫一扫地址
$(function () {
    var type = GetQueryString('type') || '';
    var userId = GetQueryString('userId');
    type = ( type.toString().length < 2? '0' : '') + type.toString();
    //主教练start
    switch (type.toString()){
        case '01':
            $('#QuickMark-M').css("display","block"); //主教练
            $('#QuickMark-qrcga').hide();
            var qrcodeId = userId;
            break;
        case '02':
            $('#QuickMark-M').hide();
            $('#QuickMark-qrcga').css("display","block");
            var homeId = GetQueryString('homeId');
            var qrcodeId = homeId; //场馆id
            break;
    }
    //主教练end
    getQrWebsiteBind(this, type, qrcodeId);  //接口 getQrWebsite 获取扫一扫地址
})
/*
接口 getQrWebsite 获取扫一扫地址
*/

/* 'type': '01', //二维码类型 '01'  教练的二维码       "'02'" 场馆
 'id':65
 'type': type = ( type < 10 ? '0' : '') + type,
  */
/*
对应的id     '01'  教练的二维码 的id 是userid
             "02"  场馆的id 是homeid      后面这个是教练测试数据  'id':11   'id':65

 */
function getQrWebsiteBind(that, type, qrcodeId) {
    $.ajax({
        type: 'GET',
        url: appurl+"/v1/system/getQrWebsite",
        data: {
            'type': type,
            'id':qrcodeId
        },
        dataType: "json",
        async: false,
        success: function(res){
            // console.log(res);
            if(res.code == '10000')
            {
                var result = res.response;
                var url2 = result;
                jQuery('#output').qrcode({
                    size:200,
                    fill: '#1C1C1C',
                    text: url2, //任意内容 网址 文本等等
                    ecLevel:'H',//误差校正水平选择最高级
                    mode:2,//label模式选择2
                    fontname: 'Arial',
                    fontcolor: '#458fd2',
                    width: 321, //宽度
                    height:321, //高度
                });
                // 查询地址
                function GetQueryString1(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = url2.substr(1).match(reg);
                    if (r != null) return unescape(r[2]); return null;
                }
                // 教练名字 性别 gender
                var name = GetQueryString1('name');
                var gender = GetQueryString1('gender');
                  $('#name01').html(name);
                  $('#fieldbuildingname').html(name); //场馆名称
                if(gender == 1){
                	$("#unknown").show();
                    $('.gender-boy').show();
                    $('.gender-girl').hide();
                }else if (gender == 2){
                	$("#unknown").show();
                    $('.gender-girl').show();
                    $('.gender-boy').hide();
                }else if (gender == 3){
                   $("#unknown").show();
                    $('.gender-boy').hide();
                    $('.gender-girl').hide();
                }
            }
        },
        error:function(data){
            console.log("请求失败，服务器错误")
        }
    })

}
