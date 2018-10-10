// pages/my/alter-Password/alter-Password.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    havePassword:true,
    pwd: '',
    newPwd: '',
    whatPwd: '',//修改得密码类型
    aginPewPwd: '',
    orgUserId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      havePassword: options.havePassword == 1?true:false,
         orgUserId: options.orgUserId
      })
    wx.setNavigationBarTitle({
      title: (options.havePassword == 1 ? "修改密码" : "设置密码")
    })
  },
  oldPwd: function (e) {
    this.setData({
      pwd: e.detail.value
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
  subMit: function (e) {
    var that = this;
    let oldPassword = that.data.pwd.trim();
    let newPassword = that.data.newPwd.trim();
    let aginpassword = that.data.aginPewPwd.trim();
    if (that.data.havePassword){
      if (oldPassword == ''){
        wx.showToast({
          title: '请输入旧密码！',
          icon: 'none'
        })
        return false;
      }
      if (oldPassword.length < 6 || oldPassword.length > 20){
        wx.showToast({
          title: '旧密码长度应该在6到20位之间！',
          icon: 'none'
        })
        return false;
      }
    }
    if (newPassword == ''){
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none'
      })
      return false;
    }
    if (aginpassword == '') {
      wx.showToast({
        title: '请输入确认新密码！',
        icon: 'none'
      })
      return false;
    }
    if (newPassword !== aginpassword) {
      wx.showToast({
        title: '两次输入的新密码不一致!',
        icon: 'none'
      })
      return false;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      wx.showToast({
        title: '新密码长度应该在6到20位之间！',
        icon: 'none'
      })
      return false;
    }
    let data = {
      newPassword : newPassword,
      oldPassword : oldPassword,
      update : that.data.havePassword,
      userId:  that.data.orgUserId
    }
    wx.request({
      url: app.url + '/v1/coach/update/coachTraderPasswordByOrgUserId',
      method: 'POST',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: data,
      success: function (res) {
        if (res.data.code == '10000') {
          wx.showToast({
            title: '操作成功!',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function (info) {
        console.log(info)
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