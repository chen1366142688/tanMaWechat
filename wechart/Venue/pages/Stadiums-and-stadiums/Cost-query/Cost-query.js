// pages/Cost-query/Cost-query.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeId: "",
    url: app.imgUrl,
    height: '1200',
    scrollTop: 0,
    pageNumber: '1',
    theNumber: '10',
    orderHomeListForDay: [],
    lastFoot: '已经到底了~',
    lastFootShow: false,
    Period: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that=this;
    app.noType();
    that.setData({
      homeId: wx.getStorageSync('homeId'),
      Period: 0,
      height: 1200
    });

    getOrderHomeListForDay(that);
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
  
  },


  //往上滑动时显示上面的样式
  scroll: function (e) {
  },
  //往下拉到顶部的样式
  scrolltoupper: function (e) {

  },
  //回到顶部
  toTop: function (e) {
    var that = this;
    that.setData({
      scrollTop: that.scrollTop / 0
    })
  },
  //下拉到底部加载更多
  scrolltolower: function (e) {
    if (this.data.lastFootShow) {
      return false;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    getOrderHomeListForDay(that);

  },
})


function getOrderHomeListForDay(vm) { //查询
  wx.request({
    url: app.url + '/v1/order/getOrderHomeListForDay',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      "homeId": vm.data.homeId,
      "pageNumber": vm.data.pageNumber,
      "theNumber": vm.data.theNumber,
    },
    success: (res) => {
      wx.hideLoading();
      if (res.data.code == '30005') {
        //跳转到注册页  
        wx.redirectTo({
          url: "../../../pages/Stadiums-and-stadiums/venue-register/venue-register"
        });
        return;
      }
      if (res.data.code == '10000') {
        var data = res.data.response;
        if (data.length == 0 && vm.data.pageNumber == 1) {
          vm.setData({
            Period: 1,
            lastFootShow: false,
            height: 0
          })
          return false;
        }
        if (data.length < vm.data.theNumber) {
          wx.showToast({
            title: '已经到底了~',
          })
          vm.setData({
            lastFootShow: true,
          })
        }
        var thisData = vm.data.orderHomeListForDay.concat(data);
        var thisPageNumber = vm.data.pageNumber;
        thisPageNumber++;
        vm.setData({
          orderHomeListForDay: thisData,
          pageNumber: thisPageNumber,
          Period: 0,
          height: 1200
        })

      } else {
        console.log(res.data.msg)
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
}