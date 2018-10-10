// pages/my/set/set.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    version:'1.0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //切换到学员端
  student(e){
    console.log("点击的学员端")
    wx.navigateToMiniProgram({
      appId: 'wxa17fe5aa089f046e',
      path: 'pages/keChen/keChen-index/keChen-index?userInfo='+wx.getStorageSync('userInfo').userId,
      extraData: {
        userInfo: wx.getStorageSync('userInfo')
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log("打开学员端成功")
      },
      fail(){
        console.log("打开学员端失败")
      }
    })
  },
  //切换到场馆端
  Venue(e) {
    console.log("点击的场馆端")
    wx.navigateToMiniProgram({
      appId: 'wx2cd75bb48408e71b',
      path: 'pages/Stadiums-and-stadiums/Introduction/Introduction?userInfo=' + wx.getStorageSync('userInfo').userId,
      extraData: {
        userInfo: wx.getStorageSync('userInfo')
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log("打开场馆端成功")
      },
      fail() {
        console.log("打开场馆端失败")
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
    getVision(this)
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
//获取系统版本号
function getVision(that){
  wx.request({
    url: app.url+'/v1/system/get/systemVision',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {},
    success:function(res){
      console.log(res)
      if(res.data.code=='10000'){
        that.setData({version:res.data.response})
      }
    }
  })
}