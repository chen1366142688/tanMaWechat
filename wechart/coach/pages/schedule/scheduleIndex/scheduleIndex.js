// pages/index/scheduleIndex/scheduleindex.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'course-head-ad',
    coursepersonbnotice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  kecheng: function (e) {
    var val = e.currentTarget.dataset.val;
    console.log(val)
    var that = this;
    if (val == 1) {
      console.log(111)
      that.setData({
        coursepersona: 'course-head-ad',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 2) {
      console.log(222)
      that.setData({
        coursepersona: '',
        coursepersonbnotice: 'course-head-ad',
        trainingcourse: true,
        noticecoursetab: false,
      })
    }
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
  // Addition:function(e){

  // }
  //回到顶部
  toTop: function (e) {
    var that = this;
    that.setData({
      scrollTop: that.scrollTop / 0
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