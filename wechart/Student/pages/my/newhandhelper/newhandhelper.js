// pages/my/alter-phone/alter-phone.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newfist: [], //帮助数组  
    newfistdetail: {}  //详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    queryClassList(that);    //帮助列表 帮助大类一 帮助子标题
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

//帮助列表 帮助大类一 帮助子标题
function queryClassList(that) {
  wx.request({
    url: app.url + '/v1/help/get/studentHelp',
    // header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'post',
    data: {},
    success: function (res) {
      //console.log("1211请求成功，下面是返回的额参数")
      console.log(res.data)
      console.log(res.data.response)
      if (res.data.code == "10000") {
        var result = res.data.response || [];
        console.log(result);
        console.log('101')
        if (result.length == 0) {
          console.log('1')
          /* wx.showToast({
             title: '',
             icon: 'success',
             duration: 2000
           }) */
        }
        
        that.setData({
          newfist: res.data.response, //通知 
          //newfistdetail: res.data.response.helpDetail //详情
        })

      }
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })


}



