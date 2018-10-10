// pages/gradeTable/gradeTableIndex/gradeTableIndex.js

let utils = require("../../../utils/util.js");
let http = utils.http;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherInfo : {
      imgUrl: "http://tanma-data.oss-cn-beijing.aliyuncs.com/user/img/1532683469988J4d761twMy.jpg",
      name : "狂欢节",
      sex: "1",
      scholl: "成都龙泉一中",
      province: "四川",
      city : "成都",
      position : "体育老师"
    },
    isCheck : true,
    testType: ['请选择组名称'],
    classList: ["小学一年级"],
    classGrade: ["七班"],
    testIndex: 0,
    classIndex: 0,
    gradeIndex: 0,
    testList : [{
      img: "http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/teacher/testheight.png",
      name : "学生身高",
      yet : "34",
      not : "12"
    }, {
        img: "http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/teacher/testheight.png",
        name: "学生身高",
        yet: "34",
        not: "12"
      },{
        img: "http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/teacher/testheight.png",
        name: "学生身高",
        yet: "34",
        not: "12"
      }]
  },
  pickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 选择数据提交状态
  checkState(){
    this.setData({
      isCheck : !this.data.isCheck
    })
  },
  // 获取学生详情
  getGradeDetail(){
    wx.navigateTo({
      url: '../gradeDetail/gradeDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
