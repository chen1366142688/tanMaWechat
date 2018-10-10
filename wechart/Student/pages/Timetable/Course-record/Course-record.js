const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerText: '没有更多内容了',
    isScroll: true,
    cityList:[],
    pageNumber:1,
    isMore : true,
    height:880
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.orderCode
    })
    this.getScheduleAttendInfo();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.noType();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMore)
      this.getScheduleAttendInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goAddCurrse(e){
    wx.switchTab({
      url: '../../../pages/Timetable/Timetable/Timetable',
    })
  },
  getScheduleAttendInfo:function(){
    var that = this;
    wx.request({
      url: app.url + '/v1/schedule/getScheduleAttendInfo',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        "pageNumber": this.data.pageNumber,
        "orderCode": this.data.id,
        "theNumber": 10
      },
      method: 'POST',
      success(res) {
        if (res.data.code == '10000') {
          if (res.data.response.length == 0){
            that.setData({
              isMore : false
            })
            return false;
          }
          that.setData({
            cityList: that.data.cityList.concat(res.data.response),
            pageNumber: that.data.pageNumber + 1
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
});
