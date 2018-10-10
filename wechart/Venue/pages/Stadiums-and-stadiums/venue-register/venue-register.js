// pages/venue-register/venue-register.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

const app = getApp().globalData;
// 实例化API核心类
qqmapsdk = new QQMapWX({
  key: '5ICBZ-XLHCD-4HR4J-HJGBE-N36JF-3TBWX'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    address: '',
    url:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    array: [],
    objectArray: [],
    index: 0,
    phoneNumber:'',
    code:'',
    niCheng:'',
    showCode: false,
    thisTime: 60,
    isSubmit:false,
    pickTf:false,
    homeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    // let homeList = wx.getStorageSync("homeList");
    // vm.setData({
    //   homeList: homeList
    // })
    // var location = wx.getStorageSync("location").result.location;
    // console.log(location)
    // var latitude = location.lat
    // var longitude = location.lng
    // vm.setData({
    //   latitude: latitude,
    //   longitude: longitude
    // })
    // reverseLocation(vm, latitude, longitude)
  },
  //输入手机号
  shuRu: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  //发送验证码  
  sendCode: function (e) {
    var that = this;
    var user = wx.getStorageSync('userInfo')
    var phoneNum = that.data.phoneNumber;
    var reg = /^[1][0-9]{10}$/;
    if (reg.test(phoneNum)) {
      sendCoded(that, user.userId, '3', phoneNum);
    } else {
      wx.showModal({
        title: '提示',
        content: '手机号不正确',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //输入验证码
  shuCode: function (e) {
    var _this = this;
    this.setData({
      code: e.detail.value
    })
  },
  //昵称
  name: function (e) {
    console.log(e)
    this.setData({
      niCheng: e.detail.value
    })
  },
  //提交的时候验证验证码是否正确
  submit: function () {
    var that = this;
    if (!that.data.niCheng || that.data.niCheng == "") {
      wx.showToast({
        title: '请输入昵称！',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.phoneNumber || that.data.phoneNumber == ""){
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.code || that.data.code == "") {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none'
      })
      return false;
    }
    var user = wx.getStorageSync('userInfo')
    if (that.data.index !== '' && that.data.niCheng !== '' && that.data.phoneNumber !== '' && that.data.code !== '' && user.userId !== '') {
      var homeId = that.data.homeList[that.data.index].homeId;
      // if (misBat(that, that.data.code, user.userId, '1', that.data.phoneNumber) == 200){
      //   console.log("ok")
      // setTimeout(function () {
      if (that.data.isSubmit) {
        wx.showToast({
          title: '注册中，请勿重复提交',
          icon: 'none'
        })
        return false;
      }
      this.setData({
        isSubmit: true
      })
      registe(homeId, user.userId, that.data.niCheng, that.data.phoneNumber, that.data.code,that)
      // }, 200);
      // }else{
      //   console.log("badResult")
      // }
    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    }
  },
  //
  bindPickerChange: function (e) {
    var values = e.detail.value;
    this.setData({
      index: values
    })
  },
  fixParams:function(e){
    var vm=this;
    let list=vm.data.homeList;
    if(list.length <1){
      getHomeList(vm);
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
    var vm=this;
    app.noType();
    getHomeList(vm);
    //是否已经注册检查
    if ((wx.getStorageSync('userInfo').userType).substr(4, 1) == "1") {
      let auditStatus = wx.getStorageSync("homeStaff").auditStatus;
      if (auditStatus && auditStatus != '2') {
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
        wx.showModal({
          title: '提示',
          content: '您已经注册,不能重复注册！',
          showCancel: false,
          success: function () {
            //跳转到首页  
            wx.redirectTo({
              url: "../../../pages/Stadiums-and-stadiums/Venue/Venue"
            });
          }
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
  onShareAppMessage: function () {

  }
})
//发送验证码
function sendCoded(that, uid, types, phone) {
  wx.request({
    url: app.url + '/v1/common/sendSMS',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      'type': types,
      'userId': uid,
      'userPhoneNo': phone
    },
    success: function (res) {
      var result = res.data;
      console.log(res)
      if (result.code == 10000) {
        that.setData({ showCode: true });
        changeThisTime(that);
        // wx.showModal({
        //   title: '提示',
        //   content: result.msg,
        // });
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      console.log("发送失败")
    }
  })
}
//校验验证码是否正确
function misBat(that, code, uid, types, phone) {
  wx.request({
    url: app.url + '/v1/common/checkSMS',
    method: 'POST',
    data: {
      'code': code,
      'type': types,
      'userId': uid,
      'userPhoneNo': phone
    },
    success: function (res) {
      if (res.code == '10000') {
        console.log("验证成功")
        return 200;
      } else {
        console.log('用户信息不完善')
      }
    },
    fail: function (info) {
      console.log("验证失败")
    }
  })
}
//逆地址解析--请求场馆列表
function reverseLocation(that, lat, lon) {
  getHomeList(that);
  return false;
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: lat,
      longitude: lon
    },
    success: function (res) {
      that.setData({
        address: res.result.address_component.city
      })

    },
    fail: function (res) {
      wx.showModal({
        title: '提示',
        content: '定位失败',
      })
    }
  });
}
function registe(homeId, userId, userName, userPhoneNo, verificationCode,that) {
  wx.request({
    url: app.url + '/v1/home/add/homeStaffRegioninfo',
    method: 'POST',
    data: {
      "homeId": homeId,
      "userId": wx.getStorageSync("userInfo").userId,
      "userName": userName,
      "userPhoneNo": userPhoneNo,
      "verificationCode": verificationCode
    },
    success: function (res) {
      var result = res.data
      if (result.code == 20004) {//验证码错误
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
        that.setData({
          isSubmit: false
        })
      } else if (result.code == 10000) {//成功
        //聊天IM账户
        var IMInfo = {
          userId: "homeIM" + wx.getStorageSync('userInfo').userId,
          password: result.msg
        }
        wx.setStorageSync('homeIM', IMInfo);
        //重新获取登录信息
        wx.login({
          success: res => {
            console.log(res)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // login(res.code, '2', that)
            login(res.code, '3', that);
          }
        })

      } else {//其他
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
        that.setData({
          isSubmit: false
        })
      }
    },
    fail: function (info) {
      console.log("注册失败了")
      this.setData({
        isSubmit: false
      })
    }
  })
}

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
function login(str, num, that) {
  wx.request({
    url: app.url + '/v1/login/wechart/getUserInfo',
    data: {
      code: str,
      appType: num
    },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        if (result) {
          wx.setStorageSync('userInfo', result);
          //判断是否是新用户
          var isNewUser = result.userType.substr(3, 1);
          //如果第二位数字等于1说明是学员用户，获取用户账号密码
          // isNewUser == '1' ? app.userPwd(result.userId, isNewUser, that) : console.log("这可能是新学员");
          getHomeStaffBaseInfo(that);
          wx.showModal({
            title: '提示',
            content: '注册成功!请等待平台审核',
            showCancel: false,
            success: function () {
              // 跳转到欢迎页面 
              wx.redirectTo({
                url: "../Introduction/Introduction"
              });
            }
          });
        }

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
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};
function getHomeList(that) {
  let cityName = wx.getStorageSync("location").result.address_component.city
  //请求场馆列表
  wx.request({
    url: app.url + '/v1/home/get/homeIdAndHomeNameList',
    method: 'POST',
    data: { 'cityName':cityName?cityName:'' },
    success: function (res) {
      console.log(res)
      var result = res.data.response;
      var arr = [];
      // for (let i = 0; i < result.length; i++) {
      //   arr.push(result[i].homeName);
      // }
        that.setData({
          homeList: result,
          // array: result
        })
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '服务器故障',
      })
    }
  })
};
