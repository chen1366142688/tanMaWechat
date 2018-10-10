// pages/Forget-Password/Forget-Password.js
const app = getApp().globalData
var regPhone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
Page({
  data: {
    imgUrl: app.url,
    phoneNum:'',
    code:'',
    thisTime: 60,
    showCode: false,
    loginPhoneIsOk:false
  },
  inputPhone(e){
    this.setData({phoneNum:e.detail.value})
    if (e.detail.value.length == 11 && regPhone.test(e.detail.value)) {
      this.setData({ loginPhoneIsOk: true })
      getAvaByPhoneNo(this, e.detail.value);
    } else {
      this.setData({ loginPhoneIsOk: false })
    }
  },
  inputCode(e) {
    this.setData({ code: e.detail.value })
  },
  //点击发送验证码
  sendCode(e) {
    var that = this;
    var phoneNum = that.data.phoneNum;
    if (regPhone.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  subLogin(e){
    const that = this;
    let phoneNum = that.data.phoneNum;
    let code = that.data.code;
    if (regPhone.test(phoneNum)) {
      console.log("手机号ok")
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
      return false;
    }
    if(code.length !== 6){
      wx.showToast({
        title: '请输入正确的验证码！',
        icon: 'none'
      })
      return false;
    }else{
      console.log("验证码暂时ok")
    }
    //提交
    submit(that)
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    this.setData({
      avatarUrl: app.url + "Head-Portraits.png"
    })
    if (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").phoneNum) {
      this.setData({
        loginPhoneIsOk: true,
        phoneNum: wx.getStorageSync("userInfo").phoneNum
      })
      if (wx.getStorageSync("userInfo").avatarUrl && wx.getStorageSync("userInfo").avatarUrl.length > 5) {
        this.setData({
          avatarUrl: wx.getStorageSync("userInfo").avatarUrl
        })
      }
    }
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})
//发送验证码
function sendCoded(that, phone) {
  wx.request({
    url: app.rQUrl + '/v1/auth/sendSmsForPassWord',
    method: 'GET',
    data: {
      'phoneNum': phone
    },
    success: function (res) {
      var result = res.data;
      if (result.code == 10000) {
        that.setData({ showCode: true });
        changeThisTime(that)

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
//倒计时
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

}
//提交手机号和code
function submit(that){
  let phoneNum = that.data.phoneNum;
  let code = that.data.code;
  if (phoneNum !== '' && code !== '') {
    wx.request({
      url: app.rQUrl + '/v1/auth/checkSmsForPassWord',
      method: 'GET',
      data: {
        "code": code,
        "phoneNum": phoneNum
      },
      success(res) {
        if (res.data.code == '10000') {
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          wx.redirectTo({
            url: "../../../pages/login/Secondary-Input/Secondary-Input?code=" + code + "&phoneNum=" + phoneNum,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail(info) {
        wx.showToast({
          title: info.data.msg,
          inco: 'none'
        })
      }
    })
  } else {
    wx.showToast({
      title: '请填写正确的信息',
      icon: 'none'
    })
  }
}

function getAvaByPhoneNo(that, phoneNo) {
  that.setData({
    avatarUrl: app.url + "Head-Portraits.png"
  })
  if (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").phoneNum == phoneNo) {
    if (wx.getStorageSync("userInfo").avatarUrl && wx.getStorageSync("userInfo").avatarUrl.length > 5) {
      that.setData({
        avatarUrl: wx.getStorageSync("userInfo").avatarUrl
      })
    }
    return false;
  }
  wx.request({
    url: app.rQUrl + '/v1/auth/login/getUserAvatarUrl',
    method: 'GET',
    data: {
      "phoneNum": phoneNo
    },
    success(res) {
      if (res.data.code == '10000') {
        if (res.data.response) {
          that.setData({
            avatarUrl: res.data.response
          })
        }
      }
    }
  })
}