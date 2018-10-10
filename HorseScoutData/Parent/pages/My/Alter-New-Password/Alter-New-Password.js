// pages/My/Alter-New-Password/Alter-New-Password.js
const md5 = require('../../../utils/md5.js');
const app = getApp().globalData
Page({
  data: {
    oldPwd:'',
    newPwd:'',
    newPwdAgin:''
  },
  onLoad: function (options) {
    this.setData({ oldPwd:options.oldPwd});
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  newPwd(e){
    this.setData({ newPwd:e.detail.value})
  },
  newPwdAgin(e){
    this.setData({newPwdAgin:e.detail.value})
  },
  submitRes(){
    //判断密码
    let password = this.data.newPwd;
    let passwordRes = this.data.newPwdAgin;
    if (CheckPassWord(password)) {
      console.log("密码ok")
    } else {
      wx.showToast({
        title: '密码必须是6-18位的数字和字母组合！',
        icon: 'none'
      })
      return;
    }
    if (passwordRes.length <= 0) {
      wx.showToast({
        title: '请输入二次密码！',
        icon: 'none'
      })
      return;
    }
    //密码ok,验证二次密码
    if (password === passwordRes) {
      console.log("两次密码一致！")
    } else {
      wx.showToast({
        title: '两次输入密码不一致！',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: app.rQUrl + '/v1/auth/update/password',
      method: 'POST',
      header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
      data: 
        {
          "newPassWord": md5.hex_md5(passwordRes),
          "oldPassWord": md5.hex_md5(this.data.oldPwd),
          "patriarchId": wx.getStorageSync('userInfo').patriarchId 
        },
      success(res) {
        if (res.data.code == '10000') {
            wx.showToast({
              title: '修改成功',
              duration:2000,
              success(res){
                wx.navigateBack({
                  delta: 2
                })
              }
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
          icon: 'none'
        })
      }
    })
  }
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