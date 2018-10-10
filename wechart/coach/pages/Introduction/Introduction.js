// pages/Introduction/Introduction.js
const app = getApp().globalData;
Page({
  data: {
    haveUnionId: false,
    classNum:0,
    phoneNo:"",
    smscode:"",
    thisTime:60,
  },

  onLoad: function (options) {},
  onReady: function () {
  },
  onShow: function () {
    var vm = this;
    let userType = wx.getStorageSync("userInfo").userType;
    console.log(userType)
    if (userType) {
      //判断是否是新用户
      var isNewUser = userType.substr(2, 1);
      console.log(isNewUser)
      if (isNewUser == '1') {
        vm.setData({
          haveUnionId: true
        })
      }
    };
    let havaUnionId = vm.data.haveUnionId;
    if (havaUnionId) {
      wx.switchTab({
        url: "/pages/curriculum/curriculumeIndex/curriculumIndex"
      });
    }
    wx.login({
      success: res => {
        getUserInfo(res.code, '2', vm)
      }
    });
    
  },
  code: function (e) {
    var vm = this;
    let code = e.detail.value;
    vm.setData({
      smscode: code
    })
  },
  phoneNo: function (e) {
    var vm = this;
    // console.log(e)
    let phoneNo = e.detail.value;
    vm.setData({
      phoneNo: phoneNo
    })
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  checkCoachInfo:function(){
     let that = this;
    if (that.data.phoneNo == ''){
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.smscode == ''){
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
      wx.request({
        url: app.url + '/v1/coach/user/checkcoach',
        data: {
          phone: that.data.phoneNo,
          code: that.data.smscode,
          userId: wx.getStorageSync("userInfo").userId
        },
        success: (res) => {
          if (res.data.code==30006){
              wx.redirectTo({
                url: "../Register/Register?phoneNo=" + that.data.phoneNo + '&smscode=' + that.data.smscode
              });
          } else if (res.data.code=='10000'){
            var result = res.data.response;
            wx.setStorageSync('userInfo', result);
            wx.switchTab({
              url: "/pages/curriculum/curriculumeIndex/curriculumIndex"
            });
            getCoachBaseInfo(that);
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (info) => {
          console.log(info)
        }
      })
  },
  //获取用户unionid
  bindGetUserInfo: function (e) {
    var vm = this;
    let checkUserType="";
    if (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").userType){
      checkUserType = wx.getStorageSync("userInfo").userType.substr(2, 1)
    }
    let haveUnionId = vm.data.haveUnionId;
    if (haveUnionId) {
      wx.switchTab({
        url: "/pages/curriculum/curriculumeIndex/curriculumIndex"
      });
    } else if (checkUserType && checkUserType == '0'){
       sendSMS(vm);
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
            let encryptedData = e.detail.encryptedData;
            let iv = e.detail.iv;
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // login(res.code, '2', that)
                login(res.code, '2', vm, encryptedData, iv);
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '小程序需要你的授权才能使用',
              success: function (res) {
                if (res.confirm) {
                  wx.OpenSetting({});
                } else if (res.cancel) {
                }
              }
            })
          }
        }
      })
    }
  }
})
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
          //判断是否是新用户
          var isNewUser = result.userType.substr(2, 1);
          getCoachBaseInfo(vm);
          if(isNewUser=='1'){
            wx.showModal({
              title: '授权提示',
              content: '当前微信账号已注册，可直接登录!',
              showCancel: false,
              success: function () {
                wx.switchTab({
                  url: "/pages/curriculum/curriculumeIndex/curriculumIndex"
                });
              }
            });
          }else{
            sendSMS(vm);
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
        appType: '2'
      },
      success: (res) => {
        if (res.data.code == '10000') {
          var result = res.data.response;
          if (result) {
            wx.setStorageSync('userInfo', result);
            //判断是否是新用户
            var isNewUser = result.userType.substr(2, 1);
            //如果第三位数字等于1说明是教练用户，获取用户账号密码
            if (isNewUser == '1') {
              getCoachBaseInfo(that);
              wx.switchTab({
                url: "/pages/curriculum/curriculumeIndex/curriculumIndex"
              });
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
  function getCoachBaseInfo(vm) {
    wx.request({
      url: app.url + '/v1/coach/getCoachStorageInfoByUserId',
      data: {
        "userId": wx.getStorageSync("userInfo").userId
      },
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      success: (res) => {
        if (res.data.code == '10000') {
          var data = res.data.response;
          wx.setStorageSync('coachBaseInfo', data)
          console.log(!data.provinceId)
          if(!data.provinceId || !data.cityId){
            updateCoachAddress(vm);
          }
        }
      },
      fail: (info) => {
        console.log("请求失败了");
      }
    })
  };
  function changeThisTime(that) {
    var time = that.data.thisTime;
    time--;
    if (time >= 0) {
      that.setData({
        thisTime: time,
      });
      setTimeout(() => {
        changeThisTime(that)
      }, 1000)
    } else {
      that.setData({
        showCode: false,
        thisTime: 60
      });
    }

  };
  function getCoachClassNumByUserId(vm){
    wx.request({
      url: app.url + '/v1/coach/countClassNumsByUserId',
      data: {
        "userId": wx.getStorageSync("userInfo").userId
      },
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      success: (res) => {
        if (res.data.code == '10000') {
          var data = res.data.response;          
          vm.setData({
            classNum:data
          })
          if (data && data > 0) {
            wx.switchTab({
              url: "../index/scheduleIndex/scheduleindex"
            });
          } else {
            wx.switchTab({
              url: "/pages/curriculum/curriculumeIndex/curriculumIndex"
            });
          }
        }
      },
      fail: (info) => {
        console.log("请求失败了");
      }
    })
  };
  function updateCoachAddress(vm){
    wx.request({
      url: app.url + '/v1/coach/updateCoachAddress',
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
        getCoachBaseInfo(vm);
      },
      fail: (info) => {
        console.log("请求失败了");
      }
    })
  }
function sendSMS(vm) {
  let phoneNo = vm.data.phoneNo;
  var isPhoneNo = isPoneAvailable(phoneNo);
  if (isPhoneNo) {
    wx.request({
      url: app.url + '/v1/common/sendSMS',
      header: {
        'token': wx.getStorageSync('userInfo').token
      },
      data: {
        "type": '2',
        "userId": wx.getStorageSync('userInfo').userId,
        "userPhoneNo": vm.data.phoneNo
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.code == '10000') {
          vm.setData({
            showCode: true
          });
          changeThisTime(vm);
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (info) => {
        wx.showToast({
          title: '发送失败',
          icon: 'none',
          duration: 2000
        })
        console.log("请求失败了");
      }
    })
  } else {
    wx.showToast({
      title: '请输入正确的手机号码！',
      icon: 'none',
      duration: 1000
    })
    return false;
  }
};
function isPoneAvailable(str) {
  var myreg = /^[1][0-9]{10}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
};
