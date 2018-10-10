// pages/venue-register/venue-register.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
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
    array: ['环球中心', '体育中心', '奥体中心', '三里屯太古里'],
    objectArray: [
      {
        id: 0,
        name: '环球中心' 
      },
      {
        id: 1,
        name: '体育中心'
      },
      {
        id: 2,
        name: '奥体中心'
      },
      {
        id: 3,
        name: '三里屯太古里'
      }
    ],
    index: 0,
    phoneNumber:'',
    code:'',
    niCheng:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        reverseLocation(that, latitude, longitude)
      }
    })
  },
  //输入手机号
  shuRu:function(e){
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  //发送验证码  
  sendCode:function(e){
    var that = this;
    var user=wx.getStorageSync('userInfo')
    var phoneNum = that.data.phoneNumber;
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (reg.test(phoneNum)) {
      sendCoded(that, user.userId, '1', phoneNum);
    }else{
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
  shuCode: function(e) {
    var _this=this;
    this.setData({
      code: e.detail.value
    })
  },
  //昵称
  name:function(e){
    console.log(e)
    this.setData({
      niCheng:e.detail.value
    })
  },
  //提交的时候验证验证码是否正确
  submit:function(){
    var that=this;
    var user = wx.getStorageSync('userInfo') 
    if (that.data.index !== '' && that.data.niCheng !== '' && that.data.phoneNumber !== '' && that.data.code !== '' && user.userId !== ''){
      var homeId = parseInt(that.data.index) + Number(1);
      if (misBat(that, that.data.code, user.userId, '1', that.data.phoneNumber) == 200){
        console.log("ok")
        setTimeout(function () {
          login(homeId, user.userId, that.data.niCheng, that.data.phoneNumber, that.data.code)
        }, 200)
      }else{
        console.log("badResult")
      }
    }else{
      wx.showToast({
        title: '请填写完整信息',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
function sendCoded(that,uid,types,phone){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/common/sendSMS',
    method: 'POST',
    header: {
      'content-type': 'application/json' 
    },
    data:{
      'type': types,
      'userId':uid,
      'userPhoneNo':phone
    },
    success:function(res){
      console.log("发送成功")
    },
    fail:function(info){
      console.log("发送失败")
    }
  })
}
//校验验证码是否正确
function misBat(that,code, uid, types, phone) {
  wx.request({
    url: 'http://192.168.3.4:8081/v1/common/checkSMS',
    method: 'POST',
    data: {
      'code':code,
      'type': types,
      'userId': uid,
      'userPhoneNo': phone
    },
    success: function (res) {
      if(res.code == '10000'){
        console.log("验证成功")
        return 200;
      }else{
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
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: lat,
      longitude: lon
    },
    success: function (res) {
      that.setData({
        address: res.result.address_component.city
      })
      //请求场馆列表
      wx.request({
        url: 'http://192.168.3.4:8081/v1/home/get/homeIdAndHomeNameList',
        method: 'POST',
        data: { 'cityName': res.result.address_component.city },
        success: function (res) {
          var result = res.data.response;
          var arr=[];
          for(let i=0;i<result.length;i++){
            arr.push(result[i].homeName);
          }
          setTimeout(function(){
            that.setData({
              objectArray: result,
              array: arr
            })
          },100)    
        },
        fail: function (info) {
          wx.showModal({
            title: '提示',
            content: '服务器故障',
          })
        }
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
function login(homeId, userId, userName, userPhoneNo, verificationCode){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/home/add/studentregioninfo',
    method:'POST',
    data: {
      "homeId": homeId,
      "userId": userId,
      "userName": userName,
      "userPhoneNo": userPhoneNo,
      "verificationCode": verificationCode
    },
    success:function(res){
      console.log("注册成功："+res)
    },
    fail:function(info){
      console.log("注册失败了")
    }
  })
}