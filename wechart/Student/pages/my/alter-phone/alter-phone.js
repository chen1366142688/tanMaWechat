// pages/my/alter-phone/alter-phone.js
const app=getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    thisTime:60,
    code:true,
    phone:'',
    userCode:'',
    userId: '', 
    studentType:'',
    name:'',
    oldCode: "",
    showType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.name=="student"? this.setData({name:'student'}) : this.setData({name:''})
    wx.setNavigationBarTitle({
      title: options.name == 'student' ? "修改绑定手机" : "修改监护人手机"
    })
    this.setData({
      studentType: options.studentType
    })


    if (options.from =='myinfo'){
      if (options.name == "student"){
        queryUserInfo(this);
      }else{
        this.setData({
          phone: options.guardianPhoneNo
        })
      }
      this.setData({
        showType: 'old',
        oldCode: ""
      })
    }else{
      this.setData({
        showType: 'new',
        oldCode: options.oldCode
      })
    }
  },
  sunMit:function(){
    var that=this;
    var regExp = /^[1][0-9]{10}$/;
    var code=this.data.userCode;
    var userId = wx.getStorageSync('userInfo').userId;
    var phoneNum=this.data.phone;
    var studentType = this.data.studentType
    let typeTemp = '4';
    if (that.data.showType == 'old') {
      typeTemp = '8';
    }
    if (that.data.name && that.data.name == 'student'){
      if (regExp.test(phoneNum)) {
        //校验验证码
        wx.request({
          url: app.url + '/v1/common/checkSMS',
          method: 'POST',
          header: { 'token': wx.getStorageSync('userInfo').token },
          data: {
            "code": code,
            "type": typeTemp,
            "userId": userId,
            "userPhoneNo": phoneNum
          },
          success: function (res) {
            if (res.data.code == '10000') {
              if (that.data.showType == 'old') {
                wx.navigateTo({
                  url: '../../../pages/my/alter-phone/alter-phone?name=student&from=new&oldCode=' + that.data.userCode,
                })
              } else {
                updateStudentPhone(userId, phoneNum, code, that.data.oldCode)
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: '请输入正确的手机号码！',
          icon: 'none'
        })
      }
    }else{
      updateStudentGudianPhone(userId, phoneNum);
    }
  },
  userNameInput:function(e){
    this.setData({phone:e.detail.value})
  },
  sendCode:function(e){
    var regExp = /^[1][0-9]{10}$/;
    var that=this;
    var phoneNum=this.data.phone;
    if (regExp.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  userCode:function(e){
    this.setData({
      userCode:e.detail.value
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
})
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
      code: true,
      thisTime: 60
    });
  }

}
//发送验证码
function sendCoded(that, phone) {
  var userId = wx.getStorageSync('userInfo').userId;
  var studentType = that.data.studentType;
  let typeTemp = '4';
  if (that.data.showType == 'old') {
    typeTemp = '8';
  }
  wx.request({
    url: app.url + '/v1/common/sendSMS',
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'type': typeTemp,
      'userId': userId,
      'userPhoneNo': phone
    },
    success: function (res) {
      var result = res.data;
      if (result.code == 10000) {
        wx.showToast({
          title: '验证码发送成功，请注意查收！',
          icon: 'none'
        })
        that.setData({ code: false, userId: userId, studentType: studentType});
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
function updateStudentGudianPhone(userId, phoneNum){
  wx.request({
    url: app.url + '/v1/student/update/studentGuardianPhoneNoByUserId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'userId': userId,
      'phoneNo': phoneNum
    },
    success: function (re) {
      if (re.data.code == '10000') {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  })
};
function updateStudentPhone(userId, phoneNum, code, oldCode){
  wx.request({
    url: app.url + '/v1/student/updateStudentSelfPhoneNoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      userId: userId,
      phoneNo: phoneNum,
      oldCode: oldCode,
      newCode: code
    },
    success: function (re) {
      if (re.data.code == '10000') {
        wx.showToast({
          title: '操作成功！',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 2
        })
      }
    }
  })
}

function queryUserInfo(that) {
  wx.request({
    url: app.url + '/v1/student/get/studentSimpleInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
          that.setData({
            phone: res.data.response.phoneNo
          })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}