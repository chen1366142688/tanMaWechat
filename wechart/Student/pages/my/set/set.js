// pages/my/set/set.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    version: '1.0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //切换到教练端
  coach(){
    wx.navigateToMiniProgram({
      appId: 'wx378740f432235c5b',
      path: 'pages/index/scheduleIndex/scheduleindex?userId=' + wx.getStorageSync('userInfo').userId,
      extraData: {
        userInfo: wx.getStorageSync('userInfo')
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        wx.showToast({
          title: '打开教练端成功',
        })
      },
      fail(info){
        wx.showToast({
          title: '打开教练端失败',
        })
      }
    })
  },
  //切换到场馆端
  venue() {
    wx.navigateToMiniProgram({
      appId: 'wx2cd75bb48408e71b',
      path: 'pages/Stadiums-and-stadiums/Introduction/Introduction?userId=' + wx.getStorageSync('userInfo').userId,
      extraData: {
        userInfo: wx.getStorageSync('userInfo')
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        wx.showToast({
          title: '打开场馆端成功',
        })
      },
      fail(info) {
        wx.showToast({
          title: '打开场馆端失败',
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
    var vm=this;
    getVision(vm);
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
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
})
//获取系统版本号
function getVision(that) {
  wx.request({
    url: app.url + '/v1/system/get/systemVision',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {},
    success: function (res) {
      console.log(res)
      if (res.data.code == '10000') {
        that.setData({ version: res.data.response })
      }
    }
  })
}