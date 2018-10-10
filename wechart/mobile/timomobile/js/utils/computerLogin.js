$(function(){
    const regExp = /^1[3|4|5|8|7|6][0-9]\d{4,8}$/;
    var phoneNum,code,countShowMessage=60;
   $('#phoneNum').on('blur',function(){
       phoneNum = $(this).val();
   });
    $('.send').on('blur',function(){
        code = $(this).val();
    });
    $('.sendCode').on('click',function(){
        if (!regExp.test(phoneNum)) {
            confirm('请输入正确的手机号');
            return;
        }
        sendCoded(phoneNum);
        $(this).attr('disabled',true);
        showMessageTime();
    });
    $('.helpBorder').on('click',function(){
        login(phoneNum,code)
    });
    //发送验证码
    function sendCoded(phone) {
        $.ajax({
            url: appurl + '/v1/activity/invitation/gift/sendcode',
            method: 'GET',
            data: {
                'phone': phone
            },
            success:function(res) {
                if (res.code == 10000) {
                    console.log("发送成功")
                } else {
                    confirm(res.msg);
                }
            },
            error:function(info) {
                confirm(info.msg);
            }
        })
    }
    //登录
    function login(phone,code){
        $.ajax({
            url: appurl + '/v1/activity/invitation/gift/login',
            method: 'GET',
            data: {
                'phone': phone,
                'code':code
            },
            success:function(res) {
                if (res.code === 10000) {
                    let result = res.response;
                    $('#phoneNum').val('');
                    $('.send').val('');
                    location.href = 'computerIndex.html?giftToken='+result.giftToken+'&phoneNum='+result.phoneNum+'&userId='+result.userId;
                } else {
                    confirm(res.msg);
                }
            },
            error:function(info) {
                confirm(info.msg);
            }
        })
    }
    //倒计时
    function showMessageTime() {
        if (countShowMessage === 0) {
            $('.sendCode').removeAttr('disabled').text('发送验证码');
            countShowMessage = 60;
            return false;
        } else {
            countShowMessage--;
            $('.sendCode').text('( '+countShowMessage+'s )')
        }
        setTimeout(function () {
            showMessageTime();
        }, 1000);
    }
});