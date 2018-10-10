// pages/My/alter-Name/alter-Name.js
let utils = require("../../../utils/util.js");
let http = utils.http;
let appUrl = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    teacherId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      teacherId: wx.getStorageSync("userInfo").teacherId,
      name : options.userName
    })
    if (options.userName) {
      wx.setNavigationBarTitle({
        title: '修改姓名'
      })
      
    }else{
      this.setData({
        holder: '请输入姓名'
      })
    }
  },
  userName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  sendclk: function(res) {
    var that = this;
    let user = wx.getStorageSync("userInfo")
    user.name = this.data.name
    wx.setStorageSync("userInfo", user)
    wx.showToast({
      title: "修改成功",
      icon: 'success',
      success: () => {
        setTimeout(function () {
          wx.switchTab({
            url: '../../myInfo/myInfo',
          })
        }, 500)
      }
    })
  },
  subName: function(e) {
    var that = this;
    var teacherId = this.data.userId;
    var name = this.data.name;
    var data = {
      'teacherId': this.data.teacherId,
      'name': this.data.name
    };
    http("/v1/auth/update/teacher", data, "GET", this.sendclk);

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})