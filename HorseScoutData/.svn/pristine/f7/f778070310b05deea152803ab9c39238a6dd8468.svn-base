// pages/gradeTable/Corporeity/Corporeity.js
let utils = require("../../../utils/util.js");
let http = utils.http;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentInfo : {
      birthday : "2018-05-02",
      schoolName : "学校"
    },
    classList: ["小学一年级", "小学二年级", "小学三年级", "小学四年级", "小学五年级", "小学六年级", "初一", "初二", "初三", "高一", "高二", "高三"],
    level: ["未知","优秀","良好","及格","不及格" ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // console.log(options)
    this.setData({
      activityId: options.activityId,
      schoolId: options.schoolId,
      studentId: options.studentId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    getStudentInfo(that)
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

// 获取该学生的信息
function getStudentInfo(that){
  let stuObj = {
    activityId: that.data.activityId,
    schoolId: that.data.schoolId,
    studentId: that.data.studentId
  }
  http("/v1/activity/student/test/detail", stuObj, "GET", getStudentInfocb,that)
}
// 获取该学生的信息回调
function getStudentInfocb(that,res){
  that.setData({
    studentInfo : res,
    scoreList: res.scoreList
  })
  // 改变标题
  wx.setNavigationBarTitle({
    title: that.data.studentInfo.studentName + "的体质测试"
  })
}
