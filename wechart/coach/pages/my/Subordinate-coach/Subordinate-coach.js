// pages/my/Subordinate-coach/Subordinate-coach.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    right: 420,
    value: '',
    coachList: [],
    height: 0,
    pageNumber: 1,
    theNumber: 10,
    authStatus: "",
    classId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //屏幕高度
    var res = wx.getSystemInfoSync()
    this.setData({ height: res.windowHeight - 44 })
  },

  inputContent(e) {
    this.setData({ value: e.detail.value })
  },
  search() {
    wx.navigateTo({
      url: '../../../pages/my/Subordinate-coach/Subordinate-coach?nickName=' + this.data.value,
    })
  },
  coachItem(e) {
    this.setData({ coachId: e.currentTarget.dataset.coachid })
    wx.navigateTo({
      url: '../../../pages/my/coach-particulars/coach-particulars?coachId=' + e.currentTarget.dataset.coachid,
    })
  }, 
  longpress(e){
    console.log(e.currentTarget.dataset.coachid)
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定解绑教练吗？',
      success: function (res) {
        if (res.confirm) {
          if (wx.getStorageSync('userInfo').userId == coachid) {
            wx.showToast({
              title: '本人不能解绑',
            })
            return false;
          }
          console.log('用户点击确定')
          wx.request({
            url: app.url + '/v1/coach/cancelCoachBelongForMyCoach',
            header: { 'token': wx.getStorageSync('userInfo').token },
            method: 'GET',
            data: { coachUserId: e.currentTarget.dataset.coachid },
            success(res) {
              if (res.data.code == '10000') {
                wx.showToast({
                  title: '解绑成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '解绑失败，请稍后再试',
                })
              }
            }, fail(info) {
              wx.showToast({
                title: '网络异常，请稍后再试！',
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addCoach(e){
    wx.navigateTo({
      url: '../../../pages/my/Accretion-coach/Accretion-coach',
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
    //学员列表
    coachList(this);
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

//请求教练基本信息
function coachList(that) {
  wx.request({
    url: app.url + '/v1/coach/getCoachInfoListForMyCoach',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {},
    success(res) {
      if (res.data.code == '10000') {
        that.setData({
          coachList: res.data.response
        })
      } else {
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
      }
    },
    fial(info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
}
