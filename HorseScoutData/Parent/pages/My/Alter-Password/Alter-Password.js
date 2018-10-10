// pages/My/Alter-Password/Alter-Password.js
Page({
  data: {
    oldPwd:''
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  oldPwd(e){
    this.setData({oldPwd:e.detail.value})
  },
  nextstep(e){
    if (this.data.oldPwd.length > 6 && this.data.oldPwd.length<18){
      wx.navigateTo({
        url: '../../../pages/My/Alter-New-Password/Alter-New-Password?oldPwd=' + this.data.oldPwd,
      })
    }else{
      wx.showToast({
        title: '请输入原始密码',
        icon:'none'
      })
    }
  },
})