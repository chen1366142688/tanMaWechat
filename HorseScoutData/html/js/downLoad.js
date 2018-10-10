$(function(){
    version();
});


function version(){
    $.ajax({
        type:'GET',
        url: appurl +"/v1/version/getLatestDownloadUrl",
        dataType:'application/json',
        data:{},
        contentType: "application/json",
        success(res){
            res = JSON.parse(res);
            if(res.code == '10000'){
                $('.android').attr('href',res.response.androidUrl);
                $('.ios').attr('href','https://itunes.apple.com/us/app/%E5%B0%8F%E9%A9%AC%E5%81%A5%E5%BA%B7/id1432426335?l=zh&ls=1&mt=8');
            }else{
                // confirm(res.msg)
            }
        },
        error(info){
            // confirm(info.msg)
        }
    })
}
//轮播图
window.onload = function () {
    var container = document.getElementById('container');//获取容器id
    var list = document.getElementById('list');//获取img容器
    var buttons = document.getElementById('buttons').getElementsByTagName('span');//获取点
    // var prev = document.getElementById('prev');//左按钮
    // var next = document.getElementById('next');//右按钮
    var next;
    var animated = false;
    var index = 1;//小圆点
    var timer;//定时器
    var screenWidth = window.screen.width-24;//获取屏幕宽度
    //小圆点
    function showButton() {
        //对点点循环，去除已经有的on
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].className == 'on') {
                buttons[i].className = '';
                break//退出循环
            }
        }
        buttons[index - 1].className = 'on'
    }

    function animate(offset) {
//            快速点击时，会出现小圆点和图片不对应的情况，解决方案是当图片处于动画状态时，直接屏蔽掉点击事件
        animated = true;// 快速点击时，会出现小圆点和图片不对应的情况，解决方案是当图片处于动画状态时，直接屏蔽掉点击事件
        var newLeft = parseInt(list.style.left) + offset;

        //焦点图轮播
        var speed = offset / 30;//每次位移量
        function go() {
            if (speed < 0 && parseInt(list.style.left) > newLeft || (speed > 0 && parseInt(list.style.left) < newLeft)) {
                list.style.left = parseInt(list.style.left) + speed + 'px';
                setTimeout(go,10)
            } else {
                animated = false;// 快速点击时，会出现小圆点和图片不对应的情况，解决方案是当图片处于动画状态时，直接屏蔽掉点击事件
                list.style.left = newLeft + 'px';//转成数字702
                //判断是否l滚动到辅助图,图片滚动在-702和-2808之间,解决空白问题
                if (newLeft > -0) {
                    list.style.left = -1404 + 'px'
                }
                if (newLeft < -1053) {
                    list.style.left = -0 + 'px'
                }
            }
        }

        go()

    }

    //自动切换
    function play() {
        timer = setInterval(function () {
            next()
        }, 3000);
    }

    //停止切换
    function stop() {
        clearInterval(timer)
    }

    //右箭头
    next = function () {
        //判断点点是否是最后一个或者第一个
        /*            if(index==4){
                        index=1;
                    }else{
                        index+=1;
                    }*/
        index += 1;
        index = index > 4 ? 1 : index;
        // showButton();
        //+702和-702当做参数传给animate
//            list.style.left=parseInt(list.style.left)-702 +'px' //把字符串变为整数值，paresInt()只保留字符串中的数字
        if (!animated) {
            animate(-screenWidth)
        }
    };
    //左箭头
//     prev.onclick = function () {
//         /* if(index==1){
//              index=4;
//          }else{
//              index-=1;
//          }*/
//         index -= 1;
//         index = index < 1 ? 4 : index;
//         showButton();
// //            list.style.left=parseInt(list.style.left)+702+'px'
//         if (!animated) {
//             animate(screenWidth)
//         }
//     };
    //小圆点加事件
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
//                if(this.className=='on'){
//                    return;
//                }
            var myIndex = parseInt(this.getAttribute('index'));//获取当前点点的index
            var offset = -screenWidth * (myIndex - index);//移动的距离：当前的index-之前的index
            //恢复小圆点位置
            index = myIndex;
            showButton();
            if (!animate) {
                animate(offset)
            }
        }
    }
    //鼠标移上去，触发自动切换事件
    //container.onmouseover = stop;//不要加括号，
    //container.onmouseout = play;
    //自动切换
    play()
};


