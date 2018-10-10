$(function(){
    //获取计划类型和孩子id
    let planId = GetQueryString("planId");
    let childrenId = GetQueryString("childrenId");
    // var planId = 1;
    // let childrenId = 11;
    var pageNumber =  1;
    var commontList = [];
    planDetail(planId,childrenId);
    planReview(planId,pageNumber)
    $('.section-Play').click(function(){
        $(this).hide();
        $(this).next().show();
        play();
    })
    $('.section-Pause').click(function(){
        $(this).hide();
        $(this).prev().show();
        Pause();
    })
    //添加计划
    $('.Add-Program').click(function(){
        /*如果用户未注册，则弹到注册页面，如果已注册但未添加孩子信息，则弹到引导页。*/
        wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
                wx.miniProgram.navigateTo({url: '/pages/home/home'});
                wx.miniProgram.postMessage({data: {id: '1234'}}); // 传的参数
            }
        });
    })
    //写心得
    $('.Feedback-Training-headline-button').click(function(){
        wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
                wx.miniProgram.navigateTo({url: '/pages/Exercise/Training-feelings/Training-feelings'});
                wx.miniProgram.postMessage({data: {id: '1234'}}); // 传的参数
            }
        });
    })
    //查看更多
    $('.pack-up').click(function(){
        window.location.href=H5url+'/Project-Summary.html?planId='+planId;//地址待上传后修改
    })
    //回到顶部
    $('.Top').click(function(){
        $('html').scrollTop(0)
    })
    //判断页面滚动到底部
    $(window).scroll(function(){
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            if(pageNumber > 1){
                if(commontList.length > 0){
                    planReview(planId,pageNumber)
                    pageNumber += 1;
                }else{
                    return false;
                }
            }else if(pageNumber == 1){
                pageNumber += 1;
            }else{
                return false;
            }
        }
    });
var myVideo=document.getElementById("video1");
function play() {
    myVideo.play();
}
function Pause() {
    myVideo.pause();
}
function planDetail(planId,childrenId){
    $.ajax({
        type: 'GET',
        url: appurl +"/v1/exercisePlan/getExercisePlanDetail",
        data: {
            planId:planId,
            childrenId:childrenId
        },
        contentType: "application/json",
        success (res) {
            if (res.code == '10000') {

                let result = res.response;
                //适合年龄段
                $('.section-phases-age-section').html(result.ageScope+'岁')
                //已参加头像地址列表
                for(var y =0,imgList='';y<result.avatarUrlList.length;y++){
                    imgList +='<img class="population" style="z-index:20" src='+result.avatarUrlList[y]+'>'
                }
                y=null;
                //训练步骤列表
                for(var i = 0,html ='';i < result.planStepList.length; i++){
                    html +='<div class="Training-Steps-section-one">'+result.planStepList[i]+'</div>'
                }
                i=null;
                //辅助器材列表
                if(result.planToolList.length == 0){
                    $('.auxiliary-appliance').html('辅助器材<p class="auxiliary-appliance-section">无</p>')
                }else{
                    for(var x = 0,appliance='';x<result.planToolList.length;x++){
                        appliance +='<p class="auxiliary-appliance-section">'+result.planToolList[x]+'</p>'
                    }
                    $('.auxiliary-appliance').html('辅助器材'+appliance)
                    x=null;
                }
                //锻炼次数
                if(result.exerciseCount == '0' ){
                    $('.Feedback-Training-headline-button').hide();
                }
                //foot btn
                if(result.isHavePlan == 1){
                    $('.Add-Program').text("开始第"+result.exerciseCount +"次训练 GO")
                }else if(result.isHaveResult == 0){
                    $('.Add-Program').text("我也想试试")
                }
                $('.header-section-brief-introduction').html(result.detailIntroduction )
                $('.Program-description-text').html(result.detailPresentation )
                $('.section-phases-Program-section').html(result.itemLevelName )
                $('#Orientation').html(result.itemOrientationName +'|'+result.planName )
                $('.population-left-top').html(result.participationCount+"人")
                $('.section-phases-time-section').html(result.planDuration +'分钟')
                $('.header-background-img').attr('src',result.planPhoto )
                $('.Training-Steps-section').html(html)
                $('#video1').attr('src',result.teachingVideo)
                $('#video1').attr('poster',result.teachingVideoPhoto )
                $('.section-population-right').html(imgList)
                $('.section-population-right').append("<img class='population' style='z-index:12' src='http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/patriarch/Exercise/More.png'>")
            }else{
                confirm(res.msg)
            }
        },
        error (data) {
            confirm(data.msg)
        }
    })
}

function planReview(planId,pageNumber){
    $.ajax({
        type: 'POST',
        url: appurl +"/v1/exercisePlan/getPlanCommentByPlanId",
        data: JSON.stringify(jsonFun(planId,pageNumber)),
        contentType: "application/json",
        success(res){
            if(res.code == '10000'){
                let results = res.response;
                commontList = res.response;
                if(results.length == 0){pageNumber =1; return;}
                if(pageNumber ==1){
                    for(var j = 0,html='';j<results.length;j++){
                        html += "<div class='Feedback-Training-section-one'>\n" +
                            "                <div class='Feedback-Training-one-headline'>\n" +
                            "                    <div class='one-headline-head-portrait'>\n" +
                            "                        <img class='one-headline-head-portrait-img' src="+results[j].avatarUrl +">\n" +
                            "                    </div>\n" +
                            "                    <div class='one-headline-brief-introduction'>\n" +
                            "                        <div class='brief-introduction-top'>"+results[j].patriarchName +"(来自 "+results[j].childrenSchoolName +")</div>\n" +
                            "                        <div class='brief-introduction-bottom'>\n" +
                            "                            <div class='brief-introduction-bottom-left'>已完成"+results[j].exerciseCount +"次本计划</div>\n" +
                            "                            <div class='brief-introduction-bottom-right'>"+results[j].createTime +"</div>\n" +
                            "                        </div>\n" +
                            "                    </div>\n" +
                            "                </div>\n" +
                            "                <div class='Feedback-Training-one-section'>"+results[j].commentDetail +"</div>\n" +
                            "            </div>"
                    }
                    j=null;
                    $('.Feedback-Training-section').html(html)
                }else{
                    for(var v = 0,htmlv='';v<results.length;v++){
                        htmlv += "<div class='Feedback-Training-section-one'>\n" +
                            "                <div class='Feedback-Training-one-headline'>\n" +
                            "                    <div class='one-headline-head-portrait'>\n" +
                            "                        <img class='one-headline-head-portrait-img' src="+results[v].avatarUrl +">\n" +
                            "                    </div>\n" +
                            "                    <div class='one-headline-brief-introduction'>\n" +
                            "                        <div class='brief-introduction-top'>"+results[v].patriarchName +"(来自 "+results[v].childrenSchoolName +")</div>\n" +
                            "                        <div class='brief-introduction-bottom'>\n" +
                            "                            <div class='brief-introduction-bottom-left'>已完成"+results[v].exerciseCount +"次本计划</div>\n" +
                            "                            <div class='brief-introduction-bottom-right'>"+results[v].createTime +"</div>\n" +
                            "                        </div>\n" +
                            "                    </div>\n" +
                            "                </div>\n" +
                            "                <div class='Feedback-Training-one-section'>"+results[v].commentDetail +"</div>\n" +
                            "            </div>"
                    }
                    v = null;
                    $('.Feedback-Training-section').append(htmlv)
                }

            }else{
                //confirm(res.msg)
            }
        },
        error(info){
            confirm(info.msg)
        }
    })
}
function  jsonFun(planId,pageNumber) {
    var json={
        "pageNumber": pageNumber,
        "planId": planId,
        "theNumber": 10
    }
    return json;
}


})