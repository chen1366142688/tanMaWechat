// pages/curriculum/curriculumDetail/curriculumDetail.js
const api = require('../../../utils/api.js')
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/coach/iteration/',
    stuList : [],
    coach : {},
    mockInfo : "",
    path: "pages/techer/share-ClassNew/share-ClassNew?isCoach=1&cocahId=",
    deleteType : 1  //删除类型1是课程，2是学员
  },
  // 修改课堂信息
  changeClass(){
    wx.navigateTo({
      url: '../../index/redact/redact?attendId=' + this.data.attendId + "&classId=" + this.data.classId + "&classSectionId=" + this.data.classSectionId + "&attendDate=" + this.data.attendDate.split(",").join("-") + '&isCoach=1',
    })
  },
  // 删除课程
  deleClass(){
    this.setData({
      isMock : true,
      mockInfo: "确定要删除该堂课吗",
      deleteType : 1
    })
  },
  // 取消
  cancel(){
    this.setData({
      isMock: false
    })
  },
  // 确认
  sure(){
    if (this.data.deleteType == 1){
      if (that.data.attendId != "null") {
        deleAttendDetail()
      }else {
        let Obj = {
          classId: that.data.classId,
          classSectionId: that.data.classSectionId,
          attendDate: that.data.attendDate
        }
        deleAttendDetailForSys(Obj)
      }
    }else{
      deleStudent(this.data.scheduleObj)
    }
  },
  // 点击旷课
  truant(e){
    let Obj = {
      scheduleId: e.currentTarget.dataset.scheduleid,
      signStatus : 2
    }
    changeSign(Obj, e.currentTarget.dataset.index)
    
  },
  // 点击取消旷课
  cancelTruant(e){
    let Obj = {
      scheduleId: e.currentTarget.dataset.scheduleid,
      signStatus: 0
    }
    changeSign(Obj, e.currentTarget.dataset.index)
  },
  // 添加学员
  addStu(){
    wx.navigateTo({
      url: '../../index/Add-student/Add-student?classId=' + this.data.coach.classId + "&attendId=" + that.data.attendId + "&classSectionId=" + this.data.classSectionId + "&attendDate=" + this.data.attendDate.split(",").join("-"),
    })
  },
  // 移除学员
  deleStu(e){
    let scheduleObj = { scheduleId : e.currentTarget.dataset.scheduleid};
    this.setData({
      isMock: true,
      mockInfo: "是否移除" + e.currentTarget.dataset.name,
      deleteType : 2,
      scheduleObj: scheduleObj
    })
    
  },
  // 拨打电话
  phonecallevent: function (e) {
    if (e.currentTarget.dataset.phone ==""){
      wx.showToast({
        title: '没有电话',
        icon : "none"
      })
      return false
    }
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    that = this;
    this.setData({
      attendId: options.attendId,
      classId : options.classId,
      classSectionId: options.classSectionId,
      attendDate: options.attendDate
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
    if (this.data.attendId != "null"){
      getAttendDetail()
    }
    else{
      let Obj = {
        classId: this.data.classId,
        classSectionId: this.data.classSectionId,
        attendDate: this.data.attendDate
      }
      getAttendDetailForSys(Obj)
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
// 获取详情
function getAttendDetail(){
  let paramsObj = {
    attendId: that.data.attendId
  }
  api._get('/v1/attend/getAttendDetailNew', paramsObj).then(res => {
    // console.log(res)
    that.setData({
      coach: res.response,
      stuList: res.response.studentVO ,
      path: that.data.path + wx.getStorageSync("userInfo").userId + "&attendId=" + paramsObj.attendId,
    })
  }).catch(e => {
    console.log(e)
  })
}
// 获取虚拟开课详情
function getAttendDetailForSys(obj){
  api._get('/v1/attend/getAttendDetailNewForSys', obj).then(res => {
    that.setData({
      coach: res.response,
      stuList: res.response.studentVO,
      path: that.data.path + wx.getStorageSync("userInfo").userId+ "&classId=" + obj.classId + "&classSectionId=" + obj.classSectionId + "&attendDate=" + obj.attendDate
    })
  }).catch(e => {
    console.log(e)
  })
}
// 删除开课
function deleAttendDetail(){
  let paramsObj = {
    attendId: that.data.attendId
  }
  api._get('/v1/attend/deleteAttend', paramsObj).then(res => {
    if (res.code==10000){
      wx.navigateBack({
        delta:1
      })
    }else{
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
    that.setData({
      isMock: false
    })
  }).catch(e => {
    console.log(e)
  })
}

// 删除虚拟开课
function deleAttendDetailForSys(obj) {
  api._get('/v1/attend/updateAttendForSys', obj).then(res => {
    if (res.code == 10000){
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
      isMock: false
    })
  }).catch(e => {
    console.log(e)
  })
}

// 移除学员
function deleStudent(obj){
  api._get('/v1/attend/deleteAttendStudent', obj).then(res => {
    if (res.code == 10000){
      if (that.data.attendId != "null") {
        getAttendDetail()
      }
      else {
        let Obj = {
          classId: that.data.classId,
          classSectionId: that.data.classSectionId,
          attendDate: that.data.attendDate
        }
        getAttendDetailForSys(Obj)
      }
      that.setData({
        isMock : false
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
      that.setData({
        isMock: false
      })
    }
  }).catch(e => {
    console.log(e)
  })
}

// 改变签到状态
function changeSign(obj,index){
  api._get('/v1/attend/updateAttendSignStatusNew', obj).then(res => {
    if (res.code == 10000){
      that.data.stuList[index].signStatus = obj.signStatus

      that.setData({
        stuList: that.data.stuList
      })
    }
  }).catch(e => {
    console.log(e)
  })
}
