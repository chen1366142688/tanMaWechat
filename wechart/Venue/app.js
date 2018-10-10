//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    getLocations();
    let that = this;
    if (!wx.canIUse('getUpdateManager')) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    wx.onNetworkStatusChange(function (res) {
      if (res.networkType == 'none') {
        wx.reLaunch({
          url: '../../../pages/welcome/welcomeNo/welcomeNo',
        })
      }
    })
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，点击重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          } else if (res.cancel) {
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '下载提示',
        content: '新版本下载失败，请手动删除本地小程序重新下载',
      })
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     console.log(res)
          //     this.globalData.userInfo = res.userInfo

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        } else {
          console.log("这是没有授权")
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //***************开发环境******************* */
    // url: 'http://192.168.3.4:8081', //局域网开发环境
    // url: 'http://localhost:8081',

    //***************测试环境******************* */
    // url: 'https://timosports.cn/gateway', // 公网测试地址
    // htmlUrl: 'https://timosports.cn/static/html/page',

    // ***************正式环境******************* */
    url: 'https://www.timosports.cn/gateway', // 公网测试地址
    htmlUrl: 'https://www.timosports.cn/static/html/page',

    //***************静态资源******************* */
    htmlUrl: 'https://timosports.cn/static/html/page',
    imgUrl: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    getLocations: getLocations,
    homeId: '',
    noType: function () {
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
    },
  }
})
function login(str, num, that) {
  wx.request({
    url: that.globalData.url + '/v1/login/wechart/getUserInfo',
    data: {
      code: str,
      appType: '3'
    },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        if (result) {
          wx.setStorageSync('userInfo', result);
          //判断是否是新用户
          var isNewUser = result.userType.substr(2, 1);
          //如果第三位数字等于1说明是教练用户，获取用户账号密码
          if (isNewUser == '1') {
            // that.globalData.loginInitIM();
            getHomeStaffBaseInfo(that);
          } else {
            console.log(result.userType)
          }
        }
      }
    },
    fail: (info) => {
      console.log(info)
    }
  })
}
function getHomeStaffBaseInfo(vm) {
  wx.request({
    url: vm.globalData.url + '/v1/home/getHomeStaffStorageInfoByUserId',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        wx.setStorageSync('homeStaff', data)
        // vm.globalData.loginInitIM();
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}
function getLocations() {
  var QQMapWX = require('utils/qqmap-wx-jssdk.js');
  var qqmapsdk;
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
    key: '5ICBZ-XLHCD-4HR4J-HJGBE-N36JF-3TBWX'
  });
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          wx.setStorageSync('location', res)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }
  })
}
