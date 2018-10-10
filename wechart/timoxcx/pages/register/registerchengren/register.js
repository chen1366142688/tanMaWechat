// page/index/index.js
Page({
  data: {
    items: [
      { name: 'volt', value: '青少年', checked: 'true' },
      { name: 'adults', value: '成人' },
    ],
    head_image_url: '../../../image/head.png'
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})