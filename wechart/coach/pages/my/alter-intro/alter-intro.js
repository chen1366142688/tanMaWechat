// pages/my/alter-intro/alter-intro.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userInfo: options })
  },
  selfContent: function (e) {
    var self = this.data.userInfo;
    self.self = e.detail.value;
    this.setData({
      userInfo: self
    })
  },
  subContent: function (e) {
    var userInfo = this.data.userInfo;
    console.log(11111)
    wx.request({
      url: app.url + '/v1/student/update/studentDescribeByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        'userId': userInfo.userId,
        'describe': userInfo.self
      },
      success: function (res) {
        if (res.data.code == '10000') {
          wx.redirectTo({
            url: '../../../pages/my//personal-details//personal-details?userId=' + userInfo.userId + '&studentType=' + userInfo.studentType,
          })
        }
      },
      fail: function (info) {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})