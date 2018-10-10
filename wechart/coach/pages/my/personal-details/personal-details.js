// pages/my/personal-details/personal-details.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    setting: [
      // { name: '登录密码', value: '修改' },
      { name: '交易密码', value: '修改' }
    ],
    array: ['教练', '助教','机构'],
    objectArray: [
      {
        id: 1,
        name: '教练'
      },
      {
        id: 2,
        name: '助教'
      },
      {
        id: 3,
        name: '机构'
      },
    ],
    index: 0,
    state: 'active',
    states: '',
    xuaned: false,
    date: '',
    userId:'',
    userType:'3',
    coachInfo:{},
    coachInfos: {},
    close:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({userId:options.userId})
  },
  //修改教练类型
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    var coachType = Number(e.detail.value)+1
    wx.request({
      url: app.url+'/v1/coach/update/coachTypeByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method:'GET',
      data:{
        'userId': this.data.userId,
        'coachType': coachType
      },
      success:function(res){
        console.log(res)
      }
    })
  },
  //修改姓名身份证
  names:function(e){
    wx.navigateTo({
      url: '../../../pages/my/alter-Guardian/alter-Guardian?realStatus=' + this.data.coachInfo.realStatus,
    })
    
  },
  switchBtn: function (e) {
    console.log(e.currentTarget.dataset.val)
    var _this = this;
    var status = e.currentTarget.dataset.val;
    if (status == 'open') {
      _this.setData({
        state: 'active',
        states: ''
      })
      openClose(_this, 1)
    } else if (status == 'close') {
      _this.setData({
        state: '',
        states: 'active'
      })
      openClose(_this, 2)
    }
  },
  //修改头像
  userImgHead: function (e) {
    var that = this;
    var userInfos = this.data.coachInfo;
    // wx.navigateTo({
    //   url: '../../../pages/wx-cropper/index',
    // })
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
            header: { 'token': wx.getStorageSync('userInfo').token },
            filePath: tempFilePaths[i],
            name: 'muFiles',
            formData: {
              'type': 'coach_img'
            },
            success: function (re) {
              var data = JSON.parse(re.data)
              if (data.code == '10000') {
                var photoAddress = data.response[0];
                userInfos.avatarUrl = photoAddress;
                wx.request({
                  url: app.url + '/v1/coach/update/coachAvatarUrlByUserId',
                  header: { 'token': wx.getStorageSync('userInfo').token },
                  method: 'GET',
                  data: {
                    'userId': that.data.userId,
                    'url': photoAddress
                  },
                  success: function (re) {
                    console.log("上传成功")
                    wx.hideLoading();
                    that.setData({ coachInfo: userInfos })
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  nickName:function(e){
    wx.navigateTo({
      url: '../../../pages/my/alter-Name/alter-Name?classType=' + this.data.coachInfo.coachType,
    })
  },
  modifyAddress: function (e) {
    let location=wx.getStorageSync("location");
    wx.navigateTo({
      url: '../../../pages/my/alter-site/alter-site?index='+location,
    })
  },
  modifyPhone: function (e) {
    wx.navigateTo({
      url: '../../../pages/my/alter-phone/alter-phone?from=myinfo',
    })
  },
  modifyPwd: function (e) {
    let that = this;
    console.log("modifyPwd");
    wx.request({
      url: app.url + '/v1/coach/query/haveTraderPasswordByUserId',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'POST',
      data: {
        'userId': that.data.userId
      },
      success: (res) => {
        console.log("請求成功")
        if (res.data.code == '10000') {
          var havePassword = res.data.response;
          wx.navigateTo({
            url: '../../../pages/my/alter-Password/alter-Password?havePassword=' + (havePassword==true?1:0),
          })
        }
      },
      fail: function (info) {
        console.log("請求失敗")
      }
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
    this.setData({ userType: wx.getStorageSync('coachBaseInfo').userType})
    app.noType();
    teacherInfor(this)
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
//請求教練簡介信息
function teacherInfor(that){
  wx.request({
    url: app.url+ '/v1/coach/get/coachBaseInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'userId': that.data.userId
    },
    success:(res)=>{
      console.log("請求成功")
      if(res.data.code=='10000'){
        var result = res.data.response;
        var arr = res.data.response;
        that.setData({coachInfos:arr})
        console.log(result)
        if (result.identityCode){
          var str1 = result.identityCode.replace(/(\d{3})(\d+)(\d{3})/, function (x, y, z, p) {
            var i = "";
            while (i.length < z.length) { i += "*" }
            return y + i + p
          })
          result.identityCode = str1
        } else if (result.phoneNo){
          var str2 = result.phoneNo.replace(/(\d{3})(\d+)(\d{3})/, function (x, y, z, p) {
            var i = "";
            while (i.length < z.length) { i += "*" }
            return y + i + p
          })
          result.phoneNo = str2
        }
        that.setData({
          coachInfo: result,
          index: result.coachType-1
        })
      }
    },
    fail:function(info){
      console.log("請求失敗")
    }
  })
}
function openClose(that,accountState){
  wx.request({
    url:app.url+'/v1/coach/update/coachAccountStateByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'userId': that.data.userId,
      'accountState': accountState
    },
    success:function(res){
      if(res.data.code=='10000'){
        console.log("修改状态成功")
        if (accountState==1){
          wx.showToast({
            title: '开启成功',
          })
        }else{
          wx.showToast({
            title: '关闭成功',
          })
        }
      }
    }
  })
}