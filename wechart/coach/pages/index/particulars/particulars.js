
var util = require('../../../utils/util.js');
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl, 
    show: 1,
    showScroll: 0,
    showHeader: 1,
    height: 760,
    showchang: 0,
    modal: '',
    keChenInfo:'',
    latitude: '',
    longitude: '',
    address: '',
    items: [],
    info: '',
    scrollTop: 0,
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'course-head-ad',
    coursepersonbnotice: '',
    attendId:'',
    classId:'',
    nowDate:'',
    classInfo:'',
    studentList:[],
    coachUserType:"",
    coachUserId:"",
    allStudent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    let attendId = options.attendId;
    let classId = options.classId;
    console.log(options)
    vm.setData({
      attendId: attendId,
      classId: classId,
      classSectionId: options.classSectionId,
      attendDate: options.attendDate,
      nowDate: util.formatTime(new Date()),
      coachUserType: wx.getStorageSync('coachBaseInfo').userType,
      coachUserId: wx.getStorageSync('coachBaseInfo').userId
    })
  },

  kecheng: function (e) {
    var val = e.currentTarget.dataset.val;
    console.log(val)
    var that = this;
    if (val == 1) {
      console.log(111)
      that.setData({
        coursepersona: 'course-head-ad',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 2) {
      console.log(222)
      that.setData({
        coursepersona: '',
        coursepersonbnotice: 'course-head-ad',
        trainingcourse: true,
        noticecoursetab: false,
      })
    }
  },

  scroll: function (e) {
    var that = this;
    if (e.currentTarget.offsetTop > 5) {
      that.setData({
        show: 0,
        showScroll: 1,
        showHeader: 0,
        height: 940
      })
    }
  },
  scrolltoupper: function (e) {
    var that = this;
    that.setData({
      show: 1,
      showScroll: 0,
      showHeader: 1,
      height: 760
    })
  },
  //回到顶部
  toTop: function (e) {
    var that = this;
    that.setData({
      scrollTop: that.scrollTop / 0
    })
  },
  bust: function (e) {
    let _this = this;
    _this.setData({
      showchang: 1,
      show: 0,
      showScroll: 1,
      showHeader: 0,
      modal: 'modal'
    })
  },
  hideModal: function (e) {
    let _this = this;
    _this.setData({
      showchang: 0,
      show: 1,
      showScroll: 0,
      showHeader: 1,
      modal: ''
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
    var that = this;
    app.noType();
    if (that.data.attendId != "null" && that.data.attendId != "") {
      getAttendDetail(that, that.data.attendId);
    }else{
      getAttendDetailForSys(that);
    }
    getClassInfo(that, that.data.classId);
    
    if (that.data.attendId != "null" && that.data.attendId != ""){
      getSignUpStudents(that, that.data.attendId)
    }else{
      that.setData({
        allStudent: '暂无学员'
      })
    }
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        reverseLocation(that, latitude, longitude)
      }
    })
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

  },

  qiandao:function(e){  
    var vm=this;
    if (vm.data.attendDetail.settlementStatus == '1'){
      wx.showToast({
        icon: 'none',
        title: '操作失败,开课已结算！',
      });
      return;
    }
    let scheduleId = e.currentTarget.dataset.scheduleid;
    let signstatus = e.currentTarget.dataset.signstatus;
    updateSignStatus(vm, scheduleId, signstatus);
  },
  toPay:function(e){
    var vm=this;
    let attendId = vm.data.attendId;
    getIsCanPayHomeFee(vm.data.attendDetail.homeId, attendId, vm.data.attendDetail.dayTimeStart);
    
  },
  cancelAttend:function(e){
    var vm = this;
    let attendId = vm.data.attendId;
    wx.showModal({
      title: '提示',
      content: '确定要取消该课程吗？',
      success: function (sm) {
        if (sm.confirm) {
          cancelAttend(vm, attendId);// 用户点击了确定 可以调用删除方法了
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  deleteAttend:function(e){
    var vm = this;
    let attendId = vm.data.attendId;
    wx.showModal({
      title: '提示',
      content: '确定要删除该课程吗？',
      success: function (sm) {
        if (sm.confirm) {                  
          // 用户点击了确定 可以调用删除方法了
          if (vm.data.attendId != "null" && vm.data.attendId != "") {
            deleteAttend(vm, attendId);
          } else {
            updateAttendForSys(vm);//删除系统虚拟开课即新增开课且状态为删除
          }

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  editeAttend:function(e){
    var vm = this;
    let attendId = vm.data.attendId;
    let classId = vm.data.classId; 
    let classSectionId = vm.data.classSectionId; 
    let attendDate = vm.data.attendDate;
    wx.redirectTo({
      url: '../redact/redact?attendId=' + attendId + '&classId=' + classId + '&classSectionId=' + classSectionId + '&attendDate=' + attendDate,
    })
  }



})
function reverseLocation(that, lat, lon) {
  // 调用接口
  var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
  var qqmapsdk;
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
    key: 'BX6BZ-ZDEWF-EQVJ3-JPL6W-BPU6Q-4PFHB'
  });
  qqmapsdk.reverseGeocoder({

    location: {
      latitude: lat,
      longitude: lon
    },
    success: function (res) {
      // console.log(res);
      that.setData({
        address: res.result.address
      })
    },
    fail: function (res) {
      console.log(res);
    },
    template: function () {
      console.log(111)
      console.log(that.data.latitude);
    }
  });
};
//请求项目列表
function getItemList(that) {
  wx.request({
    url: app.url + '/v1/item/getItemList',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {},
    success: function (res) {
      console.log("请求成功,下面是返回参数")
      console.log(res.data.code)
      if (res.data.code == '10000') {
        that.setData({
          items: res.data.response
        })
        wx.setStorageSync('classList', res.data.response)
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
};

function getAttendDetail(vm,attendId){
  wx.request({
    url: app.url + '/v1/attend/getAttendDetail?attendId=' + attendId ,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        vm.setData({
          attendDetail: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function getAttendDetailForSys(vm) {
  wx.request({
    url: app.url + '/v1/attend/getAttendDetailForSys?classId=' + vm.data.classId + '&classSectionId=' + vm.data.classSectionId + '&attendDate=' + vm.data.attendDate,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        vm.setData({
          attendDetail: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};

function getClassInfo(vm,classId) {
  wx.request({
    url: app.url + '/v1/class/getAttendClassInfo?classId=' + classId,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        data.itemStudentGrade = util.stringPrefixSet(data.itemStudentGrade, 'L');
        vm.setData({
          classInfo: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function getSignUpStudents(vm, attendId){
  wx.request({
    url: app.url + '/v1/attend/getAttendDetailSignUpInfoNew?attendId=' + attendId,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        if(data){
          for(var i=0;i<data.length;i++){
            data[i].createTime = data[i].createTime.substr(0,16)
          }
        }
        if(data.length==0){
          vm.setData({
            allStudent:'暂无学员'
          })
        }else{
          vm.setData({
            allStudent: '已显示全部'
          })
        } 
        vm.setData({
          studentList: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function updateSignStatus(vm, scheduleId, signStatus) {
  
  wx.request({
    url: app.url + '/v1/attend/updateAttendSignStatusNew?scheduleId=' + scheduleId + '&signStatus=' + signStatus,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        let studentList = vm.data.studentList;
        for (var i = 0; i < studentList.length; i++) {
          if (scheduleId == studentList[i].scheduleId) {
            studentList[i].signStatus = signStatus;
            break;
          }
        }
          wx.showToast({
            icon: 'none',
            title: '操作成功!',
          });
        vm.setData({
          studentList: studentList
        })  
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        });
      }

      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function cancelAttend(vm,attendId){
  wx.request({
    url: app.url + '/v1/attend/cancelAttend?cancelType=0&attendId=' + attendId,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        var attendDetail=vm.data.attendDetail;
        attendDetail.attendStatus = '05'
        //let student=vm.data.student;
        //student.signStatus=1
        vm.setData({
          attendDetail: attendDetail,
         // student: student
        })  
        console.log(attendDetail)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '后台开小差了',
        icon: 'none'
      })
    }
  })
};
function deleteAttend(vm, attendId){
  wx.request({
    url: app.url + '/v1/attend/deleteAttend?attendId=' + attendId,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        wx.navigateBack({ changed: true });//返回上一页  
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function updateAttendForSys(vm) {
  wx.request({
    url: app.url + '/v1/attend/updateAttendForSys?classId=' + vm.data.classId + '&classSectionId=' + vm.data.classSectionId + '&attendDate=' + vm.data.attendDate,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        wx.navigateBack({ changed: true });//返回上一页  
      }else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../Introduction/Introduction',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};


function getIsCanPayHomeFee(homeId, attendId,time) {
  wx.request({
    url: app.url + '/v1/home/checkIsCanPay',
    data: {
      "homeId": homeId,
      "startTime":time
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        let status = res.data.response;
        if ("1" == status) {
          wx.navigateTo({
            url: '../expense-settlement/expense-settlement?attendId=' + attendId + '&startTime=' + time,
          })
        } else {
          wx.showToast({
            title: '该场所暂时不支持在线支付场馆费',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '请重新尝试',
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
      wx.showToast({
        title: '请重新尝试',
        icon: 'none',
        duration: 2000
      })
    }
  })
}
