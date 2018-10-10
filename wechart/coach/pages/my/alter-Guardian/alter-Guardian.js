// pages/my/alter-Guardian/alter-Guardian.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    name:'',
    userNum:'',
    prevPage:{},
    realStatus:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      realStatus: options.realStatus
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
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2].data;  //上一个页面
    this.setData({
      name: prevPage.coachInfos.realName ,
      userNum: prevPage.coachInfos.identityCode ,
      prevPage: prevPage
    })
  },
  userNameInput:function(e){
    this.setData({ name:e.detail.value})
  },
  usershenFen:function(e){
    this.setData({ userNum: e.detail.value })
  },
  subMit:function(e){
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!regIdNo.test(this.data.userNum)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的身份证号',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return false;
    }  
    wx.request({
      url: app.url + '/v1/coach/update/coachRealNameAndCodeIdByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        'userId': wx.getStorageSync('userInfo').userId,
        'realName': this.data.name,
        'identityCode': this.data.userNum
      },
      success: function (res) {
        if(res.data.code=='10000'){
          wx.showToast({
            title: '操作成功!',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})