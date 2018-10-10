function setWidth(deviceWidth) {
    var deviceWidth = deviceWidth || 320
    let phoneScale = parseInt(window.screen.width) / deviceWidth,
        meta = document.createElement('meta');
    meta.name = "viewport";
    if (/Android (\d+\.\d+)/.test(navigator.userAgent)) {
        let version = parseFloat(RegExp.$1);
        if (version > 2.3) {
            meta.content = "width=" + deviceWidth + ", minimum-scale = " + phoneScale + ", maximum-scale = " + phoneScale + ", target-densitydpi=device-dpi";
        } else {
            meta.content = "width=" + deviceWidth + ", target-densitydpi=device-dpi";
        }
    } else {
        meta.content = "width=" + deviceWidth + ", user-scalable=no";
    }
    let style = document.createElement('style');
    style.type = "text/css";
    document.head.appendChild(meta);
    if (/Windows/.test(navigator.userAgent)) { //如果是windows，根节点字体默认为12px
        // document.write('<style type="text/css">html{font-size:16px;}</style>');
        style.innerText = "html{font-size:16px;}"
    } else { //否则根据传入设备宽度计算根节点字体大小
        style.innerText = "html{font-size:" + deviceWidth / 320 * 14 + "px;}"
    }
    // document.head.appendChild(style);
};
