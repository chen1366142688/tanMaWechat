// pages/login/Binding/Binding.js
const app = getApp().globalData
Page({
  data: {
    imgUrl:app.url,
    phoneNo:'',
    pwd:''
  },
  onLoad: function (options) {
  
  },
  inputPhone(e){
    this.setData({phoneNo:e.detail.value})
  },
  inputPwd(e){
    this.setData({ pwd: e.detail.value })
  },
  BindAccount(e){
    const that = this;
    let phoneNo = that.data.phoneNo;
    let pwd = that.data.pwd;
  },
  ForgetPassword(e){
    wx.navigateTo({
      url: '../../../pages/login/Forget-Password/Forget-Password',
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})