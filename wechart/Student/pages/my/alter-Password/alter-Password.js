// pages/my/alter-Password/alter-Password.js
const app=getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd:'',
    newPwd:'',
    whatPwd:'',
    aginPewPwd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({whatPwd:options.pwd})
  },
  oldPwd:function(e){
    this.setData({
      pwd:e.detail.value
    })
  },
  newPwd: function (e) {
    this.setData({
      newPwd: e.detail.value
    })
  },
  aginNewPwd: function (e) {
    this.setData({
      aginPewPwd: e.detail.value
    })
  },
  subMit:function(e){
    var that=this;
    if (that.data.aginPewPwd !== that.data.newPwd){
      wx.showToast({
      title: '两次输入不一致',
      icon:'none'
    }) 
    return false;
    }
    var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    var userId = wxPrevPage.data.userInfo.userId;
    var urls='';
    if (that.data.whatPwd =='loginPwd'){
      urls=  ''
    } else if (that.data.whatPwd == 'payPwd'){
      urls=app.url + '/v1/student/update/studentTraderPasswordByUserId'
    }
    wx.request({
      url:urls,
      method: 'GET',
      data: {
        'userId': userId,
        'passWord': that.data.newPwd,
      },
      success: function (res) {
        if (res.data.code == '10000') {
          var studentType = wxPrevPage.data.userInfo.studentType;
          wx.redirectTo({
            url: '../../../pages/my/myEditor-Personal/myEditor-Personal?userId=' + userId + '&studentType=' + studentType,
          })
        }
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