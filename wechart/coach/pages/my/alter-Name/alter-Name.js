// pages/my/alter-Name/alter-Name.js
var util = require('../../../utils/util.js');
const app = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    nickName:'',
    prevPage:{},
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options:options})
    wx.setNavigationBarTitle({
      title: options.classType==3?'修改机构名称':'修改昵称'
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
    this.setData({ nickName: prevPage.coachInfo.nickName, prevPage: prevPage})
  },
  userNameInput(e){
    this.setData({nickName:e.detail.value})
  },
  sunMit:function(e){
    console.log("what")
    var that=this;
    if (!that.data.nickName){
      wx.showToast({
      title: '请输入昵称',
    })
    return false;
    }
    wx.request({
      url: app.url +'/v1/coach/update/coachNickNameByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data:{
        'userId': wx.getStorageSync('userInfo').userId,
        'nickName': that.data.nickName
      },
      success:function(res){
        if(res.data.code=='10000'){
          wx.navigateBack({
            delta: 1
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})