// pages/My/alter-password/alter-password.js
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
  oldPass(e){
    // console.log(e.detail.value)
    this.setData({
      oldPass: e.detail.value
    })
  },
  subName(){
    let oldObj = {
      oldPassWord: md5.hex_md5(this.data.oldPass),
      teacherId: wx.getStorageSync("userInfo").teacherId
    }
    http("/v1/auth/check/oldpassword",oldObj,"POST",(that,res)=>{
      wx.navigateTo({
        url: '../alter-cipher/alter-cipher?oldPassWord=' + oldObj.oldPassWord,
      })
    },that)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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