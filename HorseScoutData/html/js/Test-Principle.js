// var appurl = 'http://192.168.3.4:8081';  //这个删除
var testId;
$(function () {
    testId = GetQueryString('testId');
    helpnotice(this, testId);

});
$(function () {
    $('.Play').click(function () {
        $(this).hide();
        $(this).next().show();
        play();
    });
    $('.pause').click(function () {
        $(this).hide();
        $(this).prev().show();
        Pause();
    })
});
var myVideo = document.getElementById("video1");
//控制视频播放
function play() {
    myVideo.play();
}
//控制视频暂停
function Pause() {
    myVideo.pause();
}

/*
 * 获取URL的参数值
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/*测试原理子标题
通过测试原理ID查询详情信息
测试步骤
测试视频
*/

/*TheoryDetail 测试原理的id */
function helpnotice(that, testId) {
    $.ajax({
        type: 'GET',
        url: appurl + "/v1/corporeityTest/getCorporeityTheoryDetail",
        data: {
            'testId': testId
        },
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (res) {
            if (res.code == '10000') {
                let result = res.response;
                var data_responses = res.response;
                //测试原理标题
                $('#TestPrincipleHeader').html(res.response.theoryIntroduction);
                //测试原理内容
                $.each(res, function (key, item) {
                    $('#TestPrincipleSection').append(item.theoryDetail);
                });
                if (data_responses == null || data_responses.length == 0)
                    return;
                //测试步骤
                for (var j = 0, html = ''; j < data_responses.stepVOS.length; j++) {
                    html += '<div class="measuring-procedure-text-one">' + data_responses.stepVOS[j].stepDetail + '</div>'
                }
                j = null;
                $('.measuring-procedure-text').html(html);
                //视频
                $('#video1').attr('src', result.teachingVideo);
                $('#video1').attr('poster', result.teachingVideoPhoto);
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })

}


