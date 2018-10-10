// pages/Introduction/Introduction.js
const app = getApp().globalData;
Page({
  data: {
    haveUnionId: false,
    openFrom:"",
    openTo:"",
    classId:"",
    indicatorDots: true,
    indicatorColor: '#e4e4e4',
    indicatorActiveColor: '#00C693',
    autoplay: false,
    interval: 2000,
    duration: 500,
    current: 0,
    circular: false,
    autoLoad:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否是分享进入
    if (options.openFrom == 'classShare' || options.openFrom == 'coachShare'){
        this.setData({
          openFrom: options.openFrom,
          openTo: options.openTo
        })
    }
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
    var that = this;
    let userType = wx.getStorageSync("userInfo").userType;
    var isOldUser = userType?userType.substr(1, 1):"";
    //判断是否存在版本更新
    if (wx.getStorageSync("VERSION-UPDATE") == 0){
      // 判断是否是登录过的用户  登录过的用户 直接进入登录流出
        if (isOldUser == '1' || isOldUser == '0') {
          toLoadIn(that, isOldUser);
        } else {
          // 自动获取微信信息登录
          wx.login({
            success: res => {
              getUserInfo(res.code, '1', that)
            }
          });
      }
    }
    wx.setStorageSync("VERSION-UPDATE", 0);
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

  //手动点击获取用户unionid
  bindGetUserInfo: function (e) {
    var vm = this;
    var that = this;
    if (that.data.autoLoad){
      //判断是否是登录过的用户  登录过的用户 直接进入登录流出
      let userType = wx.getStorageSync("userInfo").userType;
      var isOldUser = userType ? userType.substr(1, 1) : "";
      if (isOldUser == '1' || isOldUser == '0') {
        toLoadIn(that, isOldUser);
        that.setData({
          autoLoad: false
        })
        return false;
      }
    }
    
    let date = new Date();
    wx.getSetting({
      success: res => {
        let date = new Date();
        if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
          let encryptedData = e.detail.encryptedData;
          let iv = e.detail.iv;
          wx.login({
            success: res => {
              let date = new Date();
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
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
})
//登录
function login(code, appType, vm, encryptedData, iv) {
  let date = new Date();
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
      let date = new Date();
      if (res.data.code == '10000') {
        var result = res.data.response;
        wx.setStorageSync('userInfo', result);
        var isOldUser = result.userType.substr(1, 1);
        //如果第二位数字等于1说明是学员用户，获取用户账号密码
        toLoadIn(vm, isOldUser)
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '登录失败，请刷新重试',
        icon:'none'
      })
    }
  })
};
//自动获取微信信息登录
function getUserInfo(str, num, that) {
  wx.request({
    url: app.url + '/v1/login/wechart/getUserInfo',
    data: {
      code: str,
      appType: num
    },
    success: (res) => {
      if (res.data.code == '10000') {
        var result = res.data.response;
        if (result) {
          wx.setStorageSync('userInfo', result);
          //判断是否是新用户
          var isNewUser = result.userType.substr(1, 1);
          //如果第二位数字等于1说明是学员用户，获取用户账号密码
          toLoadIn(that, isNewUser);
        }
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '获取您的失败，请刷新重试',
        icon: 'none'
      })
    }
  })
};
//学员用户 获取学员信息
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
        icon: 'none'
      })
    }
  })
};
//如果没有地址的 学员  自动更新为当前定位地址
function updateStudentAddress(vm) {
  wx.request({
    url: app.url + '/v1/student/updateStudentAddressInfos',
    data: {
      "userId": wx.getStorageSync("userInfo").userId,
      "provinceName": wx.getStorageSync("location").result.address_component.province,
      "cityName": wx.getStorageSync("location").result.address_component.city,
      "countyName": wx.getStorageSync("location").result.address_component.district
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}
//凡是能够获取到微信信息  都会进入这里进行 判定   如果是分享进入 则 需要调转到指定界面
function toLoadIn(that,isStudent){
  let date = new Date();
  //凡是 学员登录  需要初始化学员信息
  if (isStudent == '1'){
    getStudentBaseInfo(that);
  }
  let toParam = wx.getStorageSync("SHARE_LOGIN_FOR_REGISTER");
  //凡是分享进入  需要进行 注册  和 跳转 判定
  if (that.data.openFrom == 'classShare' || that.data.openFrom =='coachShare'){
    if ((that.data.openTo == "im" || that.data.openTo == "shop" || that.data.openTo == "store") && isStudent == '0') {
      wx.redirectTo({
        url: '../../../../../pages/register/register?openTo=' + that.data.openTo
      })
    } else if ((that.data.openTo == "im" || that.data.openTo == "shop" || that.data.openTo == "store") && isStudent == '1'){
      if (that.data.openTo == 'im' || that.data.openTo == 'shop') {//跳转到 聊天界面  跳转到 订单确认  跳转回 课程详情
        wx.redirectTo({
          url: '../../' + toParam
        })
      } else if (that.data.openTo == 'store') {//如果是点击收藏 触发的注册 
        wx.navigateBack({
          delta: 1
        })
      }
      wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", "");
    }else if (that.data.openTo == "eachclassis" || that.data.openTo == "coach" || that.data.openTo == "venue" || that.data.openTo == "student"){
      wx.redirectTo({
        url: '../../' + toParam
      })
      wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", "");
    }else {//无特定跳转的 分享进入首页
      wx.switchTab({
        url: "../../../../../pages/keChen/keChen-index/keChen-index"
      });
      wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", "");
    }
  } else{
    //凡是 非分享进入 则直接进入首页
    wx.switchTab({
      url: "../../../../../pages/keChen/keChen-index/keChen-index"
    });
  }
  that.setData({
    openFrom: "",
    openTo: ""
  })
}