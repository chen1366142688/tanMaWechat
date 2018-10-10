// pages/My/Alter-Name/Alter-Name.js
const app = getApp().globalData
Page({
  data: {
     oldNickName:"",
     newNickName:"",
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    this.setData({
      oldNickName: wx.getStorageSync("userInfo").nickName
    })
  },
  inputNewNickName: function (e) {
    this.setData({ newNickName: e.detail.value })
  },
  alertUserNickName: function (){
    let that = this;
    if (this.data.newNickName == ""){
      wx.showToast({
        title: '请输入昵称！',
        icon: 'none'
      })
      return false;
    }
    wx.request({
      url: app.rQUrl + '/v1/patriarch/updatePatriarchNickName',
      method: 'GET',
      header: { 'token': wx.getStorageSync("userInfo").oauthToken.token },
      data: {
        'patriarchId': wx.getStorageSync("userInfo").patriarchId,
        "nickName": this.data.newNickName,
      },
      success(res) {
        if (res.data.code == '10000') {
          wx.showToast({
            title: '修改成功！',
            icon: 'none'
          })
          let tempUserInfo =  wx.getStorageSync("userInfo");
          tempUserInfo.nickName = that.data.newNickName;
          wx.setStorageSync('userInfo', tempUserInfo)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 300);
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

  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})