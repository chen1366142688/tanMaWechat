const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调 
  // console.log(res.hasUpdate)
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
  // 新的版本下载失败
  wx.showModal({
    title: '下载提示',
    content: '新版本下载失败，请手动删除本地小程序重新下载',
  })
})
//app.js
App({
  onLaunch: function (ops) {
    if (ops.scene == 1044) {
    }
    let that = this;
    wx.onNetworkStatusChange(function (res) {
      if (res.networkType=='none'){
        wx.reLaunch({
          url: '../../../pages/welcome/welcomeNo/welcomeNo',
        })
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  
    wx.login({
      success: res => {
        
      }
    }); 
  }, 
  globalData: {
    userInfo: null,
    //***************************************开发环境*********************************** */
    // url: 'http://192.168.3.18:8081', //局域网开发环境
    

    //*******************************测试环境***************************************************

    // url: 'https://patriarch-tm.tanmasports.com/teacher', // 公网测试地址

    //*******************************正式环境*************************************************** */

    url: 'https://teacher-lb.tanmasports.com', 

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




// 判断token
function getStorageToken(name){
  return wx.getStorageSync(name)
}
// token登录
function tokenLogin(vm,token){
  wx.request({
    url: vm.globalData.url + '/v1/auth/login/token',
    method : "GET",
    header : {token : token},
    success : function(res){
      if (res.data.code == 10000){
        wx.setStorageSync("token", { token: res.data.response.oAuthTokenVO.token })
        wx.setStorageSync("userInfo", res.data.response)
      }else{
        wx.navigateTo({
          url: '../../../pages/login/login',
        })
      }
    }
  })
}

