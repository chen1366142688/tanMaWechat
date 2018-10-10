// pages/my/systematicnotification/systematicnotification.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coursenewmessage: 'newmessage-content-littlea',  //通知的内容详细内容
    lastida: '', //自定义 通知的内容是否显示完整
    informfist: [],//通知，
    userId: '', //用户id
    targetId: '',
    noticeId: '',
    pageNo:1,
    haveData:true,
    width: 0,
    height: 0,
    more: false
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ userId: wx.getStorageSync('userInfo').userId });
  },
  onReady: function () {

  },
  onShow: function () {
    const that = this;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    wx.getSystemInfo({
      success(res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          pageNo: 1,
          informfist: [],
          more: false
        })
      }
    })
    selectstudentsInform(that, that.data.userId); //通知消息列表的数据查询，查询通知消息
  },
  scrolltolower() {
    const that = this;
    if (!that.data.more) {
      selectstudentsInform(that, that.data.userId);
    }
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

  /**
   * 展开的特效部分
   * 
   */

  coursenewevent: function (e) {
    const that=this;
    var index = e.currentTarget.dataset.index;
    var targetId = e.currentTarget.dataset.targetid
    var noticeId = e.currentTarget.dataset.noticeid
    var scanState = e.currentTarget.dataset.scanstate
      if (scanState=="01"){
        wx.request({
          url: app.url +'/v1/student/updateNoticeScanStatusByUserIdAndNoticeId',
          method:'GET',
          header: { 'token': wx.getStorageSync('userInfo').token },
          data:{
            "targetId": targetId,
            "noticeId": noticeId
          },
          success(res){
            console.log("修改状态")
            console.log(res)
          },
          fail(info){
            console.log(
              "ERROR"
            )
          }
        })
      }
      var informList = that.data.informfist;
        informList[index].show = !that.data.informfist[index].show
        informList[index].scanState = '02'
    that.setData({
      informfist: informList
    })
  }
})
function selectstudentsInform(that, userId) {
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.url + '/v1/student/get/studentAllNoticeByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'post',
    data: {
      "pageNo": that.data.pageNo,
      "pageSize": 10,
      'userId': userId,
      "userType":"0"
    },
    success: function (res) {
      wx.hideLoading();
      var noticeone = res.data.response;
      if (res.data.code == '10000') {
        var result = res.data.response || [];
        if (result.length == 0) {
          if (that.data.pageNo == 1) {
            wx.showToast({
              title: '暂无系统消息',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              haveData: false
            })
          } else {
            wx.showToast({
              title: '暂无更多系统消息',
              icon: 'none',
              duration: 1000
            })
            that.setData({ more: true })
            return false;
          }
        }else{
          if (that.data.pageNo > 1) {
            let list = that.data.informfist;
            list = list.concat(res.data.response)
            that.setData({
              informfist: list,
              pageNo: Number(that.data.pageNo) + 1,
              haveData: true
            })
            return;
          } else {
            that.setData({
              informfist: res.data.response,
              pageNo: Number(that.data.pageNo) + 1,
              haveData: true
            })
          } 
        }
      }
    },
    fail: function () {
      wx.hideLoading();
      console.log("请求失败request error")
      wx.showToast({
        title: '获取信息失败',
      })
    }
  })
}