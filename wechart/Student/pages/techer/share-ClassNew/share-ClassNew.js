const app = getApp().globalData;
let that;
Page({
  data: {
    classId: 0,
    classSectionId: 0,
    attendDate: "2018-09-20",
    attendId : '8292',
    weekList : ["日","一","二","三","四","五","六"],
    stuList : [],
    sign  : {},
    options: {}, 
    isMock:false,
    isMockInput:false,
    showCode:false,
    thisTime: 60,
    studentName:'',
    userPhoneNo:'',
    code:'',
    isBtn : false,
    curriculumInfo : {
      signUpMember : 0,
      maxMember : 0,
      attendStatus : "06"
    }
  },
  // 报名上课按钮
  bindGetUserInfo(e){
    
    if (this.data.isBtn){
      wx.showToast({
        title: '请不要重复点击',
        icon:"none"
      })
      return false;
    }
    that.setData({
      isBtn : true
    })
    // 如果当前是登录状态直接走报名流程
    if (this.data.isLogin){
      wx.showLoading({
        title: '报名中...',
        mask: true
      })
      getSign(wx.getStorageSync("userInfo").userId)//7判断该用户是否报过名（已报名-->和未报名==>的状态）
    }else{ // 不是登录状态就判断授权
      let userType = wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").userType : '';
      let isOldUser = userType ? userType.substr(1, 1) : "";
      console.log(isOldUser)
      if (isOldUser == '1'){
        wx.showLoading({
          title: '报名中...',
          mask: true
        })
        that.setData({ userId: wx.getStorageSync("userInfo").userId, isLogin: true })
        getStudentBaseInfo(that)//获取StudentBaseInfo并保存不然学员端个人中心会报错
        if (that.data.options.isCoach || wx.getStorageSync("userInfo").userId == that.data.options.cocahId) {
          this.setData({
            isShare: true,
            isLogin :true
          })
        } else {
          this.setData({
            isShare: false,
            isLogin : true
          })
          getSign(wx.getStorageSync("userInfo").userId)//7判断该用户是否报过名（已报名-->和未报名==>的状态）
        }
       return false 
      }
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
            wx.login({
                success: res => {
                  var code = res.code;
                  wx.getUserInfo({
                    success: function (res1) {
                      login(code, '1', that, res1.encryptedData, res1.iv);
                    }
                  })
                }
              })
          } else {
            wx.showModal({
              title: '提示',
              content: '小程序需要你的授权才能使用',
              success: function (res) {
                
                wx.hideLoading()
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({});
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  that.setData({
                    isLogin : false,
                    isBtn : false
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    that = this;
    //判断本地是否有数据
    let userType = wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").userType : '';
    let isOldUser = userType ? userType.substr(1, 1) : "";
    console.log("options:",options)
    if (isOldUser == '1') {//这是登录过的用户
      that.setData({ options: options,userId: wx.getStorageSync("userInfo").userId,isLogin : true})
      getStudentBaseInfo(that)//获取StudentBaseInfo并保存不然学员端个人中心会报错
      if (options.isCoach || wx.getStorageSync("userInfo").userId == options.cocahId) {
        this.setData({
          isShare: true
        })
      } else {
        this.setData({
          isShare: false
        })
        getSignTwo(wx.getStorageSync("userInfo").userId)//7判断该用户是否报过名（已报名-->和未报名==>的状态）
      }
    } else {//这是没有登录
      that.setData({ options: options, isLogin: false })
    }
  },
  studentName(e){
    this.setData({ studentName:e.detail.value})
  },
  userPhone(e) {
    this.setData({ userPhoneNo: e.detail.value })
  },
  inputCode(e) {
    this.setData({ code: e.detail.value })
  },
  subMit(e){
    if (!that.data.code){
      wx.showToast({
        title: '请填写正确的验证码',
        icon:'none'
      })
      return
    }
    if (!that.data.studentName) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      })
      return
    }
    var reg = /^[1][0-9]{10}$/;
    if (!reg.test(that.data.userPhoneNo)) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none'
      })
      return false;
    }
    // if (!that.data.userPhoneNo) {
    //   wx.showToast({
    //     title: '请填写正确的手机号',
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.request({
      url: `${app.url}/v1/student/add/studentregioninfo`,
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'POST',
      data: {
        "avatarUrl": "",
        "code": that.data.code,
        "invitationUserId": "",
        "itemId": "",
        "studentSchoolId": "",
        "userId": wx.getStorageSync('userInfo').userId,
        "userName": that.data.studentName,
        "userPhoneNo": that.data.userPhoneNo,
        "userType": "1"
      },
      success: (res) => {
        if (res.data.code == 10000) {
          let result = res.data
          wx.setStorageSync('userInfo', result.response.wechartInitResponse);
          wx.setStorageSync('studentBaseInfo', result.response.studentVO);
          getApplyInfo()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: (info) => {
        wx.showToast({
          title: '提交失败，请刷新重试',
          icon: 'none'
        })
      }
    })
  },
  cancelInput(){
    that.setData({
      isMockInput: false
    })
  },
  addStu(){
    wx.switchTab({
      url: '/pages/keChen/keChen-index/keChen-index',
    })
  },
  //取消报名按钮
  cancelApply(e){
    wx.showLoading({
      title: '取消报名中...',
      mask: true
    })
    if (this.data.isBtn){
      return false;
    }
    this.setData({
      isBtn : true
    })
    wx.request({
      url: `${app.url}/v1/schedule/deleteStuSchedule`,
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        scheduleId: this.data.sign.scheduleId,
      },
      success: (res) => {
        if (res.data.code == 10000) {
          that.data.sign.signStatus = 0
          that.data.curriculumInfo.signUpMember = that.data.curriculumInfo.signUpMember - 1
          that.setData({
            sign: that.data.sign,
            isBtn : false,
            curriculumInfo: that.data.curriculumInfo
          })
          getCocahInfo()
          getStudentList()
        }else{
          wx.hideLoading()
          that.setData({
            isBtn: false,
            isMock: true,
            mockInfo: "报名结束后无法取消报名，请联系教练",
            isRoute: false,
            isCancel: false,
            isSure: false
          })
        }
      },
      fail: (info) => {
        wx.hideLoading()
        that.setData({
          isBtn : false
        })
        wx.showToast({
          title: '获取您信息的失败，请刷新重试',
          icon: 'none'
        })
      }
    })
  },
  //跳转到我的上课记录
  myHistory(e){
    wx.navigateTo({
      url: `../../../pages/Timetable/Course-record/Course-record?orderCode=${this.data.sign.orderCode }`,
    })
  },
  // 发送验证码
  getCode(){
    var that = this;
    var phoneNum = that.data.userPhoneNo;
    var reg = /^[1][0-9]{10}$/;
    if (reg.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
    // sendCoded(that, this.data.userPhoneNo)
  },

  // 弹窗取消
  cancel(){
    this.setData({
      isMock : false,
      isBtn: false
    })
  },
  // 弹窗确定
  sure(){
    that.setData({
      isBtn: false,
      isMock: false
    })
    if (this.data.isRoute){
      wx.navigateTo({
        url: this.data.isRoute
      })
    }
    if (this.data.isSure == 1){
      saveStuSchedule()
    }
  },
  onReady() {},
  onShow() {
    that.setData({
      isBtn: false
    })
    if (!this.data.options.attendId || this.data.options.attendId == "undefined" || this.data.options.attendId == "null"){
      console.log("进入保存")
      saveAttend()
      return false;
    }
    getCocahInfo()//5课程详情
    getStudentList()//6学员列表
    
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage(res) {
    let shareObj = {
      　title: "我发布了一堂课，快来报名吧",
        path: 'pages/techer/share-ClassNew/share-ClassNew?attendId=' + this.data.options.attendId + "&cocahId=" + this.data.options.cocahId,
　　　　imgUrl: '',  
　　　　success: function (res) {
        // console.log(this.data.attendId);
// 　　　　　　if (res.errMsg == 'shareAppMessage:ok') {
// 　　　　　　}
　　　　}
    }
    return shareObj
  },
  back() {
    wx.navigateBackMiniProgram({
      success(res) {
        // 返回成功
      }
    })
  },
})
//发送验证码
function sendCoded(that, phone) {
  wx.request({
    url: app.url + '/v1/common/sendSMS',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'type': '1',
      'userId': wx.getStorageSync('userInfo').userId,
      'userPhoneNo': phone
    },
    success: function (res) {
      var result = res.data;
      if (result.code == 10000) {
        that.setData({ showCode: true });
        changeThisTime(that)

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }

    },
    fail: function (info) {
      console.log("发送失败")
    }
  })
}
function changeThisTime(that) {
  var time = that.data.thisTime;
  time--;
  if (time >= 0) {
    that.setData({
      thisTime: time,
    });
    setTimeout(() => {
      changeThisTime(that)
    }, 1000)
  } else {
    that.setData({
      showCode: false,
      thisTime: 60
    });
  }

}

// 保存虚拟开课
function saveAttend(){
  console.log("保存虚拟开课：", that.data.options)
  wx.request({
    url: app.url + '/v1/attend/saveAttendForSys',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      classId: that.data.options.classId,
      classSectionId: that.data.options.classSectionId,
      attendDate: that.data.options.attendDate
    },
    success: function (res) {
      if(res.data.code == 10000){
        that.data.options.attendId = res.data.msg
        that.setData({
          options: that.data.options
        })
        getCocahInfo()
        getStudentList()
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
    },fail(info){
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon:'none'
      })
    }
  })
}


// 获取课程信息
function getCocahInfo(){
  console.log("获取课程信息", that.data.options)
  wx.request({
    url: app.url + '/v1/class/getShareAttendInfoByAttendId',
    // header: { 'token': wx.getStorageSync('userInfo').token || "ieooeueoi" },
    method: 'GET',
    data: {
      attendId: that.data.options.attendId
    },
    success: function (res) {
      console.log("获取课程信息i",res)
      if(res.data.code == 10000){
        that.setData({
          curriculumInfo: res.data.response,
          month: res.data.response.attendDate.split(" ")[0].split("-")[1],
          day: res.data.response.attendDate.split(" ")[0].split("-")[2]
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail:function(info){
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon:'none'
      })
    }
  })
}

// 获取学员列表
function getStudentList(){
  wx.request({
    url: app.url + '/v1/class/getSignupMemberInfoByAttendId',
    // header: { 'token': wx.getStorageSync('userInfo').token || "ieooeueoi"  },
    method: 'GET',
    data: {
      attendId: that.data.options.attendId
    },
    success: function (res) {
      if (res.data.code == 10000){
        that.setData({
          stuList : res.data.response
        })
      }
      wx.hideLoading()
    }
    
  })
}

// 验证是否报名
function getSign(userId){
  wx.request({
    url: app.url + '/v1/class/getSignStatus',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      attendId: that.data.options.attendId,
      userId : userId
    },
    success: function (res) {
      if (res.data.code == 10000){
        that.setData({
          sign  : res.data.response
        })
        if (res.data.response.signStatus == 0 ){
            getApplyInfo()
        }else{
          wx.hideLoading()
          that.setData({
            isBtn : false
          })
        }

      }else{
        wx.hideLoading()
      }
    }
  })
}
// 验证是否报名刷新用
function getSignTwo(userId) {
  wx.request({
    url: app.url + '/v1/class/getSignStatus',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      attendId: that.data.options.attendId,
      userId: userId
    },
    success: function (res) {
      if (res.data.code == 10000) {
        that.setData({
          sign: res.data.response
        })
        if (res.data.response.signStatus == 0) {
          // getApplyInfo()
        } else {
          wx.hideLoading()
          that.setData({
            isBtn: false
          })
        }

      } else {
        wx.hideLoading()
      }
    }
  })
}
// 报名上课（判断是否重复）
function getApplyInfo(){
  wx.request({
    url: app.url + '/v1/class/checkIsCanCreateOrderByStudentUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      attendId: that.data.options.attendId,
      userId: wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == 10000){
        if (res.data.response.checkStatus ==1){
          that.setData({
            orderCode: res.data.response.orderCode,
            isBtn : false
          })
          timeOut()
        }else{
          if (res.data.response.checkStatus == 2){
            wx.hideLoading()
            that.setData({
              isMock : true,
              mockInfo: "您的课时已用完，请与教练联系",
              isRoute : false,
              isCancel: false,
              isSure: false
            })
          } else if (res.data.response.checkStatus == 3){
            wx.hideLoading()
            that.setData({
              isMock: true,
              mockInfo: "您还未购买该课程，请先购买课程再报名",
              isRoute: '../../../pages/keChen/coursedetails/coursedetails?classId=' + that.data.curriculumInfo.classId + '&memberState=' + 0,
              isCancel: false,
              isSure: false
            })
          }
        }
      }else{
        wx.hideLoading()
      }
    }
  })
}

// 判断时间是否冲突
function timeOut(){
  console.log("判断时间是否冲突", that.data.options)
  wx.request({
    url: app.url + '/v1/schedule/checkScheduleByDate',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      attendDate: that.data.curriculumInfo.attendDate.split(" ")[0],
      dayTimeStart: that.data.curriculumInfo.startTime,
      dayTimeEnd: that.data.curriculumInfo.endTime,
      scheduleId:""
    },
    success: function (res) {
      if (res.data.code == 10000) {
        if (res.data.response == 0){
          saveStuSchedule()
        }else{
          wx.hideLoading()
          that.setData({
            isMock: true,
            mockInfo: "该时段已安排课程，是否挤掉该课程",
            isRoute: false,
            isCancel: true,
            isSure: 1
          })
        }
      }
    }
  })
}

//登录
function login(code, appType, vm, encryptedData, iv) {
  wx.request({
    url: app.url + '/v1/login/wechart/init',
    data: {
      encryptedData: encryptedData,
      iv: iv,
      appType: appType,
      code: code
    },
    method: 'GET',
    ContentType: 'application/json;charset=UTF-8',
    success: (res) => {
      if (res.data.code == '10000') {
        var result = res.data.response;
        wx.setStorageSync('userInfo', result);
        // 新人注册弹窗
        if (result.userType.substr(1, 1) != 1){
          that.setData({
            isMockInput: true,
            isBtn: false
          })
          return false
        }
        // 不是新人就判断是不是教练
        wx.showLoading({
          title: '报名中...',
          mask: true
        })
        if (wx.getStorageSync("userInfo").userId == vm.data.options.cocahId) {
          that.setData({
            isShare: true,
            isBtn : false
          })
        } else {
          that.setData({
            isShare: false
          })
          getSign(wx.getStorageSync("userInfo").userId)//7判断该用户是否报过名（已报名-->和未报名==>的状态）
        }
      }else{
        wx.hideLoading()
        vm.setData({
          isBtn : false
        })
      }
    },
    fail: (info) => {
      wx.hideLoading()
      wx.showToast({
        title: '登录失败，请刷新重试',
        icon: 'none'
      })
    }
  })
};
//学员用户 获取学员信息
function getStudentBaseInfo(vm) {
  wx.request({
    url: app.url + '/v1/student/getStudentStorageInfoByUserId',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        let data = res.data.response;
        wx.setStorageSync('studentBaseInfo', data);
      }
    },
    fail: (info) => {
      wx.hideLoading()
      wx.showToast({
        title: '获取您的信息失败，请刷新重试',
        icon: 'none'
      })
    }
  })
};
//报名课程
function saveStuSchedule() {
  
  console.log("报名", that.data.curriculumInfo.attendId)
  wx.request({
    url: app.url + '/v1/schedule/saveStuSchedule',
    method: "POST",
    header: { "token": wx.getStorageSync("userInfo").token },
    data: {
      attendDate: that.data.curriculumInfo.attendDate,
      attendId: that.data.curriculumInfo.attendId,
      classId: that.data.curriculumInfo.classId,
      classSectionId: that.data.options.classSectionId || "",
      orderCode: that.data.orderCode
    },
    success: function (res) {
      if (res.data.code == 10000) {
        wx.hideLoading()
        that.data.sign.signStatus = 1
        that.data.sign.scheduleId = res.data.msg
        that.data.sign.orderCode = that.data.orderCode
        that.setData({
          sign: that.data.sign,
          isMockInput: false,
          isBtn:false
        })
        getCocahInfo()
        getStudentList()

      } else {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    }
  })
}