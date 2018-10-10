// pages/keChen/paymentsuccessfully/paymentsuccessfully.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode:"",
    homeName:"",
    classTutors:"",
    orderDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderCode : options.orderCode
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
    queryOrderDetail(this);
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


  changto: function(e){
    let totype = e.currentTarget.dataset.type;
    if(totype == 'index') {
      wx.switchTab({
        url: "../../../pages/keChen/keChen-index/keChen-index"
      });
    }else if(totype == 'order') {
      wx.redirectTo({
        url: "../../../pages/changGuan/c-VenueOrder/c-VenueOrder"
      });
    }else if(totype == 'class') {
      wx.navigateBack({
        delta: 1
      })
    }
  }

})


function queryOrderDetail(that) {
  wx.request({
    url: app.url + '/v1/order/getOrderDetailForStudent',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      orderCode: that.data.orderCode
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
        queryClassDetail(that,res.data.response.classId);
          that.setData({
            orderDetail: res.data.response
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


function queryClassDetail(that, classId) {
  wx.request({
    url: app.url + '/v1/class/getClassDetail',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      classId: classId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let classInfo = res.data.response;
        // let classTutorsTemp = classInfo.classTutors;
        // let allClassTutors = "";
        // if (classTutorsTemp && classTutorsTemp.length > 0) {
        //   for (let i = 0; i < classTutorsTemp.length; i++) {
        //     if (classTutorsTemp[i].nickName && classTutorsTemp[i].nickName.length > 2) {
        //       classTutorsTemp[i].nickName = classTutorsTemp[i].nickName.substr(0, 2) + "...";
        //     }
        //     allClassTutors = allClassTutors + classTutorsTemp[i].nickName;
        //   }
        // }
        that.setData({
          classTutors: classInfo
        })

        if (classInfo.homeName.length > 30) {
          classInfo.homeName = classInfo.homeName.substr(0, 30) + "...";
        }
        that.setData({
          homeName: classInfo.homeName
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