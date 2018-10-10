// pages/my/accountdetails/accountdetails.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    userId: "",
    amount:0,
    orderSpare:{},
    bookList:[],
    pageNumber: 1,
    theNumber: 15,
    showNotMore:false,
    Period:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userInfo').userId
    });
  },
  modalcnt: function () {
    wx.showModal({
      title: '提示',
      content: '剩余课时：为当前所有购买课程剩余课时之和。课程锁定金额：为所有已购课程还未完成课时对应的剩余金额。',
      showCancel:false,
      confirmText:'我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } ,
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
    this.setData({
      showNotMore: false,
      bookList:[],
      Period:0
    });
    queryStudentOrderSpare(this);
    queryStudentAccount(this);
    queryStudentAccountBookList(this);
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
    if (!this.data.showNotMore) {
      this.setData({
        pageNumber: this.data.pageNumber + 1
      });
      queryStudentAccountBookList(this);
    }
  },

})


function queryStudentOrderSpare(that) {
  wx.request({
    url: app.url + '/v1/order/queryStudentOrderSpare',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      studentUserId: that.data.userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == '10000') {
        let tempInfo = res.data.response;
        tempInfo.courseCost = (tempInfo.courseCost / 100).toFixed(2);
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

function queryStudentAccount(that) {
  wx.request({
    url: app.url + '/v1/account/queryStudentAccount',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      userId: that.data.userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
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

function queryStudentAccountBookList(that) {
  wx.request({
    url: app.url + '/v1/account/queryStudentAccountBookList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      userId: that.data.userId,
      pageNumber: that.data.pageNumber,
      theNumber: that.data.theNumber
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == '10000') {
        let tempInfoList = res.data.response;
        if (tempInfoList.length == 0 && that.data.pageNumber==1){
          that.setData({
            showNotMore: false,
            Period: 1
          })
          return false;
        }
        if (tempInfoList.length < that.data.theNumber) {
          that.setData({
            showNotMore: true,
            Period: 0
          })
        }
        for (let i = 0; i < tempInfoList.length; i++) {
          tempInfoList[i].amount = (tempInfoList[i].amount / 100).toFixed(2)
        }
        let oldList = that.data.bookList;
        oldList = oldList.concat(tempInfoList);
        that.setData({
          bookList: oldList,
          Period: 0,
          showNotMore: false
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