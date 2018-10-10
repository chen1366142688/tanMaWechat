$(function(){
    const regExp = /^1[3|4|5|8|7|6][0-9]\d{4,8}$/;
    let giftToken = GetQueryString('giftToken');
    //let phoneNum = GetQueryString('phoneNum');
    //$('.q1').scrollTop( $('.q1')[0].scrollHeight ).css('overflow','hidden');
    let userId = GetQueryString('userId');
    let invitationUserCount = 0;
    const defaultArr =[
        '500元京东券一张','中国李宁蝴蝶鞋一双','山地自行车一架','200元京东券一张',
        'Nike足球一只','中国李宁时装周T恤一件','100元京东券一张','斯伯丁篮球一只',
        '李宁高清防雾泳镜一副','50元京东券','探马定制T恤一件','桌上足球一组',
        '20元话费充值券一张','红双喜乒乓球拍一只','红双喜羽毛球一桶','10元话费充值券一张',
        '扳羽球拍一副'
    ];
    //$('[name="phone"]').val(phoneNum);
    const imgUrl = 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/computer/prize/';
    query(giftToken,userId);
    $('.input').on('focus',function(){
        $(this).addClass('active').siblings('input').removeClass('active')
    });
    //用户点击提交领奖
    $('.subBox').on('click',function(){
        $('[name="name"]').removeClass('active');
        $('[name="phone"]').removeClass('active');
        $('[name="address"]').removeClass('active');
        let userName = $('[name="name"]').val();
        let phone = $('[name="phone"]').val();
        let address = $('[name="address"]').val();
        if(userName === ''){
            confirm('请填写姓名');
            return;
        }
        if (!regExp.test(phone)) {
            confirm('请输入正确的收货电话');
            return;
        }
        if(address === ''){
            confirm('请填写收货地址');
            return;
        }
        let giftList = new Array();
        let foo = $("img[class='img actives']");
        $(foo).each(function() {
            giftList.push({
                "giftIds": $(this).parent().attr('data-id'),
                "giftNames": $(this).attr('alt'),
                "orderStatus": $(this).attr('data-status')
            })
        });
        let data={
            "giftList": giftList,
            "receiveAddr": address,
            "receiveName": userName,
            "receivePhone": phone,
            "token": giftToken,
            "userId": userId
        };
        subMit(data)
    });
    //点击选择奖品
    $('.itemBox').on('click',function(){
        let dataId = $(this).attr('data-id');
        let dataStatus = $(this).children('.img').attr('data-status');
        let dataState = $(this).children('.img').attr('data-state');
        if(dataStatus == 2 || dataStatus == 3 || dataState == 2){return}
        if(dataId){
            if(invitationUserCount >=5 && invitationUserCount <10){//可选择5002、5001
                if(dataId == 5002 || dataId == 5001){
                    $(this).children('img').addClass('actives').parent().siblings('.itemBox').children('img').removeClass('actives')
                }
            }
            if(invitationUserCount >=10 && invitationUserCount <20){//可选择5002、5001、10001、10002、10003
                if(dataId == 5002 || dataId == 5001 || dataId == 10001 || dataId == 10002 || dataId == 10003){
                    $(this).children('img').addClass('actives').parent().siblings('.itemBox').children('img').removeClass('actives')
                }
            }
            if(invitationUserCount >=20 && invitationUserCount <40){//可选择5002、5001、10001、10002、10003、20001、20002、20003
                if(dataId == 5002 || dataId == 5001 || dataId == 10001 || dataId == 10002 || dataId == 10003 || dataId == 20001 || dataId == 20002 || dataId == 20003){
                    $(this).children('img').addClass('actives').parent().siblings('.itemBox').children('img').removeClass('actives')
                }
            }
            if(invitationUserCount >=40 && invitationUserCount <80){//可选择5002、5001、10001、10002、10003、20001、20002、20003、40001、40002、40003
                if(dataId == 5002 || dataId == 5001 || dataId == 10001 || dataId == 10002 || dataId == 10003 || dataId == 20001 || dataId == 20002 || dataId == 20003 || dataId == 40001 || dataId == 40002 || dataId == 40003){
                    $(this).children('img').addClass('actives').parent().siblings('.itemBox').children('img').removeClass('actives')
                }
            }
            if(invitationUserCount >=80 && invitationUserCount <120){//可选择5002、5001、10001、10002、10003、20001、20002、20003、40001、40002、40003、80001、80002、80003
                if(dataId == 5002 || dataId == 5001 || dataId == 10001 || dataId == 10002 || dataId == 10003 || dataId == 20001 || dataId == 20002 || dataId == 20003 || dataId == 40001 || dataId == 40002 || dataId == 40003 || dataId == 80001 || dataId == 80002 || dataId == 80003){
                    $(this).children('img').addClass('actives').parent().siblings('.itemBox').children('img').removeClass('actives')
                }
            }
            if(invitationUserCount >=120){//可选择5002、5001、10001、10002、10003、20001、20002、20003、40001、40002、40003、80001、80002、80003、120003、120002、120001
                if(dataId == 5002 || dataId == 5001 || dataId == 10001 || dataId == 10002 || dataId == 10003 || dataId == 20001 || dataId == 20002 || dataId == 20003 || dataId == 40001 || dataId == 40002 || dataId == 40003 || dataId == 80001 || dataId == 80002 || dataId == 80003 || dataId == 120001 || dataId == 120002 || dataId == 120003){
                    $(this).children('img').addClass('actives').parent().siblings('.itemBox').children('img').removeClass('actives')
                }
            }
        }
    });
    function query(giftToken,userId){
        $.ajax({
            type: "GET",
            url: appurl + "/v1/activity/invitation/gift/query",
            dataType: "json",
            contentType: 'application/json',
            data: {
                'giftToken':giftToken,
                'userId':userId
            },
            success(res){
                if(res.code == 10000){
                    let result = res.response;
                    //result.invitationUserCount = 30
                     invitationUserCount = result.invitationUserCount;
                    //循环判断状态
                    let giftList = result.giftList;
                    let arr =[];//需要更换状态的
                    let arrObj = [];
                    let arr1 = [];
                    let arrObj1 = [];
                    $('.title b').text(result.invitationUserCount*100).next('span').text('米');
                    if(giftList.length>0){
                        if(result.receiveAddr){
                            $('[name="address"]').val(result.receiveAddr);
                        }
                        if(result.receiveName){
                            $('[name="name"]').val(result.receiveName);
                        }
                        if(result.receivePhone){
                            $('[name="phone"]').val(result.receivePhone);
                        }
                        for(let i = 0; i<giftList.length;i++){
                            if(giftList[i].orderStatus == 2 || giftList[i].orderStatus == 3){
                                $(`[data-id="${giftList[i].giftIds}"] .img`).attr('data-status',giftList[i].orderStatus);
                            }
                            if(giftList[i].orderStatus == 1){
                                $(`[data-id="${giftList[i].giftIds}"] .img`).attr('data-status',giftList[i].orderStatus).addClass('actives');
                            }
                        }
                        arr1 =$("img[data-status='1']");
                        arr = $("img[data-status='2']");
                        arr = arr.concat($("[data-status='3']"));
                        if(arr1.length>0){
                            $(arr1).each(function() {
                                arrObj1.push($(this).attr('alt'));
                            });
                            for(let x=0;x<arrObj1.length;x++){
                                if(arrObj1[x] === defaultArr[0]){
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok500.png').addClass('actives');
                                    $(`[alt="${defaultArr[1]}"]`).attr('src',imgUrl+'ok8.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[2]}"]`).attr('src',imgUrl+'ok9.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[1]){
                                    $(`[alt="${defaultArr[0]}"]`).attr('src',imgUrl+'ok500.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok8.png').addClass('actives');
                                    $(`[alt="${defaultArr[2]}"]`).attr('src',imgUrl+'ok9.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[2]){
                                    $(`[alt="${defaultArr[0]}"]`).attr('src',imgUrl+'ok500.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[1]}"]`).attr('src',imgUrl+'ok8.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok9.png').addClass('actives');
                                }
                                if(arrObj1[x] === defaultArr[3]){
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok200.png').addClass('actives');
                                    $(`[alt="${defaultArr[4]}"]`).attr('src',imgUrl+'ok6s.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[5]}"]`).attr('src',imgUrl+'ok7.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[4]){
                                    $(`[alt="${defaultArr[3]}"]`).attr('src',imgUrl+'ok200.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok6.png').addClass('actives');
                                    $(`[alt="${defaultArr[5]}"]`).attr('src',imgUrl+'ok7.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[5]){
                                    $(`[alt="${defaultArr[3]}"]`).attr('src',imgUrl+'ok200.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[4]}"]`).attr('src',imgUrl+'ok6.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok7.png').addClass('actives');
                                }
                                if(arrObj1[x] === defaultArr[6]){
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok100.png').addClass('actives');
                                    $(`[alt="${defaultArr[7]}"]`).attr('src',imgUrl+'ok11.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[8]}"]`).attr('src',imgUrl+'ok.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[7]){
                                    $(`[alt="${defaultArr[6]}"]`).attr('src',imgUrl+'ok100.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok11.png').addClass('actives');
                                    $(`[alt="${defaultArr[8]}"]`).attr('src',imgUrl+'ok.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[8]){
                                    $(`[alt="${defaultArr[6]}"]`).attr('src',imgUrl+'ok100.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[7]}"]`).attr('src',imgUrl+'ok11.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok.png').addClass('actives');
                                }
                                if(arrObj1[x] === defaultArr[9]){
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok50.png').addClass('actives');
                                    $(`[alt="${defaultArr[10]}"]`).attr('src',imgUrl+'ok2.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[11]}"]`).attr('src',imgUrl+'ok3.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[10]){
                                    $(`[alt="${defaultArr[9]}"]`).attr('src',imgUrl+'ok50.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok2.png').addClass('actives');
                                    $(`[alt="${defaultArr[11]}"]`).attr('src',imgUrl+'ok3.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[11]){
                                    $(`[alt="${defaultArr[9]}"]`).attr('src',imgUrl+'ok50.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[10]}"]`).attr('src',imgUrl+'ok2.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok3.png').addClass('actives');

                                }
                                if(arrObj1[x] === defaultArr[12]){
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok20.png').addClass('actives');
                                    $(`[alt="${defaultArr[13]}"]`).attr('src',imgUrl+'ok4.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[14]}"]`).attr('src',imgUrl+'ok1.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[13]){
                                    $(`[alt="${defaultArr[12]}"]`).attr('src',imgUrl+'ok20.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok4.png').addClass('actives');
                                    $(`[alt="${defaultArr[14]}"]`).attr('src',imgUrl+'ok1.png').attr('data-state','1');
                                    console.log(imgUrl+'ok1.png')
                                }
                                if(arrObj1[x] === defaultArr[14]){
                                    $(`[alt="${defaultArr[12]}"]`).attr('src',imgUrl+'ok20.png').attr('data-state','1');
                                    $(`[alt="${defaultArr[13]}"]`).attr('src',imgUrl+'ok4.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok1.png').addClass('actives');
                                }
                                if(arrObj1[x] === defaultArr[15]){
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok10.png').addClass('actives');
                                    $(`[alt="${defaultArr[16]}"]`).attr('src',imgUrl+'ok5.png').attr('data-state','1');
                                }
                                if(arrObj1[x] === defaultArr[16]){
                                    $(`[alt="${defaultArr[15]}"]`).attr('src',imgUrl+'ok10.png').attr('data-state','1');
                                    $(`[alt="${arrObj1[x]}"]`).attr('src',imgUrl+'ok5.png').addClass('actives');
                                }
                            }
                        }
                        if(arr.length>0){
                            $(arr).each(function() {
                                arrObj.push($(this).attr('alt'));
                            });
                                for(let x=0;x<arrObj.length;x++){
                                    if(arrObj[x] === defaultArr[0]){
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received500.png');
                                        $(`[alt="${defaultArr[1]}"]`).attr('src',imgUrl+'noOk8.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[2]}"]`).attr('src',imgUrl+'noOk9.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[1]){
                                        $(`[alt="${defaultArr[0]}"]`).attr('src',imgUrl+'noOk500.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received8.png');
                                        $(`[alt="${defaultArr[2]}"]`).attr('src',imgUrl+'noOk9.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[2]){
                                        $(`[alt="${defaultArr[0]}"]`).attr('src',imgUrl+'noOk500.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[1]}"]`).attr('src',imgUrl+'noOk8.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received9.png');
                                    }
                                    if(arrObj[x] === defaultArr[3]){
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received200.png');
                                        $(`[alt="${defaultArr[4]}"]`).attr('src',imgUrl+'noOk6s.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[5]}"]`).attr('src',imgUrl+'noOk7.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[4]){
                                        $(`[alt="${defaultArr[3]}"]`).attr('src',imgUrl+'noOk200.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received6.png');
                                        $(`[alt="${defaultArr[5]}"]`).attr('src',imgUrl+'noOk7.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[5]){
                                        $(`[alt="${defaultArr[3]}"]`).attr('src',imgUrl+'noOk200.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[4]}"]`).attr('src',imgUrl+'noOk6s.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received7.png');
                                    }
                                    if(arrObj[x] === defaultArr[6]){
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received100.png');
                                        $(`[alt="${defaultArr[7]}"]`).attr('src',imgUrl+'noOk11.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[8]}"]`).attr('src',imgUrl+'noOk.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[7]){
                                        $(`[alt="${defaultArr[6]}"]`).attr('src',imgUrl+'noOk100.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received11.png');
                                        $(`[alt="${defaultArr[8]}"]`).attr('src',imgUrl+'noOk.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[8]){
                                        $(`[alt="${defaultArr[6]}"]`).attr('src',imgUrl+'noOk100.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[7]}"]`).attr('src',imgUrl+'noOk11.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received.png');
                                    }
                                    if(arrObj[x] === defaultArr[9]){
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received50.png');
                                        $(`[alt="${defaultArr[10]}"]`).attr('src',imgUrl+'noOk2.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[11]}"]`).attr('src',imgUrl+'noOk3.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[10]){
                                        $(`[alt="${defaultArr[9]}"]`).attr('src',imgUrl+'noOk50.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received2.png');
                                        $(`[alt="${defaultArr[11]}"]`).attr('src',imgUrl+'noOk3.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[11]){
                                        $(`[alt="${defaultArr[9]}"]`).attr('src',imgUrl+'noOk50.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received3.png');
                                        $(`[alt="${defaultArr[10]}"]`).attr('src',imgUrl+'noOk2.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[12]){
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received20.png');
                                        $(`[alt="${defaultArr[13]}"]`).attr('src',imgUrl+'noOk4.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[14]}"]`).attr('src',imgUrl+'noOk1.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[13]){
                                        $(`[alt="${defaultArr[12]}"]`).attr('src',imgUrl+'noOk20.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received4.png');
                                        $(`[alt="${defaultArr[14]}"]`).attr('src',imgUrl+'noOk1.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[14]){
                                        $(`[alt="${defaultArr[12]}"]`).attr('src',imgUrl+'noOk20.png').attr('data-state','2');
                                        $(`[alt="${defaultArr[13]}"]`).attr('src',imgUrl+'noOk4.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received1.png');
                                    }
                                    if(arrObj[x] === defaultArr[15]){
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received10.png');
                                        $(`[alt="${defaultArr[16]}"]`).attr('src',imgUrl+'noOk5.png').attr('data-state','2');
                                    }
                                    if(arrObj[x] === defaultArr[16]){
                                        $(`[alt="${defaultArr[15]}"]`).attr('src',imgUrl+'noOk10.png').attr('data-state','2');
                                        $(`[alt="${arrObj[x]}"]`).attr('src',imgUrl+'received5.png');
                                    }
                                }
                        }
                        //取显示位置
                        if (result.invitationUserCount >= 5 && result.invitationUserCount <10) {//500米奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                        } else if (result.invitationUserCount >= 10 && result.invitationUserCount < 20) {//1000米奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                        }  else if (result.invitationUserCount >= 20 && result.invitationUserCount < 40) {//2公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                        } else if (result.invitationUserCount >= 40 && result.invitationUserCount < 80 ) {//4公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                            if($('[data-id="40003"] img').attr('data-status') == 0 && $('[data-id="40003"] img').attr('data-state') == 1){
                                $('[data-id="40003"] img').attr('src',imgUrl+'ok100.png');
                            }
                            if($('[data-id="40002"] img').attr('data-status') == 0 && $('[data-id="40002"] img').attr('data-state') == 1){
                                $('[data-id="40002"] img').attr('src',imgUrl+'ok11.png');
                            }
                            if($('[data-id="40001"] img').attr('data-status') == 0 && $('[data-id="40001"] img').attr('data-state') == 1){
                                $('[data-id="40001"] img').attr('src',imgUrl+'ok.png');
                            }
                        } else if (result.invitationUserCount >= 80 && result.invitationUserCount < 120) {//8公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                            if($('[data-id="40003"] img').attr('data-status') == 0 && $('[data-id="40003"] img').attr('data-state') == 1){
                                $('[data-id="40003"] img').attr('src',imgUrl+'ok100.png');
                            }
                            if($('[data-id="40002"] img').attr('data-status') == 0 && $('[data-id="40002"] img').attr('data-state') == 1){
                                $('[data-id="40002"] img').attr('src',imgUrl+'ok11.png');
                            }
                            if($('[data-id="40001"] img').attr('data-status') == 0 && $('[data-id="40001"] img').attr('data-state') == 1){
                                $('[data-id="40001"] img').attr('src',imgUrl+'ok.png');
                            }
                            if($('[data-id="80003"] img').attr('data-status') == 0 && $('[data-id="80003"] img').attr('data-state') == 1){
                                $('[data-id="80003"] img').attr('src',imgUrl+'ok200.png');
                            }
                            if($('[data-id="80002"] img').attr('data-status') == 0 && $('[data-id="80002"] img').attr('data-state') == 1){
                                $('[data-id="80002"] img').attr('src',imgUrl+'ok6.png');
                            }
                            if($('[data-id="80001"] img').attr('data-status') == 0 && $('[data-id="80001"] img').attr('data-state') == 1){
                                $('[data-id="80001"] img').attr('src',imgUrl+'ok7.png');
                            }
                        } else if (result.invitationUserCount >= 120 ) {//12公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                            if($('[data-id="40003"] img').attr('data-status') == 0 && $('[data-id="40003"] img').attr('data-state') == 1){
                                $('[data-id="40003"] img').attr('src',imgUrl+'ok100.png');
                            }
                            if($('[data-id="40002"] img').attr('data-status') == 0 && $('[data-id="40002"] img').attr('data-state') == 1){
                                $('[data-id="40002"] img').attr('src',imgUrl+'ok11.png');
                            }
                            if($('[data-id="40001"] img').attr('data-status') == 0 && $('[data-id="40001"] img').attr('data-state') == 1){
                                $('[data-id="40001"] img').attr('src',imgUrl+'ok.png');
                            }
                            if($('[data-id="80003"] img').attr('data-status') == 0 && $('[data-id="80003"] img').attr('data-state') == 1){
                                $('[data-id="80003"] img').attr('src',imgUrl+'ok200.png');
                            }
                            if($('[data-id="80002"] img').attr('data-status') == 0 && $('[data-id="80002"] img').attr('data-state') == 1){
                                $('[data-id="80002"] img').attr('src',imgUrl+'ok6.png');
                            }
                            if($('[data-id="80001"] img').attr('data-status') == 0 && $('[data-id="80001"] img').attr('data-state') == 1){
                                $('[data-id="80001"] img').attr('src',imgUrl+'ok7.png');
                            }
                            if($('[data-id="120003"] img').attr('data-status') == 0 && $('[data-id="120003"] img').attr('data-state') == 1){
                                $('[data-id="120003"] img').attr('src',imgUrl+'ok500.png');
                            }
                            if($('[data-id="120002"] img').attr('data-status') == 0 && $('[data-id="120002"] img').attr('data-state') == 1){
                                $('[data-id="120002"] img').attr('src',imgUrl+'ok8.png');
                            }
                            if($('[data-id="120001"] img').attr('data-status') == 0 && $('[data-id="120001"] img').attr('data-state') == 1){
                                $('[data-id="120001"] img').attr('src',imgUrl+'ok9.png');
                            }
                        }

                    }else{//之前没有选择过奖品
                        if (result.invitationUserCount >= 5 && result.invitationUserCount <10) {//500米奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                        } else if (result.invitationUserCount >= 10 && result.invitationUserCount < 20) {//1000米奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                        }  else if (result.invitationUserCount >= 20 && result.invitationUserCount < 40) {//2公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                        } else if (result.invitationUserCount >= 40 && result.invitationUserCount < 80 ) {//4公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                            if($('[data-id="40003"] img').attr('data-status') == 0 && $('[data-id="40003"] img').attr('data-state') == 1){
                                $('[data-id="40003"] img').attr('src',imgUrl+'ok100.png');
                            }
                            if($('[data-id="40002"] img').attr('data-status') == 0 && $('[data-id="40002"] img').attr('data-state') == 1){
                                $('[data-id="40002"] img').attr('src',imgUrl+'ok11.png');
                            }
                            if($('[data-id="40001"] img').attr('data-status') == 0 && $('[data-id="40001"] img').attr('data-state') == 1){
                                $('[data-id="40001"] img').attr('src',imgUrl+'ok.png');
                            }
                        } else if (result.invitationUserCount >= 80 && result.invitationUserCount < 120) {//8公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                            if($('[data-id="40003"] img').attr('data-status') == 0 && $('[data-id="40003"] img').attr('data-state') == 1){
                                $('[data-id="40003"] img').attr('src',imgUrl+'ok100.png');
                            }
                            if($('[data-id="40002"] img').attr('data-status') == 0 && $('[data-id="40002"] img').attr('data-state') == 1){
                                $('[data-id="40002"] img').attr('src',imgUrl+'ok11.png');
                            }
                            if($('[data-id="40001"] img').attr('data-status') == 0 && $('[data-id="40001"] img').attr('data-state') == 1){
                                $('[data-id="40001"] img').attr('src',imgUrl+'ok.png');
                            }
                            if($('[data-id="80003"] img').attr('data-status') == 0 && $('[data-id="80003"] img').attr('data-state') == 1){
                                $('[data-id="80003"] img').attr('src',imgUrl+'ok200.png');
                            }
                            if($('[data-id="80002"] img').attr('data-status') == 0 && $('[data-id="80002"] img').attr('data-state') == 1){
                                $('[data-id="80002"] img').attr('src',imgUrl+'ok6.png');
                            }
                            if($('[data-id="80001"] img').attr('data-status') == 0 && $('[data-id="80001"] img').attr('data-state') == 1){
                                $('[data-id="80001"] img').attr('src',imgUrl+'ok7.png');
                            }
                        } else if (result.invitationUserCount >= 120 ) {//12公里奖品可选
                            if($('[data-id="5002"] img').attr('data-status') == 0 && $('[data-id="5002"] img').attr('data-state') == 1){
                                $('[data-id="5002"] img').attr('src',imgUrl+'ok10.png');
                            }
                            if($('[data-id="5001"] img').attr('data-status') == 0 && $('[data-id="5001"] img').attr('data-state') == 1){
                                $('[data-id="5001"] img').attr('src',imgUrl+'ok5.png');
                            }
                            if($('[data-id="10003"] img').attr('data-status') == 0 && $('[data-id="10003"] img').attr('data-state') == 1){
                                $('[data-id="10003"] img').attr('src',imgUrl+'ok20.png');
                            }
                            if($('[data-id="10002"] img').attr('data-status') == 0 && $('[data-id="10002"] img').attr('data-state') == 1){
                                $('[data-id="10002"] img').attr('src',imgUrl+'ok4.png');
                            }
                            if($('[data-id="10001"] img').attr('data-status') == 0 && $('[data-id="10001"] img').attr('data-state') == 1){
                                $('[data-id="10001"] img').attr('src',imgUrl+'ok1.png');
                            }
                            if($('[data-id="20003"] img').attr('data-status') == 0 && $('[data-id="20003"] img').attr('data-state') == 1){
                                $('[data-id="20003"] img').attr('src',imgUrl+'ok50.png');
                            }
                            if($('[data-id="20002"] img').attr('data-status') == 0 && $('[data-id="20002"] img').attr('data-state') == 1){
                                $('[data-id="20002"] img').attr('src',imgUrl+'ok2.png');
                            }
                            if($('[data-id="20001"] img').attr('data-status') == 0 && $('[data-id="20001"] img').attr('data-state') == 1){
                                $('[data-id="20001"] img').attr('src',imgUrl+'ok3.png');
                            }
                            if($('[data-id="40003"] img').attr('data-status') == 0 && $('[data-id="40003"] img').attr('data-state') == 1){
                                $('[data-id="40003"] img').attr('src',imgUrl+'ok100.png');
                            }
                            if($('[data-id="40002"] img').attr('data-status') == 0 && $('[data-id="40002"] img').attr('data-state') == 1){
                                $('[data-id="40002"] img').attr('src',imgUrl+'ok11.png');
                            }
                            if($('[data-id="40001"] img').attr('data-status') == 0 && $('[data-id="40001"] img').attr('data-state') == 1){
                                $('[data-id="40001"] img').attr('src',imgUrl+'ok.png');
                            }
                            if($('[data-id="80003"] img').attr('data-status') == 0 && $('[data-id="80003"] img').attr('data-state') == 1){
                                $('[data-id="80003"] img').attr('src',imgUrl+'ok200.png');
                            }
                            if($('[data-id="80002"] img').attr('data-status') == 0 && $('[data-id="80002"] img').attr('data-state') == 1){
                                $('[data-id="80002"] img').attr('src',imgUrl+'ok6.png');
                            }
                            if($('[data-id="80001"] img').attr('data-status') == 0 && $('[data-id="80001"] img').attr('data-state') == 1){
                                $('[data-id="80001"] img').attr('src',imgUrl+'ok7.png');
                            }
                            if($('[data-id="120003"] img').attr('data-status') == 0 && $('[data-id="120003"] img').attr('data-state') == 1){
                                $('[data-id="120003"] img').attr('src',imgUrl+'ok500.png');
                            }
                            if($('[data-id="120002"] img').attr('data-status') == 0 && $('[data-id="120002"] img').attr('data-state') == 1){
                                $('[data-id="120002"] img').attr('src',imgUrl+'ok8.png');
                            }
                            if($('[data-id="120001"] img').attr('data-status') == 0 && $('[data-id="120001"] img').attr('data-state') == 1){
                                $('[data-id="120001"] img').attr('src',imgUrl+'ok9.png');
                            }
                        }
                    }
                }else{
                    confirm(res.msg)
                }
            },
            error(info){
                confirm(info.msg)
            }
        })
    }
    function subMit(data){
        $.ajax({
            type: "POST",
            url: appurl + "/v1/activity/invitation/gift/apply",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success(res){
                if(res.code == '10000'){
                    confirm('提交成功')
                }else{
                    confirm(res.msg)
                }
            },
            error(info){
                confirm(info.msg)
            }
        })
    }

});