// pages/My/alter-cipher/alter-cipher.js
let utils = require("../../../utils/util.js");
let http = utils.http;
let that = this;
const md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  resetPass(e){
    this.setData({
      resetPass: e.detail.value
    })
  },
  newPass(e){
    this.setData({
      newPass: e.detail.value
    })
  },
  subName(){
    if (this.data.newPass != this.data.resetPass){
      wx.showToast({
        title: "两次密码不一致",
        icon: 'none'
      })
      return false
    }
    if (CheckPassWord(this.data.newPass)) {
      console.log("密码ok")
    } else {
      wx.showToast({
        title: '密码必须是6-18位的数字和字母组合！',
        icon: 'none'
      })
      return false;
    }
    let newObj = {
      teacherId : wx.getStorageSync("userInfo").teacherId,
      newPassWord: md5.hex_md5(this.data.newPass),
      oldPassWord: this.data.oldPassWord
    }
    http("/v1/auth/update/password",newObj,"POST",(res)=>{
      wx.showToast({
        title: "修改成功",
        icon: 'success',
        success:()=>{
          setTimeout(function(){
            wx.switchTab({
              url: '../../myInfo/myInfo',
            })
          },500)    
        }
      })
      
    },that)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      oldPassWord: options.oldPassWord
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

//验证密码字母加数字
function CheckPassWord(password) {//必须为字母加数字且长度不小于8位
  var str = password;
  if (str == null || str.length < 6) {
    return false;
  }
  var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
  if (!reg1.test(str)) {
    return false;
  }
  var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}