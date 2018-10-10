// pages/index/redact/redact.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    pageTitle: "修改课堂信息",
    userId: wx.getStorageSync('userInfo').userId,
    //userId:1,
    array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'],
    maxMember: 0,
    attendId: "",
    classList: [],
    objectClassList: [],
    classIndex: "0",
    classInfo: {},
    itemId: "",
    homeList: [],
    objectHomeList: [],
    homeIndex: "0",
    classSectionList: [],
    objectClassSectionList: [],
    classSectionIndex: "0",
    classId: "",
    homeId: "",
    homeName: "",
    classSectionId: "",
    attendDate: "",
    dayTimeStart: "",
    dayTimeEnd: "",
    minTime: "",
    attendClassFlag: false,
    showAttendPeriod: false,
    attendPeriod: "",
    attendStatus: "",
    chooseCoach: false,
    optionType: "0", //0新增，1系统修改，2，正常修改
    sysClassId: "",
    sysClassSectionId: "",
    sysAttendDate: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //options.attendId ="68";
    
    if (options.attendId == undefined || options.attendId == "") {
      //新增
      this.setData({
        attendDate: getTodayDate(),
        dayTimeStart: setTimeStart(),
        minTime: setTimeStart(),
        dayTimeEnd: setTimeEnd(),
        optionType: "0",
        pageTitle: "新增开课",
      });
    } else if (options.attendId == "null") { //系统修改
      this.setData({
        sysClassId: options.classId,
        sysClassSectionId: options.classSectionId,
        sysAttendDate: options.attendDate,
        pageTitle: "修改课堂信息",
        optionType: "1"
      });
    } else {
      //修改
      this.setData({
        attendId: options.attendId,
        pageTitle: "修改课堂信息",
        optionType: "2"
      });
    }
    wx.setNavigationBarTitle({
      title: this.data.pageTitle
    });

  },
  modalcnt: function() {
    wx.showModal({
      title: '提示',
      content: '选择本次通知到本课程对应时段的学生（如：如果您的课程在周六下午和周日下午两个时段都有课，选择周六下午这个时段，则本次通知会通知到这个时段所有上课的学生）。',
      showCancel: false,
      confirmText: '我知道了',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  modalcnte: function() {
    wx.showModal({
      title: '提示',
      content: '开课课程：选择需要新增日程的课程，可在您已发布的课程当中选择。',
      showCancel: false,
      confirmText: '我知道了',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
    var vm = this;
    app.noType();
    vm.setData({
      userId: wx.getStorageSync('userInfo').userId,
    });
    // console.log(vm.data.chooseCoach)
    if (!vm.data.chooseCoach) {
      if (this.data.optionType == "0") {
        getCoachClassList(this); //新增
      } else if (this.data.optionType == "1") { //系统修改
        getAttendInfoForSys(this);
      } else {
        getAttendInfo(this); //修改
      }

    }
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

  },
  //课程改变
  classBindChange: function(e) {
    var value = e.detail.value;
    this.setData({
      classIndex: value,
      classId: this.data.objectClassList[value].classId,
      itemId: this.data.objectClassList[value].itemId,
      homeId: this.data.objectClassList[value].homeId,
      homeIndex: "0",
      classSectionIndex: "0",
    });

    //查询课程信息
    getClassInfo(this);
    //查询适合的场馆
    getHomeList(this);
    //查询时间段
    getClassSectionList(this);

  },
  //培训场馆改变
  homeBindChange: function(e) {
    var value = e.detail.value;
    this.setData({
      homeIndex: value,
      homeId: this.data.objectHomeList[value].homeId,
    });
  },
  //归属时段改变
  classSectionBindChange: function(e) {
    var value = e.detail.value;
    this.setData({
      classSectionIndex: value,
      classSectionId: this.data.objectClassSectionList[value].sectionId,
      dayTimeStart: this.data.objectClassSectionList[value].dayTimeStart,
      minTime: this.data.objectClassSectionList[value].dayTimeStart
    });
  },
  // 学生人数上限
  bindPickerChange: function(e) {
    this.setData({
      maxMember: e.detail.value
    })
  },
  //自定义日期
  bindDateChange: function(e) {
    this.setData({
      attendDate: e.detail.value
    })
  },
  //自定义时间
  bindTimeChange: function(e) {
    this.setData({
      dayTimeStart: e.detail.value,
      minTime: e.detail.value
    })
  },
  // 自定义结束时间
  bindTimeChangeEnd: function(e) {
    let vm = this;
    this.setData({
      dayTimeEnd: e.detail.value
    })
    // checkTime(vm)
  },
  //开课课程点击
  classClick: function(e) {
    if (this.data.attendClassFlag) {
      wx.showToast({
        title: "该开课已经处于报名中,不能修改开课课程！",
        icon: 'none'
      });
    }
  },
  //归属时段点击
  classSectionClick: function(e) {
    if (this.data.attendClassFlag) {
      wx.showToast({
        title: "该开课已经处于报名中,不能修改归属时段！",
        icon: 'none'
      });
    }
  },
  //保存
  submitAttend: function(e) {
    var today = getTodayDate();
    var time = getTodayTime();
    if (this.data.attendDate < today) {
      wx.showToast({
        title: "自定义日期不能小于当前日期",
        icon: 'none'
      });
      return false;

    } else if (this.data.attendDate == today) {
      if (Number(this.data.dayTimeStart.replace(':', '')) - Number(time.replace(':', '')) < 5) {
        wx.showToast({
          title: "自定义开始时间应大于当前时间，且时间间隔应大于5分钟！",
          icon: 'none'
        });
        return false;
      }
    }
    if (Number(this.data.dayTimeEnd.replace(':', '')) <= Number(this.data.dayTimeStart.replace(':', ''))) {
      wx.showToast({
        title: "自定义结束时间应大于开始时间！",
        icon: 'none'
      });
      return false;
    }
    if (this.data.classId == "") {
      wx.showToast({
        title: "请选择开课课程！",
        icon: 'none'
      });
      return false;
    }
    if (this.data.homeId == "") {
      wx.showToast({
        title: "请选择开课培训场馆！",
        icon: 'none'
      });
      return false;
    }
    // if (this.data.maxMember == "") {
    //   wx.showToast({
    //     title: "请选择学生人数上限!",
    //     icon: 'none'
    //   });
    //   return false;
    // }
    if (this.data.classSectionId == "") {
      wx.showToast({
        title: "请选择开课归属时段！",
        icon: 'none'
      });
      return false;
    }
    if (!this.data.classCoach.userId) {
      wx.showToast({
        title: "请选择授课教练！",
        icon: 'none'
      });
      return false;
    }
    //提交提示
    var thisvm = this;
    var content = '系统将根据您设置的开课时间在开课前发送开课通知,确认提交？';
    var checkData = {
      userId: thisvm.data.userId,
      attendDate: thisvm.data.attendDate,
      attendDateStart: thisvm.data.dayTimeStart,
      courseTime: thisvm.data.classInfo.courseTime
    }
    if (thisvm.data.btning){
      return false
    }
    saveAttend(thisvm); //保存



  },
  toChooseCoach: function() {
    var vm = this;
    let attendClassFlag = vm.data.attendClassFlag;
    console.log(attendClassFlag)
    if (!attendClassFlag) {
      wx.navigateTo({
        url: '../../curriculum/Addition-coach1/Addition-coach',
      })
    } else {
      wx.showToast({
        title: "该开课已处于报名中，无法修改授课教练",
        icon: 'none'
      });
    }
  }



})

//保存开课方法
function saveAttend(vm) {
  wx.showLoading({
    title: '',
    mask:true
  })
  vm.setData({
    btning: true
  })
  var data = {
    "attendDate": vm.data.attendDate,
    "attendId": vm.data.attendId,
    "classId": vm.data.classId,
    "classSectionId": vm.data.classSectionId,
    "dayTimeStart": vm.data.dayTimeStart,
    "dayTimeEnd": vm.data.dayTimeEnd,
    "homeId": vm.data.homeId,
    "maxMember": vm.data.array[vm.data.maxMember],
    "homeName": vm.data.homeName,
    "weekDay": getweekByDateString(vm.data.attendDate),
    "classCoachUserId": vm.data.classCoach.userId,
    "sysClassId": vm.data.sysClassId,
    "sysClassSectionId": vm.data.sysClassSectionId,
    "sysAttendDate": vm.data.sysAttendDate,
    "optionType": vm.data.optionType
  }
  console.log(data);
  wx.request({
    url: app.url + '/v1/attend/saveAttend',
    method: 'POST',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data: data,
    success: function(res) {
      wx.hideLoading()
      var result = res.data
      vm.setData({
        btning: false
      })
      if (result.code == 10000) { //成功
        console.log(result.msg);
        vm.setData({
          attendId: result.msg,
          pageTitle: "编辑开课"
        });
        wx.showModal({
          title: '提示',
          content: "提交成功！",
          showCancel: false,
          success: function() {
            //跳转到开课详情页面
            // wx.redirectTo({
            //   url: '../../../pages/index/particulars/particulars?attendId=' + vm.data.attendId + '&classId=' + vm.data.classId + '&classSectionId=' + vm.data.classSectionId + '&attendDate=' + vm.data.attendDate
            // })
            wx.navigateBack({
              delta:1
            })
          }
        });
      } else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      } else { //其他
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }

    },
    fail: function(info) {
      vm.setData({
        btning: false
      })
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}


//获取教练课程列表
function getCoachClassList(vm) {
  wx.request({
    url: app.url + '/v1/class/getCoachClassListForAttend',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'userId': vm.data.userId,
    },
    success: function(res) {
      var result = res.data
      if (result.code == 10000) {
        var data = result.response;
        if (data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '你还没有可以开课的课程，不能开课！',
          })
          return false;
        }
        var arr = [];
        var classIndex = vm.data.classIndex;
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].className);
          if (vm.data.classId == data[i].classId) {
            classIndex = i;
          }
        }
        vm.setData({
          classList: arr,
          objectClassList: data,
          classId: data[classIndex].classId,
          itemId: data[classIndex].itemId,
          classIndex: classIndex
        });
        //初期获取课程，场馆，时间段信息 
        getClassInfo(vm);
        getHomeList(vm);
        getClassSectionList(vm);
      } else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function(info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}

//获取适合课程的场馆列表
function getHomeList(vm) {
  var cityName = wx.getStorageSync('location').result.ad_info.city;
  wx.request({
    url: app.url + '/v1/home/getHomeSingleInfoList',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'itemId': vm.data.itemId,
      'cityName': cityName
    },
    success: function(res) {
      var result = res.data
      if (result.code == 10000) {
        var data = result.response;
        if (data.length == 0) {
          vm.setData({
            homeList: [],
            objectHomeList: [],
            homeId: "",
            homeName: ""
          });
          wx.showToast({
            title: "你所在的城市没有适合该课程的培训场馆!",
            icon: 'none'
          });
          return false;
        }
        var arr = [];
        var homeIndex = vm.data.homeIndex;
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].homeName);
          if (vm.data.homeId == data[i].homeId) {
            homeIndex = i;
          }
        }

        vm.setData({
          homeList: arr,
          objectHomeList: data,
          homeId: data[homeIndex].homeId,
          homeName: data[homeIndex].homeName,
          homeIndex: homeIndex
        });

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function(info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}
//获取根据选择的课程获取课程简要信息
function getClassInfo(vm) {
  wx.request({
    url: app.url + '/v1/class/getAttendClassInfo',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'classId': vm.data.classId
    },
    success: function(res) {
      var result = res.data
      if (result.code == 10000) {
        var data = result.response;

        data.itemStudentGrade = "L" + data.itemStudentGrade.replace(/,/g, " L");

        vm.setData({
          classInfo: data,
          classCoach: data.coachSingleInfoVO,
          // maxMember: data.maxMember-1
        });

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function(info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}
//获取课程时段信息列表
function getClassSectionList(vm) {

  wx.request({
    url: app.url + '/v1/class/getClassEditSectionList',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'classId': vm.data.classId,
    },
    success: function(res) {
      var result = res.data
      if (result.code == 10000) {
        var data = result.response;
        if (data.length == 0) {
          return false;
        }
        var arr = [];
        var classSectionIndex = vm.data.classSectionIndex;
        for (let i = 0; i < data.length; i++) {
          arr.push(getWeekName(data[i].weekDay) + " " + data[i].dayTimeStart + "-" + data[i].dayTimeEnd);
          if (vm.data.classSectionId == data[i].sectionId) {
            classSectionIndex = i;
          }
        }
        vm.setData({
          classSectionList: arr,
          objectClassSectionList: data,
          classSectionId: data[classSectionIndex].sectionId,
          classSectionIndex: classSectionIndex
        });

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function(info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}


//获取开课信息
function getAttendInfo(vm) {
  wx.request({
    url: app.url + '/v1/attend/getAttendDetail',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'attendId': vm.data.attendId
    },
    success: function(res) {
      var result = res.data
      if (result.code == 10000) {
        var data = result.response;
        console.log(data.dayTimeStart)
        vm.setData({
          classId: data.classId,
          homeId: data.homeId,
          maxMember: data.maxMember-1,
          classSectionId: data.classSectionId,
          attendDate: data.attendDate,
          dayTimeStart: data.dayTimeStart,
          minTime: data.dayTimeStart,
          dayTimeEnd: data.dayTimeEnd,
          showAttendPeriod: data.attendStatus == '02' ? true : false,
          attendClassFlag: data.attendStatus == '02' ? true : false,
          attendPeriod: data.attendPeriod,
          attendStatus: data.attendStatus,
          classCoach: data.coachSingleInfoVO
        });
        //获取教练课程列表
        getCoachClassList(vm);
        if (vm.data.attendStatus == '02') {
          wx.showModal({
            title: '提示',
            content: '该开课已处于开课报名中,请您谨慎修改！',
            showCancel: false,
          });
        }

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function(info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}

//获取系统开课信息
function getAttendInfoForSys(vm) {
  wx.request({
    url: app.url + '/v1/attend/getAttendDetailForSys?classId=' + vm.data.sysClassId + '&classSectionId=' + vm.data.sysClassSectionId + '&attendDate=' + vm.data.sysAttendDate,
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'attendId': vm.data.attendId
    },
    success: function(res) {
      var result = res.data
      if (result.code == 10000) {
        var data = result.response;
        vm.setData({
          classId: data.classId,
          homeId: data.homeId,
          maxMember:data.maxMember,
          classSectionId: data.classSectionId,
          attendDate: data.attendDate,
          dayTimeStart: data.dayTimeStart,
          minTime: data.dayTimeStart,
          dayTimeEnd: data.dayTimeEnd,
          showAttendPeriod: data.attendStatus == '02' ? true : false,
          attendClassFlag: data.attendStatus == '02' ? true : false,
          attendPeriod: data.attendPeriod,
          attendStatus: data.attendStatus,
          classCoach: data.coachSingleInfoVO
        });
        //获取教练课程列表
        getCoachClassList(vm);
        if (vm.data.attendStatus == '02') {
          wx.showModal({
            title: '提示',
            content: '该开课已处于开课报名中,请您谨慎修改！',
            showCancel: false,
          });
        }

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function(info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}



//星期转化
function getWeekName(index) {
  var weeks = ["周一", "周二", "周三", "周四", "周五", "周六", "周天"];
  return weeks[index - 1];
}
//获取当前日期
function getTodayDate() {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//获取当前时间
function getTodayTime() {
  var myDate = new Date();
  return formatNumber(myDate.getHours()) + ":" + formatNumber(myDate.getMinutes())
}
// 设置默认的自定义开始时间
function setTimeStart() {
  var myDate = new Date();
  var _time = myDate.getTime() + 1000 * 60 * 10
  var time = new Date(_time)
  var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var mm = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return h + ":" + mm
}
// 设置默认的自定义结束时间
function setTimeEnd() {
  var myDate = new Date();
  var _time = myDate.getTime() + 1000 * 60 * 40
  var time = new Date(_time)
  var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var mm = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return h + ":" + mm
}

function getweekByDateString(date) {
  var weekInt = [7, 1, 2, 3, 4, 5, 6];
  var datef = date.split("-");
  var myDate = new Date(datef[0], datef[1] - 1, datef[2], 0, 0, 0);
  return weekInt[myDate.getDay()];
}