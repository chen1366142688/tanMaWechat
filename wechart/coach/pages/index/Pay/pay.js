// pages/index/Pay/pay.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    homeId:'',
    homeName:"",
    attendId:"",
    courseCount: "",//课时数量 如果是线上开课 则比传 ,
    courseTime: "",//课时时长 如果是线上开课 则比传 ,
    homeItemCount: 1,//使用场地数量
    homeItemTime: 1,//场地使用时长 
    itemId:"",
    itemName:"",
    onlineAttend:"",
    selectItemCount: [1, 2, 3, 4, 5, 6, 7, 8],//使用场地数量
    selectItemTime: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],//使用场地数量
    homeItemArray:[],
    itemMemberPrice:0,
    itemDefaultPrice:0,
    totlePrice:0
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
 
  bindPickerChangeItem: function (e) {
    this.setData({
      itemName: this.data.homeItemArray[e.detail.value].itemName,
      itemId: this.data.homeItemArray[e.detail.value].itemId,
      itemMemberPrice: this.data.homeItemArray[e.detail.value].itemMemberPrice,
      itemDefaultPrice: this.data.homeItemArray[e.detail.value].itemDefaultPrice
    })
    getTotalPrice(this);
  },

  bindPickerChangeTime: function(e){
    this.setData({
      homeItemTime: this.data.selectItemTime[e.detail.value]
    })
    getTotalPrice(this);
  },

  bindKeyInput: function (e) {
    this.setData({
      homeItemTime: e.detail.value
    })
    getTotalPrice(this);
  },

  toPayPrice:function(e){
    let that = this;
    if (that.data.totlePrice <= 0) {
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
        
      }else{
        wx.showToast({
          title: '请填写完整的缴费内容！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }

    let dataTemp = null;
    if (this.data.attendId == "" || this.data.attendId == 0 ){
      dataTemp={
        homeId: this.data.homeId,
        homeItemCount: this.data.homeItemCount,
        homeItemTime: this.data.homeItemTime*10,
        itemId: this.data.itemId,
        onlineAttend: "0"
       }
    }
    wx.request({
      url: app.url + '/v1/order/createOrderHome',
      method: 'POST',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: dataTemp ,
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
                if (that.data.attendId == "" || that.data.attendId == 0 ){
                    wx.navigateTo({
                      url: '../payment1/payment1'
                    })
                 }
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
      homeId: options.homeId
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
    getItemList(that);
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


function getItemList(that) {
  wx.request({
    url: app.url + '/v1/home/get/gymIinfoByHomeId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      homeId:that.data.homeId
    },
    success: function (res) {
      console.log(res)
      if (res.data.code == '10000') {
        that.setData({
          homeItemArray: res.data.response.supportItems,
          homeName: res.data.response.homeName,
          itemName: res.data.response.supportItems[0].itemName,
          itemId: res.data.response.supportItems[0].itemId,
          itemMemberPrice: res.data.response.supportItems[0].itemMemberPrice,
          itemDefaultPrice: res.data.response.supportItems[0].itemDefaultPrice
        })
        if (res.data.response.supportItems && res.data.response.supportItems.length > 0){
          that.setData({
            homeItemArray: res.data.response.supportItems,
            homeName: res.data.response.homeName
          })
        }
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

function getTotalPrice(that){
  if (that.data.attendId == "") {
     if (that.data.homeItemTime != ""
     && that.data.homeItemTime != 0
     && that.data.homeItemCount != "" 
     && that.data.homeItemCount != 0){
        that.setData({
          totlePrice: (that.data.itemMemberPrice * that.data.homeItemTime * that.data.homeItemCount / 100).toFixed(2)
        })
      }
   }
}