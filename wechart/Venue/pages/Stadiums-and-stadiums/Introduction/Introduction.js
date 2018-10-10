// pages/Stadiums-and-stadiums/Introduction/Introduction.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveUnionId: false
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
    var vm = this;
    let userType = wx.getStorageSync("userInfo").userType;
    let auditStatus = wx.getStorageSync("homeStaff").auditStatus;
    if (userType) {
      //判断是否是新用户
      var isNewUser = userType.substr(3, 1);
      if (isNewUser == '1') {
        vm.setData({
          haveUnionId: true
        })
      }
    };
    setTimeout(function () {
      let havaUnionId = vm.data.haveUnionId;
      // console.log(havaUnionId);
      if (havaUnionId) {
        if (auditStatus && auditStatus != '1') {
          wx.showModal({
            title: '提示',
            content: '该账号正在审核中....',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.redirectTo({
            url: "../Venue/Venue"
          });
        }
      }
    }, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var vm = this;
    // 登录
    app.noType();
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        getUserInfo(res.code, '3', vm)
      }
    })
    app.getLocations();

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
  //获取用户unionid
  bindGetUserInfo: function (e) {
    var vm = this;
    console.log(e)
    let haveUnionId = vm.data.haveUnionId;
    if (haveUnionId) {
      let auditStatus = wx.getStorageSync("homeStaff").auditStatus;
      if (auditStatus && auditStatus != '1') {
        wx.showModal({
          title: '提示',
          content: '该账号正在审核中....',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              getHomeStaffBaseInfo(vm);
            } else if (res.cancel) {
              console.log('用户点击取消')
              getHomeStaffBaseInfo(vm);
            }
          }
        })
      } else {
        let userInfo = wx.getStorageSync("userInfo");
        if (userInfo && userInfo.auditStatus != '1') {
          userInfo.auditStatus = '1';
          wx.setStorageSync("userInfo", userInfo)
        }
        wx.redirectTo({
          url: "../Venue/Venue"
        });
      }
    } else {
      wx.getSetting({
        success: res => {
          console.log(res);
          if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
            let encryptedData = e.detail.encryptedData;
            let iv = e.detail.iv;
            wx.login({
              success: res => {
                console.log(res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // login(res.code, '2', that)
                login(res.code, '3', vm, encryptedData, iv);
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
    }
  },
})
//登录
function login(code, appType, vm, encryptedData, iv) {
  // console.log(str)
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
      console.log(res)
      // setTimeout(function () {
      //   wx.setStorageSync('userInfo', res.data.response);
      // }, 0);
      if (res.data.code == '10000') {
        var result = res.data.response;
        wx.setStorageSync('userInfo', result);
        //判断是否是新用户
        var isNewUser = result.userType.substr(3, 1);
        //如果第二位数字等于1说明是学员用户，获取用户账号密码
        // isNewUser == '1' ? userPwd(result.userId, isNewUser, that) : console.log("这可能是新学员");
        // wx.navigateTo({
        //   url: "../register/register"
        // });
        if (isNewUser == '1') {
          let auditStatus = wx.getStorageSync("homeStaff").auditStatus;
          if (auditStatus && auditStatus != '1') {
            wx.showModal({
              title: '提示',
              content: '该账号正在审核中....',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  getHomeStaffBaseInfo(vm);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  getHomeStaffBaseInfo(vm);
                }
              }
            })
          } else {
            let userInfo = wx.getStorageSync("userInfo");
            if (userInfo && userInfo.auditStatus != '1') {
              userInfo.auditStatus = '1';
              wx.setStorageSync("userInfo", userInfo)
            }
            wx.redirectTo({
              url: "../Venue/Venue"
            });
          }
        } else {
          wx.redirectTo({
            url: "../venue-register/venue-register"
          });
        }
      }
    },
    fail: (info) => {
      console.log(info)
    }
  })
};
function getUserInfo(str, num, that) {
  wx.request({
    url: app.url + '/v1/login/wechart/getUserInfo',
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
          var isNewUser = result.userType.substr(3, 1);
          //如果第三位数字等于1说明是教练用户，获取用户账号密码
          if (isNewUser == '1') {
            // that.globalData.loginInitIM();
            getHomeStaffBaseInfo(that);
          } else {
            console.log(result.userType)
          }
        }
      } else {
        wx.setStorageSync('userInfo', '');
      }
    },
    fail: (info) => {
      console.log(info)
    }
  })
};
function getHomeStaffBaseInfo(vm) {
  wx.request({
    url: app.url + '/v1/home/getHomeStaffStorageInfoByUserId',
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
        if (!data.provinceId) {
          updateStaffAddress(vm);
        }
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};
function updateStaffAddress(vm) {
  wx.request({
    url: app.url + '/v1/home/updateStaffInfoByUserId',
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
