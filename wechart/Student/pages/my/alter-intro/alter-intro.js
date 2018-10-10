// pages/my/alter-intro/alter-intro.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({userInfo:options})
  },
  selfContent:function(e){
    var self=this.data.userInfo;
    self.self=e.detail.value;
    this.setData({
      userInfo:self
    })
  },
  subContent:function(e){
    var userInfo=this.data.userInfo;
    console.log(11111)
    wx.request({
      url: app.url +'/v1/student/update/studentDescribeByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data:{
        'userId': userInfo.userId,
        'describe': userInfo.self
      },
      success:function(res){
        if(res.data.code=='10000'){
          wx.showToast({
            title: '操作成功！',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail:function(info){
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
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
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
})