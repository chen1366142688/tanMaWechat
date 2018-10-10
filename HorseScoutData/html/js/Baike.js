$(function () {
     var codes = GetQueryString("code");
    getallItemInfo(codes);
    $(".Switch-one-text").live('click',function (ev) {
        $(this).addClass("active").parent().siblings().children(".Switch-one-text").removeClass('active');
        var code = $(this).parent().attr('data-code');
        var arrobj = [code];
        itemGradeInfoByItemIdb(arrobj,1); //默认显示第一个
    })

});
/*
获取所有有效的科目简要信息
*/
function getallItemInfo(codes) {
    $.ajax({
        type: 'post',
        url: appurl + "/v1/help/get/commonInformationNames",
        data: {},
        dataType: "json",
        success: function (res) {
            if (res.code == '10000') {
                var arr = [];
                var dataHtmls = '';
                var data_responses = res.response;
                if (data_responses == null || data_responses.length == 0)
                    return;

                for (var i = 0; i < data_responses.length; i++) {
                    arr.push(data_responses[i].code)
                    dataHtmls +="<div class='Switch-one' data-code='"+data_responses[i].code+"' data-name='"+data_responses[i].name+"'><p class='Switch-one-text'>"+data_responses[i].name+"</p></div>";
                }
                $(".Switch").html(dataHtmls);
                $(`[data-code=${codes}] .Switch-one-text`).addClass('active');
                console.log($(`[data-code=${codes}] .Switch-one-text`)[0].offsetLeft)
                $(".Baike-header").scrollLeft($(`[data-code=${codes}] .Switch-one-text`)[0].offsetLeft);
                itemGradeInfoByItemIdb(arr,codes);
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })
}

//请求接口 接口名字是，通过科目id查询科目的评级说明
function itemGradeInfoByItemIdb(arr,codes) {
    $.ajax({
        type: 'POST',
        url: appurl +"/v1/help/get/commonInformation",
        data: JSON.stringify({
            codes:arr
        }),
        contentType: "application/json",
        success: function (res) {
            if (res.code == '10000') {
                for(let i = 0; i<res.response.length;i++){
                    if(codes ==1){
                        $('.Baike-section').html(res.response[0].comtent)
                    }else{
                        if(res.response[i].code == codes){
                            $('.Baike-section').html(res.response[i].comtent)
                        }
                    }
                }
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })
}
