// pages/gradeTable/testDetail/testDetail.js
let utils = require("../../../utils/util.js");
let http = utils.http;
var that;
let resultArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentInfo: [],
    rowNumNow : 0,   //当前的swiper的下标
    resultSign : true,
    result :[],
    pointValue : 0
  },
  // 获取滚动值
  getValue(e) {
    this.data.studentInfo[this.data.current].isChange = e.detail.isChange
    this.data.studentInfo[this.data.current].pickNum[e.detail.index] = e.detail.value
    this.setData({
      studentInfo: this.data.studentInfo
    })
  },
  // 获取滚动小数点后面的值
  getValuePoint(e) {
    this.data.studentInfo[this.data.current].isChange = e.detail.isChange
    this.data.studentInfo[this.data.current].myPoint = e.detail.value
    this.setData({
      studentInfo: this.data.studentInfo
    })
  },
  // 获取正负关系
  getSign(e) {
    this.data.studentInfo[this.data.current].isChange = e.detail.isChange
    this.data.studentInfo[this.data.current].sign = e.detail.value
    this.setData({
      studentInfo: this.data.studentInfo
    })
  },
  // 提交结果
  pushResult() {
    // 判断修改
    // if (!this.data.studentInfo[this.data.current].isChange){
    //   wx.showToast({
    //     title: "数据未修改",
    //     icon: 'none'
    //   })
    //   return false
    // }
    // 整数
    let integer = this.data.studentInfo[this.data.current].pickNum
    // console.log("整数", integer)
    // 小数
    let decimals = this.data.studentInfo[this.data.current].myPoint ? this.data.studentInfo[this.data.current].myPoint :"0"
    // console.log("小数", decimals)
    // 正负
    let sign = this.data.studentInfo[this.data.current].sign
    // console.log(sign)
    // 结果
    let resultStr = (sign == 0 ? "" : "-") + parseFloat(integer.join("")) + (this.data.isPoint ? "." + decimals : "")
    // console.log(resultStr)
    // if (parseFloat(resultStr) == 0) {
    //   wx.showToast({
    //     title: "请选择结果",
    //     icon: 'none'
    //   })
    //   return false
    // }
    if (parseFloat(resultStr) > this.data.studentInfo[this.data.current].dataEnd || parseFloat(resultStr) < this.data.studentInfo[this.data.current].dataStart) {
      wx.showToast({
        title: "超过成绩录入范围",
        icon: 'none'
      })
      return false
    }
    resultBtn(that, this.data.options, parseFloat(resultStr))

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
    // 改变标题
    wx.setNavigationBarTitle({
      title: options.testName
    })
    this.setData({
    //   resultValue: JSON.parse(options.testValue).valueUnit,
      options: options,
      classId: options.classId,
      classList: options.classList
    })
    // 初始化五个孩子
    getStudentInit(that,JSON.parse(options.testValue))

    // 设置picker的样式
    judge(that, that.data.options.schoolTestId)
  },
  onShow : function(){
    var animation2 = wx.createAnimation({})
    animation2.scale(0.9).step({ duration: 0 })
    this.setData({ scaleDatat: animation2.export() })
  },
  // 改变轮播图
  change(e){
    var animation = wx.createAnimation({})
    animation.scale(1).step({ duration: 100 })
    this.setData({ scaleData: animation.export() })
    var animation2 = wx.createAnimation({})
    animation2.scale(0.9).step({ duration: 100 })
    this.setData({ scaleDatat: animation2.export() })
    if (this.data.rowNumNow < e.detail.current) {
      this.setData({
        current: e.detail.current,
        isAnimation: that.data.studentInfo[e.detail.current + 2] ? false : true
      })
    } else {
      this.setData({
        current: e.detail.current,
        isAnimation: that.data.studentInfo[e.detail.current - 2] || e.detail.current < 1 ? false : true
      })
    }
  },
  nextCurrent(e) {
    if (this.data.rowNumNow < e.detail.current){
      this.setData({
        rowNumNow: e.detail.current
      })
      getAssignStudent(that, JSON.parse(this.data.options.testValue), e.detail.current + 3)
    }else{
      this.setData({
        rowNumNow: e.detail.current 
      })
      getAssignStudent(that, JSON.parse(this.data.options.testValue), e.detail.current - 1)
    }
  },
  
})

// 初始化五个信息
function getStudentInit(that,options){
  that.setData({
    current : options.rowNo - 1,
    rowNumNow: options.rowNo - 1
  })
  getAssignStudent(that, options, options.rowNo)
  getAssignStudent(that, options, options.rowNo + 1)
  getAssignStudent(that, options, options.rowNo + 2)
  if (options.rowNo - 1 > 0){
    getAssignStudent(that, options, options.rowNo - 1)
  }
  if (options.rowNo - 2 > 0) {
    getAssignStudent(that, options, options.rowNo - 2)
  }
}

// 获取指定序列号的信息
function getAssignStudent(that,options ,row,t){
  let stuObj = {
    schoolTestId: that.data.options.schoolTestId,
    schoolId: wx.getStorageSync("userInfo").schoolId,
    classId: that.data.options.classId,
    activityId: that.data.options.activityId,
    gender: that.data.options.gender,
    resultExist: options.resultExist,
    rowNo: row,
  }
  if (that.data.studentInfo[row - 1] || row < 0){
    return false
  }
  http("/v1/activity/student/query", stuObj, "GET", pushStudentCb, that, fildStudentCb)
}
// 获取指定序列号的信息没有数据的回调(失败)
function fildStudentCb(that,res){
  that.setData({
    isAnimation: false,
    isOver : true
  })
  return false;
}
// 获取指定序列号的信息的回调
function pushStudentCb(that, res) {
  let resultValue = res.resultValue ? res.resultValue : "00000.0";
  let pickNum = [];
  let length = that.data.pickNum.length;
  let newValue = "0000" + resultValue.split(".")[0]
  newValue = newValue.substr(newValue.length - length)
  for (let i = 0; i < that.data.pickNum.length;i++){
    pickNum[i] = newValue.split("")[i]
  }
  // 设置整数
  res.pickNum = pickNum;
  // 设置小数
  res.myPoint = resultValue.split(".")[1];
  // 设置正负
  res.sign = resultValue < 0 ? 1 : 0;
  // 给个判断，如果没改变值就不提交
  res.isChange = false;
  that.data.studentInfo[res.rowNo - 1] = res;

  that.setData({
    studentInfo: that.data.studentInfo,
    isAnimation: false
  })
}



// 提交信息
function resultBtn(that, options, value) {
  let result = {
    activityId: options.activityId,
    classId: options.classId,
    resultValue: value,
    schoolId: wx.getStorageSync("userInfo").schoolId,
    schoolTestId: options.schoolTestId,
    studentId: that.data.studentInfo[that.data.current].studentId
  }
  http("/v1/activity/test/save", result, "POST", resultBtncb, that)
}
// 提交信息回调
function resultBtncb(that, res) {
  wx.showToast({
    title: "提交成功",
    icon: 'success'
  })
  // that.setData({
  //   current: that.data.current + 1
  // })
}







// 根据测试id判断单位等的类型
function judge(that, id) {
  switch (id) {
    case "1":
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: true
      })
      break;
    case "10":
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: true
      })
      break;
    case "11":
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: true
      })
      break;
    case "12":
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: true
      })
      break;
    case "7":
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: true
      })
      break;
    case "2":
      resultArray = [0, 0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0, 0],
        isPoint: false
      })
      break;
    case "3":
      resultArray = [0, 0]
      that.setData({
        pickNum: [0, 0],
        isPoint: true
      })
      break;
    case "4":
      resultArray = [0, 0]
      that.setData({
        pickNum: [0, 0],
        isPoint: true,
        isSign: true
      })
      break;
    case "5":
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: false,
        isSign: false
      })
      break;
    case '8':
      resultArray = [0, 0, 0]
      that.setData({
        pickNum: [0, 0, 0],
        isPoint: false,
        isSign: false
      })
      break;
    case "9":
      resultArray = [0, 0]
      that.setData({
        pickNum: [0, 0],
        isPoint: false,
        isSign: false
      })
      break;
    case "6":
      resultArray = [0, 0]
      that.setData({
        pickNum: [0, 0],
        isPoint: false,
        isSign: false
      })
      break;
    default:

  }
}

