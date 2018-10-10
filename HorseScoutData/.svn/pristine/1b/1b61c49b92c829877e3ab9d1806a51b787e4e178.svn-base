var helpDetailId;
$(function () {
    helpDetailId = GetQueryString('helpDetailId');
    helpnotice(this, helpDetailId);
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/*帮助子标题
通过帮助详情ID查询详情信息
*/

/*helpDetailId 帮助详情的id */
function helpnotice(that, helpDetailId) {
    $.ajax({
        type: 'get',
        url: appurl + "/v1/help/get/helpDetailInfoByHelpDetailId",
        data: {
            'helpDetailId': helpDetailId
        },
        dataType: "json",
        async: false,
        success: function (res) {
            if (res.code == '10000') {
                var result = res.response;
                var article = result.content;
                $.each(res, function (key, item) {
                    $('#HelpListheadline').append(item.title);
                });
                $('#HelpListText').html(res.response.content);
                //HelpListText.innerHTML;
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })

}

