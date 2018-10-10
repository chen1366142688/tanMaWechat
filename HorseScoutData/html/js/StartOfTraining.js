$(function(){
    let planId = GetQueryString("planId");
    let token = GetQueryString("token");
    let programType = GetQueryString("type");
    planDetail(planId,token);
    if(programType == 1){//说明这是小程序显示按钮
        $('.Training-button').show();
        $('.kong').show();
    }
})

var status = 1;
var btn=document.getElementsByTagName("button");
var myvideo=document.getElementById("video1");
var pro=document.getElementById("pro");
var ran=document.getElementById("ran");
var a=0.5,b=0.5;
myvideo.volume = a;
$('.volume-gradual-change').css('width',parseInt(a*100)+'%');

//关闭声音
function enableMute(){
    myvideo.muted=true;
    btn[0].disabled=true;
    btn[1].disabled=false;
}

//打开声音
function disableMute(){
    myvideo.muted=false;
    btn[0].disabled=false;
    btn[1].disabled=true;
}

//播放视频
function playVid(){
    myvideo.play();
    status = 2;
    $('.btnImg').css('display','none');
    $('.playBox').css('display','none').siblings('.pauseBox').css('display','block')
}
//暂停视频
function pauseVid(){
    myvideo.pause();
    status = 1;
    $('.puse').css('display','none').siblings('.btnImg').css('display','block');
    $('.pauseBox').css('display','none').siblings('.playBox').css('display','block')
}
function clickVideo(){
    if(status == 1){
        $('.btnImg').css('display','block').siblings('.puse').css('display','none');
    }else{
        $('.btnImg').css('display','none').siblings('.puse').css('display','block');
        setTimeout(function(){
            $('.puse').css('display','none');
        },2000)
    }
}
//全屏
function showFull(){
    myvideo.webkitrequestFullscreen();
}
//进度条展示
function pro1(){
    pro.max=myvideo.duration;
    pro.value=myvideo.currentTime;
}
//减小音量
function setvalueour(){
    if(b>=0.1){
        a =b- 0.1;
        a = a.toFixed(1)
        b = a;
        if(a < 0 || a > 1){
            myvideo.volume = 0;
            myvideo.muted = true;
            return;
        }else{
            $('.volume-gradual-change').css('width',parseInt(a*100)+'%')
            console.log(a*100+'%')
            myvideo.volume = a;
            myvideo.muted = false;
        }

    }else{
        return;
    }
}
//增大音量
function setvalue(num){
    if(b <=0.9999999999999999){
        if(b == 0.9999999999999999){
            $('.volume-gradual-change').css('width',Math.floor(100)+'%')
            myvideo.volume = 1;
            myvideo.muted = false;
            return;
        }
        a =Number(b)+ 0.1;
        b = a;
        $('.volume-gradual-change').css('width',Math.floor(a*100)+'%')
        myvideo.volume = a;
        myvideo.muted = false;
    }else{
        return;
    }

}
function planDetail(planId,token){
    $.ajax({
        type: 'GET',
        url: appurl +"/v1/exercisePlan/getExercisePlanVideo",
        headers: {
            'token':token
        },
        data: {
            planId:planId,
        },
        contentType: "application/json",
        success (res) {
            if (res.code == '10000') {
                let result = res.response;
                $('#video1').attr('src',result.teachingVideo);
                $('#video1').attr('poster',result.teachingVideoPhoto );
            }else{
                confirm(res.msg)
            }
        },
        error (data) {
            confirm(data.msg)
        }
    })
}
