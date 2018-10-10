// pages/gradeTable/gradeDetail/gradeDetail.js
let utils = require("../../../utils/util.js");
let http = utils.http;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listIndex:1,
    isSearch : false,
    schoolTestId: 0,
    schoolId: 0,
    classId: 0,
    activityId: 0,
    resultExist: 1,
    classList: ["小学一年级", "小学二年级", "小学三年级", "小学四年级", "小学五年级", "小学六年级", "初一", "初二", "初三", "高一", "高二", "高三"],
    className : 0,
    gradeId : 0,
    gender: 0,
    classInfo : {
      classList : "五年级",
      classGrade : "二班",
      scoreYet : "20",
      scoreNot : "05"
    },
    stuList: []
  },
  // 搜索
  search(){
    // this.setData({
    //   isSearch: !this.data.isSearch
    // })
  },
  // 排序
  rank(){

  },
  // 选择性别
  checklist(e){
    if (!this.data.couldCheck){
      return false
    }
    this.setData({
      gender: e.currentTarget.dataset.index
    })
    getClassStudentList(that)
  },
  // 点击测试
  goTest(e){
    wx.navigateTo({
      url: '../testType/testType?testValue=' + JSON.stringify(e.currentTarget.dataset.value) + "&schoolTestId=" + this.data.schoolTestId + "&testName=" + this.data.testName + "&classId=" + this.data.classId + "&activityId=" + this.data.activityId + "&gender=" + this.data.gender + "&classList=" + this.data.classList[this.data.gradeId],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    // console.log(options)
    that = this;
    this.setData({
      schoolTestId: JSON.parse(options.testObj).schoolTestId,
      schoolId: options.schoolId ,
      classId: JSON.parse(options.testObj).classId ,
      activityId: options.activityId,
      scoreYet: JSON.parse(options.testObj).testStudentCount ,
      scoreNot: JSON.parse(options.testObj).studentCount - JSON.parse(options.testObj).testStudentCount,
      gradeId: JSON.parse(options.testObj).grade - 1,
      className: JSON.parse(options.testObj).studentClass ,
      gender: JSON.parse(options.testObj).gender,
      couldCheck: JSON.parse(options.testObj).gender == 0 ? true : false,
      testName: JSON.parse(options.testObj).schoolItemName
    })
    wx.setNavigationBarTitle({
      title: JSON.parse(options.testObj).schoolItemName 
    })
    if (this.data.scoreNot == 0){
      this.setData({
        resultExist : 0
      })
    }
    if (this.data.scoreYet == 0){
      this.setData({
        resultExist: 2
      })
    }
    // console.log(this.data.gradeId)
    
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
    getClassStudentList(that)
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

// 查询指定班级指定测试的测试情况列表
function getClassStudentList(that){
  let classObj = {
    schoolTestId: that.data.schoolTestId,
    schoolId: that.data.schoolId,
    classId: that.data.classId,
    activityId: that.data.activityId,
    resultExist: that.data.resultExist,
    gender: that.data.gender
  }
  http("/v1/activity/student/list", classObj, "GET", getClassStudentListcb,that)
}
// 查询指定班级指定测试的测试情况列表回调
function getClassStudentListcb(that,res){
  that.setData({
    stuList: res.classStudentTestVO ,
    scoreNot: res.studentCount - res.testStudentCount,
    scoreYet: res.testStudentCount
  })
}