// pages/curriculum/Training-Protocol/Training-Protocol.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    content:'这是内容的不是科技部打开失败',
    orderCode:'1047439375721231021'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.setData({ orderCode: options.orderCode})
  },
  pushText:function(e){
    this.setData({content:e.detail.value})
  },
  submits:function(e){
    var that=this;
    wx.request({
      url: app.url+'/v1/order/updateOrderCoachInfo',
      method:'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data:{
        'orderCode': that.data.orderCode,
        'personalPlan':that.data.content
      },
      success:function(res){
        if(res.data.code=='10000'){
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: '提交失败',
            icon:'none'
          })
        }
      },
      fail(info){
        wx.showToast({
          title: info.data.msg,
          icon:'none'
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