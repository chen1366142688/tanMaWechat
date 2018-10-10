const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    paramInfo: {},
    htmlUrl: app.htmlUrl, //全局的h5网页的网址
    userId: '',
    classId: '',
    isLogin: '0',
    studentId: '',
    userName: '',
    token: '',
    time:'',
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classId: options.classId,
    })
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
          return;
        }
      }
    });
    let isLogin = wx.getStorageSync('userInfo').userType.substr(1, 1);
    let userName = "";
    let studentId = "";
    if (isLogin == '0') {
      wx.getUserInfo({
        success: function (e) {
          let dataInfo = JSON.parse(e.rawData);
          console.log(dataInfo);
          userName = dataInfo.nickName;//微信昵称
        }
      });
    } else {
      studentId = wx.getStorageSync("studentBaseInfo").roleId;
    }
    this.setData({
      userId: wx.getStorageSync('userInfo').userId,
      isLogin: isLogin,
      studentId: studentId,
      userName: userName,
      token: wx.getStorageSync('userInfo').token,
      time: new Date().getTime(),
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
    if (this.data.isLogin == '0') {
      wx.login({
        success: res => {
          wx.request({
            url: app.url + '/v1/login/wechart/getUserInfo',
            data: {
              code: res.code,
              appType: '1'
            },
            success: (res) => {
              if (res.data.code == '10000') {
                var result = res.data.response;
                wx.setStorageSync("userInfo", result);
                //判断是否是新用户
                if (result.userType.substr(1, 1) == 1) {
                  wx.request({
                    url: app.url + '/v1/student/getStudentStorageInfoByUserId',
                    data: {
                      "userId": wx.getStorageSync("userInfo").userId
                    },
                    method: 'GET',
                    header: { 'token': wx.getStorageSync('userInfo').token },
                    success: (res) => {
                      if (res.data.code == '10000') {
                        var data = res.data.response;
                        wx.setStorageSync('studentBaseInfo', data);
                      }
                    },
                    fail: (info) => {
                      wx.showToast({
                        title: '获取您的信息失败，请刷新重试',
                        icon: none
                      })
                    }
                  })

                  // wx.redirectTo({
                  //   url: '../../../pages/Introduction/Introduction'
                  // });
                }
              }
            },
            fail: (info) => {
            }
          })
        }
      });
    }
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
  
  }
})