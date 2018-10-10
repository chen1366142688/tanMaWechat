// pages/login/Secondary-Input/Secondary-Input.js
const app = getApp().globalData
const md5 = require('../../../utils/md5.js');
Page({
  data: {
      code:"",
      phoneNum:"",
      newPassword:"",
      reNewPassword:"",
      newPasswordIsOk: false,
      reNewPasswordIsOk: false
  },
  onLoad: function (options) {
    this.setData({
      code: options.code,
      phoneNum: options.phoneNum,
      newPassword: "",
      reNewPassword: "",
      newPasswordIsOk: false,
      reNewPasswordIsOk: false
    })
  },
  onReady: function () {},
  inputNewPassword(e) {
    this.setData({ newPassword: e.detail.value })
    if (CheckPassWord(e.detail.value)) {
      this.setData({ newPasswordIsOk: true })
    } else {
      this.setData({ newPasswordIsOk: false })
    }
    if (this.data.reNewPassword == e.detail.value) {
      this.setData({ reNewPasswordIsOk: true })
    } else {
      this.setData({ reNewPasswordIsOk: false })
    }
  },
  inputReNewPassword(e) {
    this.setData({ reNewPassword: e.detail.value })
    if (this.data.newPassword == e.detail.value) {
      this.setData({ reNewPasswordIsOk: true })
    } else {
      this.setData({ reNewPasswordIsOk: false })
    }
  },
  submitUpdatePassword(e) {
    let that = this;
    if (that.data.newPassword.length <= 0) {
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none'
      })
      return;
    }
    //判断密码
    if (CheckPassWord(that.data.newPassword)) {
      console.log("密码ok")
    } else {
      wx.showToast({
        title: '新密码必须是6-18位的数字和字母组合！',
        icon: 'none'
      })
      return;
    }
    if (that.data.reNewPassword.length <= 0) {
      wx.showToast({
        title: '请输入二次密码！',
        icon: 'none'
      })
      return;
    }
    //密码ok,验证二次密码
    if (that.data.newPassword === that.data.reNewPassword) {
      console.log("两次密码一致！")
    } else {
      wx.showToast({
        title: '两次输入密码不一致！',
        icon: 'none'
      })
      return;
    }
    toUpdatePassword(that);
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})

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

function toUpdatePassword(that) {
  wx.request({
    url: app.rQUrl + '/v1/auth/updateUserPassWord',
    method: 'POST',
    data: {
      'code': that.data.code,
      "password": md5.hex_md5(that.data.newPassword),
      "passwordRes": md5.hex_md5(that.data.reNewPassword),
      "userPhone": that.data.phoneNum
    },
    success(res) {
      if (res.data.code == '10000') {
        wx.showToast({
          title: '修改成功！',
          icon: 'none'
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../../../pages/login/Register/Register',
          })
        }, 500);
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
}