
// var appurl = 'http://192.168.3.4:8081';  //这个删除
var testId;
$(function () {
    testId = GetQueryString('testId');
    helpnotice(this, testId);
})

/*
 * 获取URL的参数值
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
/*测试原理子标题
通过测试原理ID查询详情信息
*/
/*TheoryDetail 测试原理的id */
function helpnotice(that, testId) {
    $.ajax({
        type: 'GET',
        url: appurl+"/v1/corporeityTest/getCorporeityTheoryDetail",
        data: {
            'testId': testId
        },
        dataType: "json",
        async: false,
        success: function(res){
            if(res.code == '10000'){
                var result = res.response;
                var article = result.theoryIntroduction;
                $('#TestPrincipleHeader').html(res.response.theoryIntroduction);
                TestPrincipleHeader.innerHTML;
                $.each(res, function (key, item) {
                    $('#TestPrincipleSection').append(item.theoryDetail);
                });

            }
        },
        error:function(data){
            console.log("请求失败，服务器错误")
        }
    })

}

