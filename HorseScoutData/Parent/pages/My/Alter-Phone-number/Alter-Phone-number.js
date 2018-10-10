// pages/My/Alter-Phone-number/Alter-Phone-number.js
const md5 = require('../../../utils/md5.js');
const app = getApp().globalData;
Page({
  data: {
    phone:'',
    code:'',
    pwd:'',
    showCode:false,
    showCodes: false,
    thisTime: 60,
  },
  onLoad: function (options) {}, 
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  phoneNum(e){
    let value = e.detail.value;
    var reg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
    if (reg.test(value)) {
      this.setData({ showCode: true, phone: value })
    }
    
  },
  phoneCode(e) {
    let value = e.detail.value;
    this.setData({code:value})
  },
  sendCode(e){
    let that = this;
    let phoneNum = that.data.phone;
    var reg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
    if (reg.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  phonePwd(e){
    let value = e.detail.value;
    this.setData({pwd:value})
  },
  submit(e){
    const that = this;
    var reg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
    if (reg.test(that.data.phone)) {
      console.log("手机号OK")
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
      return;
    }
    if(that.data.code.length !== 6){
      wx.showToast({
        title: '请输入正确的验证码',
        icon:'none'
      })
      return;
    }
    if (CheckPassWord(that.data.pwd)){
        console.log("密码ok")
    }else{
      wx.showToast({
        title: '密码必须是6-18位的数字和字母组合',
        icon: 'none'
      })
      return ;
    }
    wx.request({
      url: app.rQUrl + '/v1/auth/update/phone',
      method: 'POST',
      data: {
        "code": this.data.code,
        "passWord": md5.hex_md5(this.data.pwd),
        "patriarchId": wx.getStorageSync('userInfo').patriarchId,
        "phoneNum": this.data.phone
      },
      success(res) {
        let result = res.data;
        if (result.code == 10000) {
          wx.navigateBack({
            delta:1
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          });
        }
      },
      fail(info) {
        wx.showToast({
          title: '提交失败,稍后再试',
          icon: 'none'
        })
      }
    })
  }
})
function sendCoded(that, phone) {
  wx.request({
    url: app.rQUrl + '/v1/auth/sendSmsForUpdatePhone',
    method: 'GET',
    data: {
      'phoneNum': phone
    },
    success (res) {
      let result = res.data;
      if (result.code == 10000) {
        that.setData({ showCodes: true, showCode: false });
        changeThisTime(that)
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail (info) {
      wx.showToast({
        title: '发送失败',
        icon:'none'
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
      showCodes: false,
      showCode: true,
      thisTime: 60
    });
  }

}
//验证密码字母加数字
function CheckPassWord(password) {//必须为字母加数字且长度不小于8位
  var str = password;
  if (str == null || str.length < 6) {
    return false;
  }
  var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
  if (!reg1.test(str)) {
    return false;
  }
  var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}