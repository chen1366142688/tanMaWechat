// pages/competition/competition-detail/competition-detail.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    organizationId:0,
    activityDetail:{},
    token: "",
    userName: "",
    avatarUrl: "",
    userId: wx.getStorageSync('userInfo').userId,
    phoneNo:"",
    needRegister:0,
    signupList:[],
  },
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    var organizationId = options.organizationId;
    console.log(organizationId);
    if (organizationId && organizationId != "" && organizationId != 0 && organizationId!='undefined'){
      this.setData({
        organizationId: organizationId
      })
    } else if (scene && scene != '' && scene != 0 && scene != 'undefined'){
      this.setData({
        organizationId: scene
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  toSignResult:function(e){
    let cpuserid = e.currentTarget.dataset.cpuserid;
    let competitionid = e.currentTarget.dataset.competitionid;
    let signuptype = e.currentTarget.dataset.signuptype;
    toSignResult(this, cpuserid, competitionid, signuptype);
  },

  bindGetUserInfo: function (e) {
    var vm = this;
    var that = this;
    let userType = wx.getStorageSync("userInfo").userType;
    var isOldUser = userType ? userType.substr(1, 1) : "";
    //判断是否是登录过的用户  登录过的用户 直接进入登录流出
    if (isOldUser == '1' || isOldUser == '0') {
      toCompetitionIndex(that)
      return false;
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
          let encryptedData = e.detail.encryptedData;
          let iv = e.detail.iv;
          wx.login({
            success: res => {
              login(res.code, '1', vm, encryptedData, iv);
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '小程序需要你的授权才能使用',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({});
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    queryActivity(that);
    let userType = wx.getStorageSync("userInfo").userType;
    var isOldUser = userType ? userType.substr(1, 1) : "";
    //判断是否是登录过的用户  登录过的用户 直接进入登录流出
    if (isOldUser == '0') {
      wx.login({
        success: res => {
          wx.request({
            url: app.url + '/v1/login/wechart/getUserInfo',
            data: {
              code: res.code,
              appType: "1"
            },
            success: (res) => {
              if (res.data.code == '10000') {
                var result = res.data.response;
                if (result) {
                  wx.setStorageSync('userInfo', result);
                  var isOldUser = result.userType.substr(1, 1);
                  if (isOldUser =='1'){
                    getStudentBaseInfo(that);
                    querySignup(that);
                  }
                }
              }
            },
            fail: (info) => {
            }
          })
        }
      });
    }else{
      querySignup(that);
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

function toSignResult(that, cpuserid, competitionid,sigupType){
  wx.navigateTo({
    url: '../../../pages/competition/competition-html/competition-html?organizationId=' + that.data.organizationId +
      '&token=' + that.data.token + '&userName=' + that.data.userName + '&avatarUrl=' + that.data.avatarUrl + '&userId=' + that.data.userId + '&needRegister=' + that.data.needRegister + '&showsignup=1&cpuserid=' + cpuserid + '&competitionid=' + competitionid + '&sigupType=' + sigupType
  })
}

function toCompetitionIndex(that){
  let needRegister=1;
  let userType = wx.getStorageSync("userInfo").userType;
  var isOldUser = userType ? userType.substr(1, 1) : "";
  if (isOldUser==1) {
    needRegister=0;
  }
  wx.getUserInfo({
    success: function (e) {
      let dataInfo = JSON.parse(e.rawData);
      that.setData({
        needRegister: needRegister,
        token:wx.getStorageSync('userInfo').token,
        userId: wx.getStorageSync('userInfo').userId,
        userName: dataInfo.nickName,
        avatarUrl: dataInfo.avatarUrl
      })
      wx.navigateTo({
        url: '../../../pages/competition/competition-html/competition-html?organizationId=' + that.data.organizationId +
          '&token=' + that.data.token + '&userName=' + that.data.userName + '&avatarUrl=' + that.data.avatarUrl + '&userId=' + that.data.userId + '&needRegister=' + that.data.needRegister,
      })
    }
  });
}

//登录
function login(code, appType, vm, encryptedData, iv) {
  wx.request({
    url: app.url + '/v1/login/wechart/init',
    data: {
      encryptedData: encryptedData,
      iv: iv,
      appType: appType,
      code: code
    },
    method: 'GET',
    ContentType: 'application/json;charset=UTF-8',
    success: (res) => {
      if (res.data.code == '10000') {
        var result = res.data.response;
        wx.setStorageSync('userInfo', result);
        toCompetitionIndex(vm)
      }
    },
    fail: (info) => {
    }
  })
};


function queryActivity(that){
  wx.request({
    url: app.tanmaCompetitionUrl + '/v1/app/account/queryActivityList',
    data: {
      organizationId: that.data.organizationId
    },
    method: 'GET',
    ContentType: 'application/json;charset=UTF-8',
    success: (res) => {
      if (res.data.code == 1 && res.data.data.length > 0) {
        that.setData({
          activityDetail: res.data.data[0]
        })
      }
    },
    fail: (info) => {
    }
  })
}

function querySignup(that){
  wx.request({
    url: app.tanmaCompetitionUrl + '/v1/app/account/querySignupByTanmaUserId',
    data: {
      tanmaUserId: wx.getStorageSync('userInfo').userId,
      organizationId: that.data.organizationId
    },
    method: 'GET',
    ContentType: 'application/json;charset=UTF-8',
    success: (res) => {
      if (res.data.code == 1) {
         that.setData({
           signupList: res.data.data
         })
      }
    },
    fail: (info) => {
    }
  })
  
}

function getStudentBaseInfo(vm) {
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
        app.loginInitIM();
        if (!data.provinceId) {
          updateStudentAddress(vm);
        }
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '获取您的信息失败，请刷新重试',
        icon: none
      })
    }
  })
};