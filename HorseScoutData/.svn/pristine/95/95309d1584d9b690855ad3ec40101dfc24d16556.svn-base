// var appurl = 'http://192.168.3.4:8081';  //这个删除
var planId;
$(function () {
    planId = GetQueryString('planId');
    helpnotice(this, planId);
});
/*计划简介子标题
通过计划简介ID查询详情信息
*/

/*planId 计划简介的id */
function helpnotice(that, planId) {
    $.ajax({
        type: 'get',
        url: appurl + "/v1/exercisePlan/getExercisePlanDescribe",
        data: {
            'planId': planId
        },
        dataType: "json",
        async: false,
        success: function (res) {
            if (res.code == '10000') {
                $('#presentation').html(res.response.detailPresentation);
                $('#theory').html(res.response.theoryDetail);
                $('#TargetUser').html(res.response.detailFitThrong);
                $('#TabooCrowd').html(res.response.detailTabooThrong);
                $('#preparation').html(res.response.detailPrepare);
                $('#Copyright').html(res.response.detailPrepare);
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })

}

