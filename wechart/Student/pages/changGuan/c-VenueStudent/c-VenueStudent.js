// pages/changGuan/c-VenueStudent/c-VenueStudent.js
var util = require('../../../utils/util.js');
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    guanKe: false,
    guanJie: true,
    van: 'van-ac',
    vans: '',
    userId:"",
    commentList:[],
    gradesList:[],
    classList:[],
    avatarUrl:"",
    described:"",
    gender:"",
    phone:"",
    studentType:"",
    studentNickName:""
  },
  kecheng: function (e) {
    var val = e.currentTarget.dataset.val;
    var that = this;
    if (val == 1) {
      that.setData({
        van: 'van-ac',
        vans: '',
        guanKe: false,
        guanJie: true,
      })
    } else if (val == 2) {
      that.setData({
        van: '',
        vans: 'van-ac',
        guanKe: true,
        guanJie: false,
      })
    }
  },
  toClassDetail:function(e){
    var classid = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + classid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        userId: options.userId
      });
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
    let that = this;
    app.noType();
    querytCoachComments(that);
    queryStudentGrades(that);
    queryStudentClass(that);
    queryStudentAdultInfoByUserId(that);
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

})

function querytCoachComments(that) {
  wx.request({
    url: app.url + '/v1/student/get/studentEvaluateByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == "10000") {
        that.setData({
          commentList: res.data.response
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '网络异常'+info,
        icon: "none"
      });
    }
  })
}

function queryStudentGrades(that) {
  wx.request({
    url: app.url + '/v1/student/get/myItemGradeByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == "10000") {
        that.setData({
          gradesList: res.data.response
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: "none"
      });
    }
  })
}

function queryStudentAdultInfoByUserId(that){
  wx.request({
    url: app.url + '/v1/student/get/studentAdultInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == "10000") {
        let data = res.data.response;
        that.setData({
          avatarUrl: data.avatarUrl,
          described: data.described,
          gender: data.gender,
          phone: data.phone,
          studentType: data.studentType,
          studentNickName: data.studentNickName
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: "none"
      });
    }
  })
}

function queryStudentClass(that) {
  wx.request({
    url: app.url + '/v1/student/get/studentJionClassInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == "10000") {
        let data = res.data.response;
        if (data) {
          for (var i = 0; i < data.length; i++) {
            data[i].itemStudentGrade = util.stringPrefixSet(data[i].itemStudentGrade, ' L');
          }
        }
        that.setData({
          classList: data
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: "none"
      });
    }
  })
}