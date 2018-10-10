// pages/screen/screen/Flicker.js
Page({
  data: {
    time:10
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
    changeThisTime(this)
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  goIndex(e){
    this.setData({time: 0});
  }
})
function changeThisTime(that) {
  var time = that.data.time;
  time--;
  if (time >= 0) {
    that.setData({
      time: time,
    });
    setTimeout(() => {
      changeThisTime(that)
    }, 1000)
  } else {
    wx.switchTab({
      url: '../../../pages/index/index',
    })
    that.setData({
      time: 10
    });
  }

}