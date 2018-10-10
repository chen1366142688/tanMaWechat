// pages/my/my-index/my-index.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    userInfo: {},
    url: app.imgUrl,
    cost: [
      { name: '我的课程', value: app.imgUrl + 'myCurriculum.png' },
      { name: '我的收藏', value: app.imgUrl + 'myCollection.png' },
      // { name: '账户明细', value: app.imgUrl + 'myAccount.png' },
      { name: '系统通知', value: app.imgUrl + 'myNotice.png' },
      { name: '我的消息', value: app.imgUrl + 'mySetting.png' },
      { name: '意见建议及需求', value: app.imgUrl + 'opinion.png' },
      // { name: '新手帮助', value: app.imgUrl + 'myHelp.png' }
    ],
    notice: '',
    paddingBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userInfo').userId
    });
    // let userInfo=wx.getStorageSync()
    // if (userInfo && userInfo.userType.substr(1, 1) == '0') {
      
    // }

  },
  telephone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-666-1816' //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //跳转到个人信息
  edtiorMy: function (e) {
    var userId = this.data.userId;
    var studentType = this.data.userInfo.studentType;
    wx.navigateTo({
      url: '../../../pages/my/myEditor-Personal/myEditor-Personal?userId=' + userId + '&studentType=' + studentType,
    })
  },
  //跳转到我的评级
  myLevel: function (e) {
    /* myrating h5界面
       myratingstu 小程序界面
   */
    wx.navigateTo({
      url: '../../../pages/my/myrating/myrating',
      //url: '../../../pages/my/myratingstu/myrating'
    })
  },
  //跳转到账户明细
  headerChirden: function (e) {
    wx.navigateTo({
      url: '../../../pages/my/accountdetails/accountdetails',
    })
  },
  //跳转到我的课程
  mycurriculum: function (e) {
    console.log(e.currentTarget.dataset.costname)
    var name = e.currentTarget.dataset.costname;
    var userId = this.data.userId;
    switch (name) {
      case '我的课程':
        wx.navigateTo({
          url: '../../../pages/changGuan/c-VenueOrder/c-VenueOrder?userId=' + userId,
        })
        break;
      case '我的收藏':
        wx.navigateTo({
          url: '../../../pages/changGuan/c-VenueCollection/c-VenueCollection?userId=' + userId,
        })
        break;
      case '账户明细':
        wx.navigateTo({
          url: '../../../pages/my/accountdetails/accountdetails?userId=' + userId,
        })
        break;
      case '系统通知':
        wx.navigateTo({
          url: '../../../pages/my/systematicnotification/systematicnotification?userId=' + userId,
        })
        break;
      case '我的消息':
        wx.navigateTo({
          url: '../../../pages/new/new-index/news-index',
        })
        break;
      case '意见建议及需求':
        wx.navigateTo({
          url: '../../../pages/User-Feedback/User-Feedback?userId=' + userId,
        })
        break;
      case '新手帮助':
        wx.navigateTo({
          url: '../../../pages/my/newhandhelper/newhandhelper?userId=' + userId,
        })
        break;
    }
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
    if (wx.getStorageSync('userInfo').userType) {
      let userType = wx.getStorageSync("userInfo").userType;
      let isOldUser = userType ? userType.substr(1, 1) : "";
      if (isOldUser == '1') {
        queryUserInfo(this);
        notice(this);
      }else{
        wx.redirectTo({
          url: "../../../pages/register/register?noBack=true"
        });
      }
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
})

function queryUserInfo(that) {
  wx.request({
    url: app.url + '/v1/student/get/studentSimpleInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.redirectTo({
          url: "../../../pages/register/register?noBack=true"
        });
        return;
      }
      if (res.data.code == '10000') {
        let tempUser = res.data.response;
        tempUser.spareCost = (tempUser.spareCost / 100).toFixed(2);
        // tempUser.nickName = tempUser.nickName.length > 3 ? tempUser.nickName.substr(0, 2) + '...' : tempUser.nickName;
        tempUser.phoneNo = tempUser.phoneNo.length > 10 ? tempUser.phoneNo.substr(0, 3) + '******' + tempUser.phoneNo.substr(9, 2) : tempUser.phoneNo;
        console.log(tempUser.gradeVos.length)
        if (tempUser.gradeVos.length == 3 || tempUser.gradeVos.length == 4){
          that.setData({ paddingBottom: 40 })
        }
        else if (tempUser.gradeVos.length == 5 || tempUser.gradeVos.length == 6){
          that.setData({ paddingBottom: 104 })
        }
        else if (tempUser.gradeVos.length == 7 || tempUser.gradeVos.length == 8) {
          that.setData({ paddingBottom: 168 })
        }
        // tempUser.gradeVos.length > 4 && tempUser.gradeVos.length <= 6 ? that.setData({ paddingBottom: 60 }) : tempUser.gradeVos.length > 6 ? that.setData({ paddingBottom: 100 }) : that.setData({ paddingBottom: 0 })
        that.setData({
          userInfo: tempUser
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
function notice(that) {
  wx.request({
    url: app.url + '/v1/student/get/studentNotReadNoticeByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      "userId": that.data.userId,
      "userType": "0"
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.redirectTo({
          url: "../../../pages/register/register?noBack=true"
        });
        return;
      }
      if (res.data.code == '10000') {
        that.setData({
          notice: res.data.response
        })
      }
    },
    fail: function (e) {
      wx.showToast({
        title: '获取失败',
      })
    }
  })
}