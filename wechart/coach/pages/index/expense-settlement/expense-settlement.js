// pages/index/expense-settlement/expense-settlement.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    homeId: "",
    homeName: "",
    attendId: "",
    courseCount: "1",//课时数量 如果是线上开课 则比传 ,
    courseTime: "",//课时时长 如果是线上开课 则比传 ,
    homeItemCount: 1,//使用场地数量
    homeItemTime: 0,//场地使用时长 
    itemId: "",
    itemName: "",
    onlineAttend: "",
    selectItemCount: ['1', '2', '3', '4', '5', '6', '7', '8'],//使用场地数量
    itemMemberPrice: 0,
    itemDefaultPrice: 0,
    thisCourseTime:1,
    courseTimeList: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5,5],//使用场地数量
    totlePrice: 0
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },


  bindPickerChange: function (e) {
    this.setData({
      homeItemCount: this.data.selectItemCount[e.detail.value]
    });
    getTotalPrice(this);
  },
  bindCourseTimeChange: function (e) {
    this.setData({
      thisCourseTime: this.data.courseTimeList[e.detail.value]
    });
    getTotalPrice(this);
  },


  bindKeyInput: function (e) {
    this.setData({
      homeItemTime: e.detail.value
    })
    getTotalPrice(this);
  },

  toPayPrice: function (e) {
    let that = this;
    if (that.data.totlePrice <= 0){
      wx.showToast({
        title: '当前场馆暂不支持缴纳场馆费！',
        icon: 'none',
      })
      return false;
    }
    if (that.data.itemMemberPrice != 0
      && that.data.itemMemberPrice != ""
      && that.data.homeItemTime != ""
      && that.data.homeItemTime != 0
      && that.data.homeItemCount != ""
      && that.data.homeItemCount != 0) {

    } else {
      wx.showToast({
        title: '请填写完整的缴费内容！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    let dataTemp = {
      attendId: this.data.attendId,
      courseCount: this.data.courseCount,
      courseTime: this.data.courseTime,
      homeId: this.data.homeId,
      homeItemCount: this.data.homeItemCount,
      homeItemTime: this.data.thisCourseTime * 10,
      itemId: this.data.itemId,
      onlineAttend: "1"
    }
    wx.request({
      url: app.url + '/v1/order/createOrderHome',
      method: 'POST',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: dataTemp,
      success: function (res) {
        if (res.data.code == '10000') {
          wx.requestPayment(
            {
              'timeStamp': res.data.response.timeStamp,
              'nonceStr': res.data.response.nonceStr,
              'package': res.data.response.packageValue,
              'signType': res.data.response.signType,
              'paySign': res.data.response.paySign,
              'success': function (res) {
                wx.redirectTo({
                  url: '../payment/payment'
                })
              },
              'fail': function (res) {

              },
              'complete': function (res) {

              }
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      attendId: options.attendId,
      startTime: options.startTime
    })
    queryAttend(this);
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
    //queryAttend(that);
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


function queryAttend(that) {
  wx.request({
    url: app.url + '/v1/attend/getAttendDetail',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      attendId: that.data.attendId
    },
    success: function (res) {
      console.log(res)
      if (res.data.code == '10000') {
        that.setData({
          homeId: res.data.response.homeId,
          homeName: res.data.response.homeName,
          itemId: res.data.response.itemId,
          itemName: res.data.response.itemName,
          courseTime: res.data.response.courseTime,
          thisCourseTime: res.data.response.courseTime/10,
          homeItemTime: res.data.response.courseTime,
        })
        queryHomeItem(that);
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

function queryHomeItem(that) {
  wx.request({
    url: app.url + '/v1/home/get/getHomeItemInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      homeId: that.data.homeId,
      itemId: that.data.itemId,
      startTime: that.data.startTime
    },
    success: function (res) {
      console.log(res)
      if (res.data.code == '10000') {
        that.setData({
          itemMemberPrice: res.data.response.itemMemberPrice,
          itemDefaultPrice: res.data.response.itemDefaultPrice
        })
        getTotalPrice(that);
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

function getTotalPrice(that) {
  if (that.data.itemMemberPrice != 0
    && that.data.itemMemberPrice != ""
    && that.data.thisCourseTime != ""
    && that.data.thisCourseTime != 0
    && that.data.homeItemCount != ""
    && that.data.homeItemCount != 0) {
    console.log((that.data.itemMemberPrice * that.data.thisCourseTime * that.data.homeItemCount / 100).toFixed(2));
    that.setData({
      totlePrice: (that.data.itemMemberPrice * that.data.thisCourseTime * that.data.homeItemCount / 100).toFixed(2)
    })
  }
}