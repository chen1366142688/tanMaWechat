 
// pages/index/Add-student/Add-student.js
var util = require('../../../utils/util.js');
const api = require('../../../utils/api.js')
const app = getApp().globalData;
let that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachNickName: '',
    search: '',
    studentList: [],
    dialog: false, //碳层
    tabImgGay: false, //自定义添加
    tabImgFay: false, //添加学员
    dialogen: false, //碳层
    value: '',
    pageNumber: 1,
    theNumber: 10,
    Period: false,
    stuName : "",
    stuPhone : ""
  },
  // 搜索按钮
  queryByName: function(e) {
    var that = this;
    this.setData({
      value : ""
    })
    this.orderStudentList(this.data.value)
  },
  // 输入框
  inputContent(e) {
    this.setData({ value: e.detail.value })
    this.orderStudentList(e.detail.value)
  },
  // 点击自定义添加
  custom: function(e) {
    var that = this;
    if (that.data.dialog) {
      that.setData({
        tabImgGay: false //蒙层显示
      })
    } else {
      that.setData({
        tabImgGay: true //蒙层消失
      })
    }
  },
  //自定义添加按钮点击蒙层
  dialog: function(e) {
    this.setData({
      dialog: true,
      tabImgGay: false //蒙层消失
    })
  },

  // 点击添加学员
  addstudent: function(e) {
    var that = this;
    that.setData({
      dialogen: true,
      tabImgFay: true ,//蒙层显示,
      orderCode: e.currentTarget.dataset.ordercode,
      studentUserId: e.currentTarget.dataset.studentuserid,
      studentId: e.currentTarget.dataset.studentid
    })
  },
  // 添加学员确认
  confirm(){
    if (this.data.attendId == ""){
      saveAttend()
    }else{
      saveStudent()
    }
    
  },
  // 添加学员取消
  cancel(){
    that.setData({
      dialogen: false,
      tabImgFay: false //蒙层消失
    })
  },
  // 自定义学员姓名
  stuName(e){
    this.setData({
      stuName: e.detail.value
    })
  },
  // 自定义学员电话
  stuPhone(e){
    this.setData({
      stuPhone : e.detail.value
    })
  },
  // 自定义学员提交
  submit(){
    if (this.data.attendId == "")
      saveAttendSyc()
    else
      submitStu()
  },
  orderStudentList:function(name){
    var that = this;
    wx.request({
      url: app.url + '/v1/attend/getClassOrderStudentList',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('userInfo').token
      },
      data: {
        classId: this.data.classId,
        studentName: name,
        attendId: this.data.attendId
      },
      success: function (res) {
        if (res.data.code == '10000') {
          if (res.data.response.length == 0) {
            that.setData({
              studentList: res.data.response,
              Period: true
            })
            return false;
          } else {
            that.setData({
              studentList: res.data.response,
              Period: false,
            })
          }
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
  },
  closeMock(){
    this.setData({
      tabImgGay : false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.setData({
      classId: options.classId,
      attendId: options.attendId == "null" ? "" : options.attendId,
      classSectionId: options.classSectionId,
      attendDate: options.attendDate
    });
    this.orderStudentList("");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
//添加学员
function saveStudent(){
  let paramsObj={
    orderCode: that.data.orderCode,
    studentUserId: that.data.studentUserId,
    studentId: that.data.studentId,
    attendId : that.data.attendId
  }
  api._post('/v1/attend/saveStuScheduleByCoach', paramsObj).then(res => {
    if (res.code == 10000) {
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
    that.setData({
      dialogen: false,
      tabImgFay: false //蒙层消失
      
    })
  }).catch(e => {
    console.log(e)
  })
}

// 添加学员保存虚拟开课
function saveAttend(){
  let paramsObj = {
    classId: that.data.classId,
    classSectionId: that.data.classSectionId,
    attendDate: that.data.attendDate
  }
  api._get('/v1/attend/saveAttendForSys', paramsObj).then(res => {
    if (res.code == 10000) {
      that.setData({
        attendId : res.msg
      })
      saveStudent()
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
    that.setData({
      dialogen: false,
      tabImgFay: false //蒙层消失
    })
  }).catch(e => {
    console.log(e)
  })
}
// 自定义学员保存虚拟开课
function saveAttendSyc() {
  let paramsObj = {
    classId: that.data.classId,
    classSectionId: that.data.classSectionId,
    attendDate: that.data.attendDate
  }
  api._get('/v1/attend/saveAttendForSys', paramsObj).then(res => {
    if (res.code == 10000) {
      that.setData({
        attendId: res.msg
      })
      submitStu()
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
    that.setData({
      dialogen: false,
      tabImgFay: false //蒙层消失
    })
  }).catch(e => {
    console.log(e)
  })
}
// 自定义学员提交
function submitStu(){
  if (that.data.stuName == ""){
    wx.showToast({
      title: '请填写学生姓名',
      icon:"none"
    })
    return false
  }
  
  let paramsObj = {
    studentName: that.data.stuName,
    phoneNum: that.data.stuPhone,
    attendId: that.data.attendId
  }
  api._get('/v1/attend/saveStuScheduleByCoachCustom', paramsObj).then(res => {
   if (res.code == 10000){
     that.setData({
      tabImgGay: false //蒙层消失
     })
    wx.navigateBack({
      delta:1
    })
   }
  }).catch(e => {
    console.log(e)
  })
}
