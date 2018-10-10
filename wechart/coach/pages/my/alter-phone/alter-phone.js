// pages/my/alter-phone/alter-phone.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    thisTime: 60,
    code: true,
    phone: '',
    userCode: '',
    userId: '',
    prevPage:{},
    oldCode:"",
    showType:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from =='myinfo'){
       this.setData({
         showType:'old',
         oldCode: ""
       })
    }else{
      this.setData({
        showType: 'new',
        oldCode: options.oldCode
      })
    }
  },
  sunMit: function () {
    var that = this;
    var regExp = /^[1][0-9]{10}$/;
    var code = this.data.userCode;
    var userId = this.data.userId;
    var phoneNum = this.data.phone;
    if (code == '' || userId == '' ){
      wx.showToast({
        title: '请输入正确的手机号或验证码',
        icon:'none'
      })
      return false;
    }
    if (regExp.test(phoneNum)) {
      if (that.data.showType == 'old'){
        //校验验证码
        wx.request({
          url: app.url + '/v1/common/checkSMS',
          method: 'POST',
          header: { 'token': wx.getStorageSync('userInfo').token },
          data: {
            "code": code,
            "type": "7",
            "userId": userId,
            "userPhoneNo": phoneNum
          },
          success: function (res) {
            if (res.data.code == '10000') {
              wx.navigateTo({
                url: '../../../pages/my/alter-phone/alter-phone?from=new&oldCode=' + that.data.userCode,
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }else{
        //校验验证码
        wx.request({
          url: app.url + '/v1/common/checkSMS',
          method: 'POST',
          header: { 'token': wx.getStorageSync('userInfo').token },
          data: {
            "code": code,
            "type": "5",
            "userId": userId,
            "userPhoneNo": phoneNum
          },
          success: function (res) {
            if (res.data.code == '10000') {
              var urls = app.url + '/v1/coach/update/coachPhoneNoByUserId';
              wx.request({
                url: urls,
                method: 'GET',
                header: { 'token': wx.getStorageSync('userInfo').token },
                data: {
                  userId: userId,
                  phoneNo: phoneNum,
                  oldCode:that.data.oldCode,
                  newCode:code
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
                  }else{
                    wx.showToast({
                      title: re.data.msg,
                      icon: 'none'
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    }else{
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  userNameInput: function (e) {
    this.setData({ phone: e.detail.value })
  },
  sendCode: function (e) {
    var regExp = /^[1][0-9]{10}$/;
    var that = this;
    var phoneNum = this.data.phone;
    if (regExp.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  userCode: function (e) {
    this.setData({
      userCode: e.detail.value
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
    app.noType();
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2].data;  //上一个页面
    if (prevPage.coachInfos){
      this.setData({ phone: prevPage.coachInfos.phoneNo ? prevPage.coachInfos.phoneNo : '' })
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
  var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
  var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
  var userId = wxPrevPage.data.userId;
  let typeTemp ='5';
  if(that.data.showType=='old'){
    typeTemp='7';
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
        that.setData({ code: false, userId: userId});
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