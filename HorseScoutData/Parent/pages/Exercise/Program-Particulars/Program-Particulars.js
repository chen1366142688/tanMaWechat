// pages/Exercise/Program-Particulars/Program-Particulars.js
Page({
  data: {
   url:''
  },
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中...',
    })
    //计划类型 planId 
    //孩子Id 非必须 childrenId 
    let childrenId = options.childrenId;
    let planId = options.planId;
    let url = `https://timosports.cn/static/data/page/Program-Particulars.html?planId=${planId}&&childrenId=${childrenId}`;
    this.setData({url : url})
    wx.hideLoading();
  },
  msgHandler(e) {
    console.log(e.detail.data) //我是网页，获取到来自也页面的数据
  },
  // 接收 h5 页面传递过来的参数
  handlePostMessage: function (e) {
    const data = e.detail;
    console.log(data);
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function (e) {
    console.log(e.webViewUrl)
  }
})