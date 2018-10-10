// pages/curriculum/Curriculum-Order/Curriculum-Order.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    userId:"",
    classList: [],
    Period:0,
    over:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //跳转到订单页面传用户ID和订单item
  orderItem:function(e){
    let that = this;
    var name=e.currentTarget.dataset.name;
    var maxNum = e.currentTarget.dataset.maxnum;
    var classId = e.currentTarget.dataset.classid;
    wx.setStorageSync("MY_CLASS_LIST_FOR_ORDER", classId);
      wx.navigateTo({
        url: '../../../pages/curriculum/c-VenueOrder/c-VenueOrder?classId=' + classId + '&name=' + name + '&nums=' + maxNum,
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
    let that = this;
    app.noType();
    let userInfo = wx.getStorageSync("userInfo");
    that.setData({
      userId: userInfo.userId,
    })
    if (wx.getStorageSync("MY_CLASS_LIST_FOR_ORDER") && wx.getStorageSync("MY_CLASS_LIST_FOR_ORDER") != ""){
      wx.setStorageSync("MY_CLASS_LIST_FOR_ORDER", "");
      if(that.data.classList.length==0){
        queryClassList(that);
      }
    }else{
      that.setData({
        classList: [],
        Period:0,
        over:0
      })
      queryClassList(that);
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
  onShareAppMessage: function () {
  
  }
})

function queryClassList(that) {
  wx.request({
    url: app.url + '/v1/class/getCoachClassOrder',
    method: 'GET',
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: function (res) {
      if (res.data.code == '10000') {
        let tempList = res.data.response;
        if(tempList.length==0){
          that.setData({ Period: 1, over:0})
          return false;
        }
        for (let i = 0; i < tempList.length; i++) {
          tempList[i].itemStudentGrade = 'L' + tempList[i].itemStudentGrade.replace(new RegExp(",", 'g'), "L");
        }
        let oldList = that.data.classList;
        oldList = oldList.concat(tempList);
        that.setData({
          classList: oldList,
          Period:0,
          over:1
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}