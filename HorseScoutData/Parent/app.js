//app.js
if (!wx.canIUse('getUpdateManager')) {
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
}
const updateManager = wx.getUpdateManager()
updateManager.onCheckForUpdate(function (res) {
  console.log(res.hasUpdate)
})
updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，点击重启应用？',
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        updateManager.applyUpdate()
      } else if (res.cancel) {
        updateManager.applyUpdate()
      }
    }
  })

})
updateManager.onUpdateFailed(function () {
  wx.showModal({
    title: '下载提示',
    content: '新版本下载失败，请手动删除本地小程序重新下载',
  })
})
wx.setStorageSync('defaultLocation', {
  location: { "lat": 30.64242, "lng": 104.04311 },
  address: "四川省成都市武侯区益州大道中段移动互联大厦1800号",
  address_component: {
    nation: '中国',
    province: '四川省',
    city: '成都市',
    district: '武侯区',
    street: '益州大道中段',
    street_number: '益州大道中段移动互联大厦1800号'
  }
})
App({
  onLaunch: function () {
    //切换到无网络的情况
    wx.onNetworkStatusChange(function (res) {
      if (res.networkType == 'none') {
        wx.reLaunch({
          url: '../../../pages/welcome/welcomeNo/welcomeNo',//页面待定
        })
      }
    })
    getLocations();
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //通过token自动登录  如果登录失败 进入 登录界面通过账号密码登录
    loginByToken(this);
  },
  globalData: {
    userInfo: null,
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/patriarch/',
    rQUrl: 'https://patriarch-tm.tanmasports.com/gateway',
    //rQUrl: 'http://192.168.3.4:8181',
    defaultLocation: wx.getStorageSync('defaultLocation'),
  }
})
function getLocations() {
  var QQMapWX = require('utils/qqmap-wx-jssdk.js');
  var qqmapsdk;
  qqmapsdk = new QQMapWX({ key: 'BX6BZ-ZDEWF-EQVJ3-JPL6W-BPU6Q-4PFHB' });
  wx.getLocation({
    type: 'gcj02',
    success(res) {
      var latitude = res.latitude
      var longitude = res.longitude
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) { wx.setStorageSync('loacation', res.result) },
        fail: function (res) { console.log(res); }
      });
    }
  })
};
//通过token自动登录  如果登录失败 进入 登录界面通过账号密码登录
function loginByToken(that) {
  if (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").oauthToken && wx.getStorageSync("userInfo").oauthToken.token)  {
    wx.request({
      url: that.globalData.rQUrl + '/v1/auth/login/token',
      method: 'GET',
      header: { 'token': wx.getStorageSync("userInfo").oauthToken.token },
      data: {},
      success(res) {
        if (res.data.code == '10000') {
          wx.setStorageSync('userInfo', res.data.response)
          wx.switchTab({
            url: '/pages/index/index',
          })
        }else{
          wx.navigateTo({
            url: '../../../pages/login/Register/Register',
          })
        }
      },
      fail(info) {
        wx.showToast({
          title: '网络异常，请稍后再试！',
          inco: 'none'
        })
      }
    })
  }
}