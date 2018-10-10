//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    getLocations();
    getItemList();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        login(res.code,'1')
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // console.log(res)
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          // console.log("这是没有授权")
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    url: 'http://wocao.natapp1.cc',
    imgUrl:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    getLocations: getLocations
  }
})
function login(str,num){
  wx.request({
    url: 'http://wocao.natapp1.cc/v1/login/wechart/init?code='+str+'&appType='+num,
    method:'GET',
    ContentType: 'application/json;charset=UTF-8',
    data:{},
    success:(res)=>{
      setTimeout(function(){
        wx.setStorageSync('userInfo',res.data.response);
      },0);
    },
    fail:(info)=>{
      console.log(info)
    }

  })
}
function getLocations() {
  // console.log(123)
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
          // console.log(88888)
          // console.log(res);
          wx.setStorageSync('location', res)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }
  })
} 
function getItemList() {
  wx.request({
    url: 'http://wocao.natapp1.cc/v1/item/getItemList',
    method: 'GET',
    data: {},
    success: function (res) {
      console.log("请求成功,下面是返回参数")
      console.log(res.data.code)
      if (res.data.code == '10000') {
        wx.setStorageSync('itemList', res.data.response)
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
