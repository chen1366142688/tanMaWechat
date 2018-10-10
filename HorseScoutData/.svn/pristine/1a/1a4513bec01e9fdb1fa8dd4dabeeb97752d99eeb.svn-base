$(function(){
    itemGradeInfoByItemIdb()
    let programType = GetQueryString("type");
    if(programType == 1){//说明这是小程序显示按钮
        $('.footer').show();
    }
    $('.noTest').click(()=>{//暂不测试
        wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
                wx.miniProgram.navigateTo({url: '/pages/index/index'});
                wx.miniProgram.postMessage({data: {id: '1234'}}); // 传的参数
            }
        });
    });
    $('.actionTest').click(()=>{//开始测试
        window.location.href=H5url+"/Program-Particulars.html"
    })

})
//请求接口 接口名字是，通过科目id查询科目的评级说明
function itemGradeInfoByItemIdb() {
    $.ajax({
        type: 'POST',
        url: appurl +"/v1/help/get/commonInformation",
        data: JSON.stringify({
            codes:['HEALTH_STATUS']
        }),
        contentType: "application/json",
        success: function (res) {
            if (res.code == '10000') {
                for(let i = 0; i<res.response.length;i++){
                    $('.Baike').html(res.response[i].comtent)
                }
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })
}