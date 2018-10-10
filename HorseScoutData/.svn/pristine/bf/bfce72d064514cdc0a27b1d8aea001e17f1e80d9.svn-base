// pages/login/login.js
let utils = require("../../utils/util.js");
const md5 = require('../../utils/md5.js');
let http = utils.http;
let that;
let appUrl = getApp().globalData.url;
const appKey = "5e37b2628ca29d1d";
const appSecret = "F76B9D9E0901665374A81A318395222811BC72DF";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'headline-border',
    coursepersonbnotice: '',
    loginPhone: '',
    loginPwd: '',
    avatar : "../../image/avatarinit.png"
  },
  //点击切换tabbar
  Register(e) {
    var val = e.currentTarget.dataset.val;
    var that = this;
    if (val == 1) {
      that.setData({
        coursepersona: 'headline-border',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 2) {
      that.setData({
        coursepersona: '',
        coursepersonbnotice: 'headline-border',
        trainingcourse: true,
        noticecoursetab: false,
      })
    }
  },
  // 联系客服
  ContactCustomerService(e) {
    wx.makePhoneCall({ //客服电话待定
      phoneNumber: '400-666-1816',//仅为示例，并非真实的电话号码
    })
  },
  //  输入手机号
  loginPhone(e) {
    this.setData({ loginPhone: e.detail.value })
    if (e.detail.value.length == 11){
      http("/v1/auth/login/getTeacherAvatarUrl", { phoneNum: e.detail.value},"GET",(that,res)=>{
        that.setData({
          avatar : res
        })
      },that)
    }
  },
  // 输入密码
  loginPwd(e) {
    this.setData({ loginPwd: e.detail.value })
  },
  // 登录按钮
  submitLogin(){
    if (this.data.loginPhone == ""){
      wx.showToast({
        title: "请输入手机号",
        icon: 'none'
      })
      return false
    }
    if (this.data.loginPwd == ""){
      wx.showToast({
        title: "请输入密码",
        icon: 'none'
      })
      return false
    }
    let pushData = {
      password: md5.hex_md5(this.data.loginPwd),
      userPhone: this.data.loginPhone,
      code : ""
    }
    http("/v1/auth/login/password", pushData, "POST", login,that)
  },
  // 清空密码
  deletePass(){
    this.setData({ loginPwd: "" })
  },
  // 清空账号
  deleteUser(){
    // console.log(11)
    this.setData({ loginPhone: "" })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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

// 登录的回调
function login(that,res){
  // console.log(res)
  wx.setStorageSync("token", { token: res.oAuthTokenVO.token})
  wx.setStorageSync("userInfo", res)
  wx.switchTab({
    url: '../gradeTable/gradeTableIndex/gradeTableIndex',
  })
}