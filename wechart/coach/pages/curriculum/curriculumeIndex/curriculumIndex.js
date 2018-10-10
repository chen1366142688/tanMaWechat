
var util = require('../../../utils/util.js');
const app = getApp().globalData
const system = wx.getSystemInfoSync()
const api = require('../../../utils/api.js')
let that;
Page({
    data:{
      imgUrl: app.imgUrl,
      userId:"2",
      pageNumber:"1",
      theNumber:"100",
      classList:[],
      baseHeight:182,
      canAddClass:false,
      cocahInfo :{},
      userId : ""
  },
  onLoad(options) {
    
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () { },
  onReady: function () { },
  onShow: function () {
      that = this;
      app.noType();
      cocahInfo();
      let userInfo = wx.getStorageSync("userInfo");
      let coachType = wx.getStorageSync("coachBaseInfo").userType;
      let coachBaseInfo = wx.getStorageSync("coachBaseInfo");
      let canAddClass = that.data.canAddClass;
      if(coachType=='3'){
        canAddClass=true
      }else{
        countNumByUserId(that)
      }
      that.setData({
        userId: userInfo.userId,
        canAddClass: canAddClass,
        curriculumInfo: coachBaseInfo
      })
    queryClassList(that, userInfo.userId);
  },


  toClassDetail:function(e){
    let that = this;
    var classId = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '../Course-Details/Course-Details?classId=' + classId
    })
  },
  addClasses:function(e){
    var vm=this;
    // let coachType = wx.getStorageSync("coachBaseInfo").userType;
    lastCheck(vm);
  }
})

function queryClassList(that,userId) {
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.url + '/v1/class/getCoachClassInfoList',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      userId: userId,
      pageNumber: that.data.pageNumber,
      theNumber: that.data.theNumber
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let tempList = res.data.response;
        for (let i = 0; i < tempList.length; i++) {
          tempList[i].itemStudentGrade = 'L' + tempList[i].itemStudentGrade.replace(new RegExp(",", 'g'), " L");
          tempList[i].lastModifyTime = tempList[i].lastModifyTime.substr(0, 10);
          // tempList[i].classPhotoAddress = tempList[i].classPhotoAddress  + '?x-oss-process=image/resize,m_mfit,w_' + (system.windowWidth-25);
        }
        that.setData({
          classList: tempList
        })
      } else if (res.data.code == '30005'){
          wx.navigateTo({
            url: '../../Introduction/Introduction',
          })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
      wx.hideLoading();
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}

function countNumByUserId(that) {
  wx.request({
    url: app.url + '/v1/coach/countNumByUserId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        if(res.data.response>0){
          that.setData({
            canAddClass: true
          })
        }else{
          that.setData({
            canAddClass: false
          })
        }
      } else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
      wx.hideLoading();
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
};

function lastCheck(that) {
  wx.request({
    url: app.url + '/v1/coach/countNumByUserId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let coachType = wx.getStorageSync("coachBaseInfo").userType;
        if (coachType == '3') {
          wx.navigateTo({
            url: '../Course-Composer/Course-Composer'
          })
        }
        if (res.data.response > 0) {
          that.setData({
            canAddClass: true
          });
          wx.navigateTo({
            url: '../Course-Composer/Course-Composer'
          })
        } else {
          that.setData({
            canAddClass: false
          });
          wx.showToast({
            title: '您暂时没有权限添加课程',
            icon: 'none',
            duration: 2000
          })
        }
      } else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
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

// 获取教练信息
function cocahInfo(){
  // let paramsObj = {
  //   userId : wx.getStorageSync("userInfo").userId
  // }
  api._get('/v1/coach/getCoachSimInfoByUserId').then(res => {
    that.setData({
      cocahInfo: res.response,
      userId: res.response.userId
    })
    // console.log(res)
  }).catch(e => {
    console.log(e)
  })
}
