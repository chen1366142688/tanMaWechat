// pages/gradeTable/gradeTableIndex/gradeTableIndex.js

let utils = require("../../../utils/util.js");
let http = utils.http;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherInfo : {
      imgUrl: "../../../image/avatarinit.png",
      name : "姓名",
      sex: "1",
      scholl: "学校",
      province: "四川",
      city : "成都",
      position : "教师"
    },
    isCheck : true,
    testType: ['请选择组名称'],
    activityId:[],    //测试组别对应的id
    classList: ["小学一年级", "小学二年级", "小学三年级", "小学四年级", "小学五年级","小学六年级","初一","初二","初三","高一","高二","高三"],
    classGrade: [],
    classIdList : [], //测试班级对应的id
    testIndex: 0,
    classIndex: 0,
    gradeIndex: 0,
    testList : []
  },
  // 选择数据提交状态
  checkState(){
    
    let lockObj={
      classId: this.data.classIdList[that.data.gradeIndex],
      activityId: this.data.activityId[that.data.testIndex],
      submitStatus: this.data.isCheck ? 0: 1
    }
    http("/v1/activity/test/class/", lockObj,"GET",(that,res)=>{
        that.setData({
          isCheck: !that.data.isCheck
        })
    },that)
  },
  // 获取学生详情
  getGradeDetail(e){
    if (this.data.isCheck){
      wx.showModal({
        // title: '',
        content: '本班数据已处于提交状态，不可修改。如需修改，请到最下方关闭提交状态。',
        showCancel : false
      })
      return false
    }
    if (e.currentTarget.dataset.testinfo.studentCount == 0){
      return false
    }
    let testObj = JSON.stringify(e.currentTarget.dataset.testinfo),
        schoolId = this.data.schoolId,
      activityId = this.data.activityId[this.data.testIndex];
    // console.log(activityId)
    wx.navigateTo({
      url: '../gradeDetail/gradeDetail?testObj=' + testObj + "&activityId=" + activityId + "&schoolId=" + schoolId
    })
  },
  // 改变测试组别的picker
  typeChange(e){
    this.setData({
      testIndex: e.detail.value,
      classIndex: 0,
      gradeIndex: 0
    })
    wx.setStorageSync("index", {
      testIndex: this.data.testIndex,
      classIndex: this.data.classIndex,
      gradeIndex: this.data.gradeIndex
      })
    // 调用获取班级列表
    getClass(that)
  },
  // 改变测试年级的picker
  classChange(e){
    this.setData({
      classIndex: e.detail.value,
      gradeIndex: 0
    })
    wx.setStorageSync("index", {
      testIndex: this.data.testIndex,
      classIndex: this.data.classIndex,
      gradeIndex: this.data.gradeIndex
    })
    // 调用获取班级列表
    getClass(that)
    
  },
  // 改变测试班级的picker
  gradeChange(e){
    this.setData({
      gradeIndex: e.detail.value
    })
    wx.setStorageSync("index", {
      testIndex: this.data.testIndex,
      classIndex: this.data.classIndex,
      gradeIndex: this.data.gradeIndex
    })
    // 调用测试情况列表
    testList(that)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
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
    let index = wx.getStorageSync("index") ? wx.getStorageSync("index")
      : {
        testIndex: 0,
        classIndex: 0,
        gradeIndex: 0
      }
    this.setData({
      testIndex: index.testIndex,
      classIndex: index.classIndex,
      gradeIndex: index.gradeIndex
    }) 
    let result = wx.getStorageSync("token").token
    if (!result) {
      wx.redirectTo({
        url: "/pages/login/login"
      })
    } else {
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
function getStorage(that){
  let user = wx.getStorageSync("userInfo");
  if (user){
    that.setData({
      teacherInfo: {
        imgUrl: user.avatarUrl ? user.avatarUrl : "../../../image/avatarinit.png",
        name: user.name,
        sex: user.gender,
        scholl: user.schoolName,
        province: user.provinceName,
        city: user.cityName,
        position: user.teacherType ==1 ? "教师" : "行政人员",
        schoolId: user.schoolId
      }
    })
  }
}

// 根据学校id获取测试组别回调
function testTypeList(that,res){
  let array = [];
  let arrayId = [];
  for (let i = 0 ; i < res.length;i++){
    array.push(res[i].activityName);
    arrayId.push(res[i].activityId )
  }
  that.setData({
    testType : array,
    activityId: arrayId
  })
  getGrades(that)
}

// 根据学校id获取年级
function getGrades(that){
  http("/v1/activity/school/grades", { schoolId: that.data.schoolId},"GET",(that,res)=>{
    let newClassList =[]
    for (let i = 0 ; i < res.length ; i++){
      newClassList[i] = that.data.classList[res[i]-1]
    }
    that.setData({
      classIndexList: res,
      newClassList: newClassList
    })
    // 调用获取班级列表
    getClass(that)
  },that)
}

// 根据年级，学校id获取班级列表
function getClass(that){
  let classObj = {
    grade: parseFloat(that.data.classIndexList[that.data.classIndex]),
    schoolId: that.data.schoolId
  }
  http("/v1/activity/class/list", classObj, "GET", getClasscb, that)
}
// 根据年级，学校id获取班级列表回调
function getClasscb(that,res){
  let classObj = [];
  let classId = [];
  for (let i = 0;i < res.length;i++){
    classObj.push(res[i].studentClass + "班")
    classId.push(res[i].classId)
  }
  that.setData({
    classGrade: classObj,
    classIdList : classId
    
  })
  // 调用测试情况列表
  testList(that)
}


// 根据活动id，学校id，年级，班级查询测试情况
function testList(that){
  // 获取测试列表参数对象
  let testObj = {
    grade: parseFloat(that.data.classIndexList[that.data.classIndex]),
    classId: that.data.classIdList[that.data.gradeIndex],
    activityId: that.data.activityId[that.data.testIndex],
    schoolId: that.data.schoolId
  }
  http("/v1/activity/item/list", testObj, "GET", testListcb,that)
}
// 根据活动id，学校id，年级，班级查询测试情况回调
function testListcb(that, res){
  that.setData({
    testList: res.classSchoolItemTestVO,
    isCheck: res.submitStatus == 1 ? true : false
  })
}

// token登录
function tokenLogin(that, res) {
  wx.setStorageSync("token", { token: res.oAuthTokenVO.token })
  wx.setStorageSync("userInfo", res)
  that.setData({
    schoolId: res.schoolId,
    isLogin : true
  })
  getStorage(that);
  http("/v1/activity/list", { schoolId: that.data.schoolId }, "GET", testTypeList, that)
}
// token登录失败
function tokenLoginfild(that, res) {
  wx.redirectTo({
    url: '../../../pages/login/login',
  })
}

