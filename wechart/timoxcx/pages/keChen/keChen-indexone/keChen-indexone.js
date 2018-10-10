// pages/keChen/keChen-index/keChen-index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: 1,
    showScroll: 0,
    showHeader: 1,
    height: 760,
    showchang: 0,
    modal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scroll: function (e) {
    var that = this;
    if (e.currentTarget.offsetTop > 5) {
      that.setData({
        show: 0,
        showScroll: 1,
        showHeader: 0,
        height: 940
      })
    }
  },
  scrolltoupper: function (e) {
    var that = this;
    that.setData({
      show: 1,
      showScroll: 0,
      showHeader: 1,
      height: 760
    })
  },
  bust: function (e) {
    let _this = this;
    _this.setData({
      showchang: 1,
      show: 0,
      showScroll: 1,
      showHeader: 0,
      modal: 'modal'
    })
  },
  hideModal: function (e) {
    let _this = this;
    _this.setData({
      showchang: 0,
      show: 1,
      showScroll: 0,
      showHeader: 1,
      modal: ''
    });
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