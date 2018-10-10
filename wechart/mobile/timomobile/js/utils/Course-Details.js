var classId;//必须
var userId;//必须
var isLogin;//必须
var token;//必须

var studentId;//已注册时，必须
var userName;//未注册时，必须,微信昵称

var storeStatus;//收藏状态
var buttonClick=true;
$(function () {
    classId = GetQueryString('classId');
    userId = GetQueryString('userId');
    isLogin = GetQueryString('isLogin');
    token = GetQueryString('token');
    userName=GetQueryString('userName');
    studentId=GetQueryString('studentId');
    $("#model8").hide();

    // classId = 296;
    // userId = 110;
    // isLogin = '0'//1已注册，0未注册;
    // token = "e8eccad137e6e0f327495e58044ef7e7";
    // studentId="";
    // userName="测试营销账号110"
    helpnotice(this, classId);
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//提示框关闭
$(".model8-section-text").click(function () {
     $("#model8").hide();
});


//购买
    $("#model1").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model2").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model3").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model4").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model5").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model6").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model7").on("touchmove",function(){
        event.preventDefault();
    });
    $("#model8").on("touchmove",function(){
        event.preventDefault();
    });
    //已登录情况下，点击购买弹出的选择时间段弹窗
    $('#Purchase').click(function () {//点击a标签
        $('html').css("overflow","hidden","height","100%;");
        $('body').css("overflow","hidden","height","100%;");
        if (isLogin == '1') {
            if ($('#model1').css('display', 'none')) {//如果当前隐藏
                $('#model1').show();//那么就显示div
            } else {//否则
                $('#model1').hide();//就隐藏div
            }
        } else {
            if ($('#model2').css('display', 'none')) {//如果当前隐藏
                $('#model2').show();//那么就显示div
                $('#model1').hide();
            } else {//否则
                $('#model2').hide();//就隐藏div

            }
        }
    });

    //未注册，购买
    $('#confirmation').click(function () {
          if(!buttonClick){//重复提交防止
            return;
          }
          buttonClick=false;
        let checkedSectionId = $("input[type='radio']:checked").val();
         if(checkedSectionId==undefined){
               $(".model8-section-input").html("请选择课程时间段！");
               $("#model8").show();
               buttonClick=true;
               return false;
         }
        var phone = $("input[name='phone']").val();
        var codeReg = /^[1][0-9]{10}$/;
        if (!codeReg.test(phone)) {
            $(".model8-section-input").html("请输入正确的手机号！");
            $("#model8").show();
            buttonClick=true;
            return false;
        }           
        var checkCode = $("input[name='checkCode']").val();
        if (checkCode=="") {
            $(".model8-section-input").html("请输入验证码！");
            $("#model8").show();
            buttonClick=true;
            return false;
        }
        noLoginSaveStudentStore(2);
    });
    //已登录 购买课程
    $('#Confirm').click(function () {
          if(!buttonClick){//重复提交防止
            return;
          }
          buttonClick=false;
        let checkedSectionId = $("input[type='radio']:checked").val();
         if(checkedSectionId==undefined){
            $(".model8-section-input").html("请选择课程时间段！");
            $("#model8").show();               
                buttonClick=true;
               return;
         }
        saveOrderClass(checkedSectionId);
    });

    $('.backModal').click(function () {//点击a标签
        $(this).parent().hide();
        $('html').css("overflow","auto;","height","100%;");
        $('body').css("overflow","auto;","height","100%;");
    })
    $('.backModals').click(function () {//点击a标签
        $(this).parent().hide();
        $('html').css("overflow","auto;","height","100%;");
        $('body').css("overflow","auto;","height","100%;");
    })
    //model3 购买成功后关闭购买成功弹窗
    $('.Course-Details-model3').click(function () {//点击a标签
        if ($('#model3').css('display', 'none')) {//如果当前隐藏
            $('#model3').hide();//那么就显示div
            $('#model2').hide();
            $('#model1').hide();
        }
        $('html').css("overflow","auto;","height","100%;");
        $('body').css("overflow","auto;","height","100%;");
    })
    //model4 购买未成功后弹出未购买成功弹窗
    $('.Course-Details-model4').click(function () {
        if ($('#model3').css('display', 'none')) {
            $('#model3').hide();
            $('#model2').hide();
            $('#model1').hide();
        }
        $('html').css("overflow","auto;","height","100%;");
        $('body').css("overflow","auto;","height","100%;");
    })
//收藏
//点击收藏按钮，弹出收藏成功或者未登录时收藏的弹窗
    $('#collect').click(function () {
        $('html').css("overflow","hidden","height","100%;");
        $('body').css("overflow","hidden","height","100%;");
        if (isLogin == '1') {

            if(!buttonClick){//重复提交防止
                return;
            }
            buttonClick=false;
           if(storeStatus=="1"){
               deleteStudentStore();//取消收藏
            }else{
              saveStudentStore();//新增收藏
            }
        } else {
             $('#model5').show();
             $('#model6').hide();
             $('#model7').hide();
        }
    });
    //点击确认收藏，
    $('.model5-section-button').click(function () {//点击a标签
        if(!buttonClick){//重复提交防止
            return;
          }
          buttonClick=false;        
        var phone = $("input[name='storePhone']").val();
        var codeReg = /^[1][0-9]{10}$/;
        if (!codeReg.test(phone)) {
            $(".model8-section-input").html("请输入正确的手机号！");
            $("#model8").show();              
            buttonClick=true;            
            return;
        }           
        if ($("input[name='storeCode']").val()=="") {
            $(".model8-section-input").html("请输入验证码！");
            $("#model8").show();             
            buttonClick=true;            
            return;
        }

        noLoginSaveStudentStore(1);
    });
    //model6  点击收藏成功弹窗任意地方，关闭收藏成功弹窗
    $('#model6').click(function () {//点击a标签
        if ($('#model6').css('display', 'none')) {//如果当前隐藏
            $('#model5').hide();//那么就显示div
        }
    })
    $('#model7').click(function () {//点击a标签
        if ($('#model7').css('display', 'none')) {//如果当前隐藏
            $('#model5').hide();//那么就显示div
        }

    })


//阿拉伯数字转星期
function chinanum(num) {
    num--;
    var china = new Array('一', '二', '三', '四', '五', '六', '日');
    var arr = new Array();
    for (var i = 0; i < china.length; i++) {
        arr[0] = china[num];
    }
    return arr.join("")
}

//验证手机号
function isPoneAvailable($poneInput) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test($poneInput.val())) {
        return false;
    } else {
        return true;
    }
}

//传入一个input的jq对象即可,也可以直接传入字符串进行手机号验证
function isPoneAvailables(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
var countdown = 60;

function settime() {
    //console.log($(".btnSendCode").val());
    if (countdown == 0) {
        $(".btnSendCode").removeAttr("disabled");
        $(".btnSendCode").val("获取验证码");
        countdown = 60;
        return false;
    } else {
        $(".btnSendCode").attr("disabled", true);
        $(".btnSendCode").val("重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function () {
        settime();
    }, 1000);
}

/*
* 获取验证码  购买 type:1收藏；2订单
* */
function getIdentifyingCode(type) {
    var tel =null;
    if(type=="1"){
     tel = $("input[name='storePhone']").val();
    }else{
     tel = $("input[name='phone']").val();  
    }
    var codeReg = /^[1][0-9]{10}$/;
    if (!codeReg.test(tel)) {
        $(".model8-section-input").html("请输入正确的手机号！");
        $("#model8").show();    
        return;
    } else {
        var data = {
            type: '1',
            userId: userId,
            userPhoneNo: tel
        };
       // console.log(data);
        $.ajax({
            async: false,
            type: "POST",
            url: appurl + "/v1/common/sendSMS",
            dataType: "json",
            header: {
                'token': token,
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (res) {
               // console.log(res);
                if (res.code == 10000) {
                    //console.log("请求成功");
                    settime();
                } else {
                   $(".model8-section-input").html(res.msg);
                   $("#model8").show();   
                }
            }
        });
    }
}
//未注册时，注册操作(type:1收藏；2订单)
function noLoginSaveStudentStore(type){ 
       var code="";
       var userPhoneNo="";
    $('html').css("overflow","auto;","height","100%;");
    $('body').css("overflow","auto;","height","100%;");
       if(type=="1"){
         code=$("input[name='storeCode']").val();
         userPhoneNo=$("input[name='storePhone']").val();              
       }else{
        code=$("input[name='checkCode']").val();
        userPhoneNo=$("input[name='phone']").val();          
       }
   $.ajax({
        type: 'post',
        url: appurl + "/v1/student/add/studentregioninfo",
        contentType:"application/json;charset=UTF-8",
        headers: {
            'token': token
        },       
        data:JSON.stringify({
            "code": code,
            "studentSchoolId": "",
            "userId": userId,
            "userName": userName==""?userPhoneNo:userName,
            "userPhoneNo": userPhoneNo,
            "userType": "1"
        }),
        dataType: "json",
        async: false,
        success: function (res) {
            //console.log(res);
            if (res.code == '10000') {
               let studentVO = res.response.studentVO;
                  studentId=studentVO.roleId;
                  userId=studentVO.userId;
                  token=res.response.wechartInitResponse.token;
                  isLogin='1';
                  if(type=='1'){//收藏
                     saveStudentStore();
                  }else{//
                     saveOrderClass($("input[type='radio']:checked").val())
                  }
            }else{
                buttonClick=true;
                $(".model8-section-input").html(res.msg);
                $("#model8").show();                   
            }
        },
        error: function (data) {
            buttonClick=true;
            console.log("请求失败，服务器错误")
        }
    })
}

//新增收藏:1：已注册，直接收藏 0，未注册时,注册后调用收藏
function saveStudentStore(){
    $('html').css("overflow","auto;","height","100%;");
    $('body').css("overflow","auto;","height","100%;");
   $.ajax({
        type: 'get',
        url: appurl + "/v1/studentStore/insertStore",
        headers: {
            'token': token
        },
        data: {
            'classId': classId,
            'userId': userId,
            'studentId':studentId,
            'remindType': 1
        },
        dataType: "json",
        async: false,
        success: function (res) {
             buttonClick=true;
            if (res.code == '10000') {
                 storeStatus='1';
                // if(type=="0"){//未注册时,注册后调用收藏
                    $('#model6').show();
                    $('#model5').hide();
                    $('#model7').hide();
                    $('.Botton-one-image2').show();
                    $('.Botton-one-image').hide();

                   showMessageTime();
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })
}
var countShowMessage = 3;
function showMessageTime() {
    if (countShowMessage == 0) {
        countShowMessage = 3;
             $('#model3').hide();
             $('#model4').hide();
             $('#model6').hide();
             $('#model7').hide();
        return false;
    } else {
        countShowMessage--;
    }
    setTimeout(function () {
        showMessageTime();
    }, 500);
}
//删除收藏 
function deleteStudentStore(){
    $('html').css("overflow","auto;","height","100%;");
    $('body').css("overflow","auto;","height","100%;");
   $.ajax({
        type: 'get',
        url: appurl + "/v1/studentStore/updateStudentSoreStatusByUserIdAndClassId",
        headers: {
            'token': token
        },
        data: {
            'classId': classId,
            'userId': userId,
        },
        dataType: "json",
        async: false,
        success: function (res) {
            buttonClick=true;
            if (res.code == '10000') {
                storeStatus='0';
                $('#model7').show();//那么就显示div
                $('#model5').hide();
                 $('#model6').hide();
                $('.Botton-one-image2').hide();
                $('.Botton-one-image').show();
                showMessageTime();
            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })
}
//购买课程 type： 1已注册，直接购买 ；0未注册时,注册后调用购买
function saveOrderClass(checkedSectionId){
        $.ajax({
            type: 'POST',
            url: appurl + "/v1/order/createOrderClass",
            contentType:"application/json;charset=UTF-8",
            headers: {
                'token': token
            },
            data: JSON.stringify({
                'classId': classId,
                'userId': userId,
                'payType':'0',
                'sectionIdList':[checkedSectionId],
                'remarks':'营销课程下单',
            }),
            dataType: "json",
            async: false,
            success: function (res) {
                buttonClick=true;
                if (res.code == '10000') {
                      $('#model3').show();
                      $('#model2').hide();
                      $('#model1').hide();
                      showMessageTime();
                }
            },
            error: function (data) {
                buttonClick=true;
                console.log("请求失败，服务器错误")
            }
        }) 
}
//课程详情、课程时段、咨询教练接口调用
function helpnotice(that, helpDetailId) {
    $.ajax({
        type: 'get',
        url: appurl + "/v1/class/getClassMarketingDetail",
        headers: {
            'token': token
        },
        data: {
            'classId': classId,
            'userId': userId
        },
        dataType: "json",
        async: false,
        success: function (res) {
            if (res.code == '10000') {
                var data_responses = res.response;
                //课程详情
                $('#CDsection').html(res.response.marketingDetail);
                CDsection.innerHTML;
                //选择课程时段
                var html = "";
               // console.log(data_responses.classSectionVOs);
                var classSectionVOs = data_responses.classSectionVOs;
                for (var j = 0; j < classSectionVOs.length; j++) {
                    let member=classSectionVOs[j].maxMember - classSectionVOs[j].signUpMember;
                    html += '<div class="Iform-one"><div class="Iform-one-left"> <input type="radio" name="user" value="'+classSectionVOs[j].sectionId+'" class="Iform-one-input"> ' + '<p class="Iform-p">' + "  周" + chinanum(classSectionVOs[j].weekDay) + " : " + classSectionVOs[j].dayTimeStart + " - " + classSectionVOs[j].dayTimeEnd + '</p>' + '</div>';
                    html += '<div class="Iform-one-right">' + "还可报" + '<p class="Iform-one-p">' + (member<0?0:member) + '</p>' + "人" + '</div></div>';
                }
                j = null;
                $('#Iform').html(html);
                $('#Iform2').html(html);
                //咨询教练
                $('#iPhone').attr('href', 'tel:' + data_responses.coachPhone);
                //是否已收藏
                storeStatus=data_responses.storeStatus;
                if(storeStatus =='1'){
                    $('.Botton-one-image2').show();
                    $('.Botton-one-image').hide();
                }

            }
        },
        error: function (data) {
            console.log("请求失败，服务器错误")
        }
    })

}
