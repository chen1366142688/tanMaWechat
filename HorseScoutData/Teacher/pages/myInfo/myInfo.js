// pages/myInfo/myInfo.js
let utils = require("../../utils/util.js");
let http = utils.http;
const app = getApp().globalData;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "../../image/avatarinit.png",
    teacherInfo: {
      name: "未知",
      sex: "1",
      scholl: "未知",
      province: "未知",
      city: "未知",
      position: "教师",
      schoolId: 0,
      phoneNum  : "未知"
    },
    positionArray: ["教师", "行政人员"]
  },
  // 退出登录
  logout(){
    wx.removeStorageSync("token")
    wx.removeStorageSync("userInfo")
    wx.redirectTo({
      url: '../login/login',
    })
  },
  // 修改
  setNewInfo(e){
    wx.navigateTo({
      url: '../My/' + e.currentTarget.dataset.info + "/" + e.currentTarget.dataset.info + "?userName=" + this.data.teacherInfo.name ,
    })
  },
  bindPosition(e){
    let postion = {
      teacherId: wx.getStorageSync("userInfo").teacherId,
      teacherType: parseFloat(e.detail.value) + 1
    }
    setPosition(that, postion)

  },
  // 上传图片
  pushImage(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中..',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.url + '/v1/file/upload', //仅为示例，非真实的接口地址
            header: {
              "token": wx.getStorageSync("token").token ? wx.getStorageSync("token").token : ""
              },
            filePath: tempFilePaths[i],
            name: 'muFiles',
            formData: {
              'type': 'teacher_img'
            },
            success: function (re) {
              var data = JSON.parse(re.data)
              if (data.code == '10000') {
                wx.hideLoading();
                that.setData({
                  imgUrl : data.response[0]
                })
                let avatarUrl = {
                  teacherId: wx.getStorageSync("userInfo").teacherId,
                  avatarUrl: data.response[0]
                }
                setAvatarUrl(that, avatarUrl)
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '图片大小超过5M,请重新上传'
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    getStorage(that);
    let result = wx.getStorageSync("token").token
    if (!result) {
      wx.redirectTo({
        url: "/pages/login/login"
      })
    } else {
      if (this.data.isLogin) {
        return false
      }
      http("/v1/auth/login/token", {}, "GET", tokenLogin, that, tokenLoginfild)
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

// 获取storage里面的信息
function getStorage(that) {
  let user = wx.getStorageSync("userInfo");
  if (user) {
    that.setData({
      teacherInfo: {
        name: user.name,
        sex: user.gender,
        scholl: user.schoolName,
        province: user.provinceName,
        city: user.cityName,
        position: user.teacherType == 1 ? "教师" : "行政人员",
        schoolId: user.schoolId,
        phoneNum: user.phoneNum 
      },
      imgUrl: user.avatarUrl ? user.avatarUrl : "../../image/avatarinit.png",
    })
  }
}

// 修改职业
function setPosition(that,postion){
  http("/v1/auth/update/teacher", postion,"GET",(res)=>{
    let user = wx.getStorageSync("userInfo")
    user.teacherType = postion.teacherType
    wx.setStorageSync("userInfo", user)
    that.onShow()
    wx.showToast({
      title: "修改成功",
      icon: 'success'
    })
  },that)
}
// 修改头像
function setAvatarUrl(that, avatarUrl) {
  http("/v1/auth/update/teacher", avatarUrl, "GET", (res) => {
    let user = wx.getStorageSync("userInfo")
    user.avatarUrl = avatarUrl.avatarUrl
    wx.setStorageSync("userInfo", user)
    that.onShow()
    wx.showToast({
      title: "修改成功",
      icon: 'success'
    })
  }, that)
}

// token登录
function tokenLogin(that, res) {
  wx.setStorageSync("token", { token: res.oAuthTokenVO.token })
  wx.setStorageSync("userInfo", res)
  that.setData({
    schoolId: res.schoolId
  })
  getStorage(that);
}
// token登录失败
function tokenLoginfild(that, res) {
  wx.redirectTo({
    url: '../../../pages/login/login',
  })
}
