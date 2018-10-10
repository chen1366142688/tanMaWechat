// pages/Patriarch/Register/Register.js
const  md5= require('../../../utils/md5.js');
const app = getApp().globalData
var regPhone = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
// var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.url,
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'headline-border',
    coursepersonbnotice: '',
    showSendCode:false,
    NickName:'',
    phoneNo:'',
    code:'',
    pwd:'',
    pwdAging:'',
    phoneNoIsOk: false,
    codeIsOk: false,
    pwdIsOk: false,
    pwdAgingIsOk: false,
    loginPhone:'',
    loginPwd:'',
    nickNAmeIsOk:false,
    thisTime: 60,
    showCode: false,
    loginPhoneIsOk:false,
    loginPwdIsOk:false,
    avatarUrl:"",
  },
  //点击切换tabbar
  Register(e) {
    var val = e.currentTarget.dataset.val;
    var that = this;
    if (val == 1) {
      that.setData({
        coursepersona: 'headline-border',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 2) {
      that.setData({
        coursepersona: '',
        coursepersonbnotice: 'headline-border',
        trainingcourse: true,
        noticecoursetab: false,
      })
    }
  },
  inputNickName(e){
    this.setData({ NickName: e.detail.value})
    //去判断是否可以使用该昵称
  },
  inputPhoneNo(e){
    this.setData({phoneNo:e.detail.value})
    if (e.detail.value.length == 11 && regPhone.test(e.detail.value)) {
      this.setData({ phoneNoIsOk: true })
    } else {
      this.setData({ phoneNoIsOk: false })
    }
  },
  inputCode(e){
    this.setData({ code: e.detail.value })
  },
  inputPwd(e){
    this.setData({ pwd: e.detail.value })
    if (CheckPassWord(e.detail.value)) {
      this.setData({ pwdIsOk: true })
    } else {
      this.setData({ pwdIsOk: false })
    }
    if (this.data.pwdAging == e.detail.value) {
      this.setData({ pwdAgingIsOk: true })
    } else {
      this.setData({ pwdAgingIsOk: false })
    }
  },
  inputPwdAging(e) {
    this.setData({ pwdAging: e.detail.value })
    if (this.data.pwd == e.detail.value) {
      this.setData({ pwdAgingIsOk: true })
    } else {
      this.setData({ pwdAgingIsOk: false })
    }
  },
  loginPhone(e){
    this.setData({ loginPhone: e.detail.value })
    if (e.detail.value.length == 11 && regPhone.test(e.detail.value)){
      this.setData({ loginPhoneIsOk: true })
      getAvaByPhoneNo(this,e.detail.value);
    } else {
      this.setData({ loginPhoneIsOk: false })
    }
  },
  loginPwd(e){
    this.setData({ loginPwd: e.detail.value })
    if (CheckPassWord(e.detail.value)) {
      this.setData({ loginPwdIsOk: true })
    }else{
      this.setData({ loginPwdIsOk: false })
    }
  },
  subLogin(e){
    const that = this;
    let phoneNo = that.data.loginPhone;
    let loginPwd = that.data.loginPwd;
    if (phoneNo.length <= 0){
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none'
      })
      return false;
    }
  
    if (regPhone.test(phoneNo)){
      console.log("手机号正确")
    }else{
      wx.showToast({
        title: '手机号格式不正确！',
        icon:'none'
      })
      return false;
    }
    if (loginPwd.length <= 0) {
      wx.showToast({
        title: '请输入密码！',
        icon: 'none'
      })
      return false;
    }
    if (CheckPassWord(loginPwd)){
      console.log("密码ok")
    }else{
      wx.showToast({
        title: '密码必须是6-18位的数字和字母组合！',
        icon:'none'
      })
      return false;
    }
    //登录
    login(that)
  },
  ForgetPassword(e){
    wx.navigateTo({
      url: "../../../pages/login/Forget-Password/Forget-Password",
    })
  },
  //点击发送验证码
  sendCode (e) {
    var that = this;
    var phoneNum = that.data.phoneNo;
    if (regPhone.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  submitLogin(e){
    const that = this;
    let nickName = that.data.NickName;
    let phoneNo = that.data.phoneNo;
    let password = that.data.pwd;
    let passwordRes = that.data.pwdAging;
    let code = that.data.code;
    //判断昵称
    if (nickName.length > 0) { 
      console.log("昵称ok")
    } else {
      wx.showToast({
        title: '请输入昵称！',
        icon: 'none'
      })
      return;
    }
    if (phoneNo.length <= 0){
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'none'
      })
      return;
    }
    //判断手机
    if (regPhone.test(phoneNo)) {
      console.log("手机ok")
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
      return;
    }
    if (code.length <= 0) {
      wx.showToast({
        title: '请输入短信验证码！',
        icon: 'none'
      })
      return;
    }
    if (password.length <= 0) {
      wx.showToast({
        title: '请输入登录密码！',
        icon: 'none'
      })
      return;
    }
    //判断密码
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
    register(that)
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    this.setData({
      avatarUrl: app.url + "Head-Portraits.png"
    })
    if (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").phoneNum){
      console.log(wx.getStorageSync("userInfo").phoneNum);
      this.setData({
        loginPhone: wx.getStorageSync("userInfo").phoneNum,
        coursepersona: '',
        coursepersonbnotice: 'headline-border',
        trainingcourse: true,
        noticecoursetab: false,
        loginPhoneIsOk: true
      })
      if (wx.getStorageSync("userInfo").avatarUrl && wx.getStorageSync("userInfo").avatarUrl.length > 5){
        this.setData({
          avatarUrl: wx.getStorageSync("userInfo").avatarUrl
        })
      }
    }else{
      this.setData({
        coursepersona: 'headline-border',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
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
    url: app.rQUrl + '/v1/auth/sendSmsForRegister',
    data: {
      "phoneNum": phone
    },
    method: 'GET',
    success: function (res) {
      console.log(res)
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
function register(that){
  let code = that.data.code;
  let nickName = that.data.NickName;
  let password = that.data.pwd;
  let passwordRes = that.data.pwdAging;
  let phoneNo = that.data.phoneNo;
  if (nickName == '') {
    wx.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return false;
  }
  if (phoneNo == '') {
    wx.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return false;
  }
  if (code == ''){
    wx.showToast({
      title: '请输入验证码',
      icon:'none'
    })
    return false;
  }
  if (password == '') {
    wx.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return false;
  }
  if (passwordRes == '') {
    wx.showToast({
      title: '请确认二次密码',
      icon: 'none'
    })
    return false;
  }
  
  wx.request({
      url: app.rQUrl+'/v1/auth/userRegister',
      method: 'POST',
      data: {
        "code": code,
        "nickName": nickName,
        "password": md5.hex_md5(password),
        "passwordRes": md5.hex_md5(passwordRes),
        "phoneNum": phoneNo
      },
      success(res){
        console.log(res)
        if(res.data.code=='10000'){
          wx.showToast({
            title: '注册成功',
            icon:'none'
          })
          that.setData({
            coursepersona: '',
            coursepersonbnotice: 'headline-border',
            trainingcourse: true,
            noticecoursetab: false,
          })
          //登录成功后缓存用户信息
          wx.setStorageSync('userInfo', res.data.response);
          wx.switchTab({
            url: '../../../pages/Patriarch/Patriarch-Index/Patriarch-Index',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
      fail(info){
        wx.showToast({
          title: info.data.msg,
          inco:'none'
        })
      }
    })
}

function getAvaByPhoneNo(that,phoneNo){
  that.setData({
    avatarUrl: app.url + "Head-Portraits.png"
  })
  if (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").phoneNum == phoneNo){
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
        if (res.data.response){
            that.setData({
              avatarUrl: res.data.response
            })
         }
      }
    }
  })
}

function login(that){
  let phoneNo = that.data.loginPhone;
  let loginPwd = that.data.loginPwd;
  if(phoneNo !== '' && loginPwd  !== ''){
    wx.request({
      url: app.rQUrl + '/v1/auth/login/password',
      method: 'POST',
      data: {
        'code':'',
        "password": md5.hex_md5(loginPwd),
        "userPhone": phoneNo
      },
      success(res) {
        if (res.data.code == '10000') {
          wx.showToast({
            title: '登录成功',
            icon: 'none'
          })
          wx.setStorageSync('userInfo', res.data.response)
          wx.switchTab({
            url: '../../../pages/index/index',
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
  }else{
    wx.showToast({
      title: '请填写正确的信息',
      icon:'none'
    })
  }
  
}

