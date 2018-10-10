// pages/my/Account-Details/Account-Details.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
      userId:"1",
      orderSpare:{},
      amount:0,
      pageNumber:1,
      theNumber:10,
      bookList:[],
      showNotMore:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  modalcnt: function () {
    wx.showModal({
      title: '提示',
      content: '提现锁定金额：本金额为申请提现正等待人工审核的这部分金额，如果审核通过则会转到您的微信账户，如果未通过，则回回到您的余额中。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  modalcnty: function () {
    wx.showModal({
      title: '提示',
      content: '未完结课程金额：您当前所学员未完结课程订单中,剩余课时对于的金额。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  modalcnte: function () {
    wx.showModal({
      title: '提示',
      content: '未完结课程金额：您当前所学员未完结课程订单总金额。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userId: userInfo.userId,
      bookList: [],
      showNotMore: false
    })
    queryCoachOrderSpare(this);
    queryCoachAccount(this);
    queryCoachAccountBookList(this)
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
    if (!this.data.showNotMore){
      this.setData({
        pageNumber: this.data.pageNumber+1
      });
      queryCoachAccountBookList(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toApply:function(){
    let that = this;
    wx.request({
      url: app.url + '/v1/coach/query/haveTraderPasswordByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'POST',
      data: {
        'userId': that.data.userId
      },
      success: (res) => {
        console.log("請求成功")
        if (res.data.code == '10000') {
          var havePassword = res.data.response;
          if (havePassword){
            wx.navigateTo({
              url: '../Withdraw-Deposit/Withdraw-Deposit'
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您还没有设置交易密码是否去设置！',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../../pages/my/alter-Password/alter-Password?havePassword=' + (havePassword == true ? 1 : 0),
                  })
                } else if (res.cancel) {

                }
              }
            })
          }
        }
      },
      fail: function (info) {
        console.log("請求失敗")
      }
    })
  }
})

function queryCoachOrderSpare(that){
  wx.request({
    url: app.url + '/v1/order/queryCoachOrderSpare',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      coachUserId: that.data.userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let tempInfo = res.data.response;
        tempInfo.courseCost = (tempInfo.courseCost/100).toFixed(2);
        tempInfo.spareCost = (tempInfo.spareCost / 100).toFixed(2);
        that.setData({
          orderSpare: tempInfo
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

function queryCoachAccount(that) {
  wx.request({
    url: app.url + '/v1/account/queryCoachAccount',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      userId: that.data.userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let tempInfo = res.data.response;
        tempInfo.amount = (tempInfo.amount / 100).toFixed(2);
        that.setData({
          amount: tempInfo.amount
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

function queryCoachAccountBookList(that) {
  wx.request({
    url: app.url + '/v1/account/queryCoachAccountBookList',
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      userId: that.data.userId,
      pageNumber: that.data.pageNumber,
      theNumber: that.data.theNumber
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let tempInfoList = res.data.response;
        if (tempInfoList.length < that.data.theNumber){
          that.setData({
             showNotMore:true
          })
        }
        for (let i = 0; i < tempInfoList.length;i++){
          tempInfoList[i].amount = (tempInfoList[i].amount/100).toFixed(2)
        }
        let oldList = that.data.bookList;
        oldList = oldList.concat(tempInfoList);
        that.setData({
          bookList: oldList
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