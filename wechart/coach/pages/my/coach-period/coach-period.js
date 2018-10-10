 // pages/my/coach-period/coach-period.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'list-header-ab', 
    coursepersonbnotice: '',
    startDate: fmtDate(new Date - 24 * 60 * 60 * 1000),
    endDate: fmtDate(new Date),
    end: fmtDate(new Date),
    totalCourseCount:0,
    totalCourseFee:0,
    classPeriodList:[],
    classHaveData:true,
    classPageNo:1,
    coachPeriodList:[],
    coachHaveData:true,
    coachPageNo:1,
    height:450,
    Period:false
  },
  //点击切换tabbar
  kecheng (e) {
    var val = e.currentTarget.dataset.val;
    var that = this;
    if (val == 1) {//这是用户点击训练课程
      that.setData({
        coursepersona: 'list-header-ab',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 2) {//这是用户点击开课通知
      that.setData({
        coursepersona: '',
        coursepersonbnotice: 'list-header-ab',
        trainingcourse: true,
        noticecoursetab: false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    getTotalInfo(vm);
    getClassPeriodClassList(vm);
    getClassPeriodCoachList(vm);
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
  
  },
  startDateChange:function(e){
    var vm=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    vm.setData({
      startDate: e.detail.value,
      coachPeriodList: [],
      classPeriodList: []
    })
    getTotalInfo(vm);
    getClassPeriodClassList(vm);
    getClassPeriodCoachList(vm);
  },
  endDateChange: function (e) {
    var vm = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    vm.setData({
      endDate: e.detail.value,
      coachPeriodList:[],
      classPeriodList:[]
    })
    getTotalInfo(vm);
    getClassPeriodClassList(vm);
    getClassPeriodCoachList(vm);
  },
  classMore:function(){
    var vm=this;
    let classPageNo = vm.data.classPageNo;
    console.log(classPageNo)
    classPageNo++;
    console.log(classPageNo)
    vm.setData({
      classPageNo: classPageNo
    })
    if (vm.data.classHaveData){
      getClassPeriodClassList(vm);
    }
  },
  classDetail:function(e){
    var vm=this;
    let classId=e.currentTarget.dataset.classid;
    let openstate = e.currentTarget.dataset.openstate;
    let classPeriodList = vm.data.classPeriodList;
    for(let i=0;i<classPeriodList.length;i++){
      if(classId == classPeriodList[i].classId){
        openstate = openstate?false:true;
        classPeriodList[i].openState=openstate;
        break;
      }
    }
    vm.setData({
      classPeriodList: classPeriodList
    })
  },
  coachMore:function(){
    var vm = this;
    let coachPageNo = vm.data.coachPageNo;
    coachPageNo++;
    vm.setData({
      coachPageNo: coachPageNo
    })
    if (vm.data.coachHaveData) {
      getClassPeriodCoachList(vm);
    }
  },
  coachDetail: function (e) {
    var vm = this;
    let coachUserId = e.currentTarget.dataset.coachuserid;
    let openstate = e.currentTarget.dataset.openstate;
    let coachPeriodList = vm.data.coachPeriodList;
    for (let i = 0; i < coachPeriodList.length; i++) {
      if (coachUserId == coachPeriodList[i].coachUserId) {
        openstate = openstate ? false : true;
        coachPeriodList[i].openState = openstate;
        break;
      }
    }
    vm.setData({
      coachPeriodList: coachPeriodList
    })
  },




})

function fmtDate(obj){
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

function getTotalInfo(vm) {
  wx.request({
    url: app.url + '/v1/classperiod/getTotalInfo',
    data: {
      "startTime": vm.data.startDate,
      "endTime": vm.data.endDate,
      "orgUserId": wx.getStorageSync('userInfo').userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success(res) {
      // console.log(res)
      if (res.data.code == 10000) {
        vm.setData({
          totalCourseFee: res.data.response.totalCourseFee,
          totalCourseCount: res.data.response.totalCourseCount
        })
      }
    },
    fail(info) {
      console.log(info)
    }
  })
}

function getClassPeriodClassList(vm) {
  wx.request({
    url: app.url + '/v1/classperiod/getClassPeriodClassList',
    data: {
      "startTime": vm.data.startDate,
      "endTime": vm.data.endDate,
      "orgUserId": wx.getStorageSync('userInfo').userId,
      "pageNo":vm.data.classPageNo,
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success(res) {
      // console.log(res)
      if (res.data.code == 10000) {
        var list = res.data.response;
        if(list.length>0){
          let classPeriodList = vm.data.classPeriodList.concat(list);
          vm.setData({
            classPeriodList: classPeriodList
          })
          if(list.length<16){
            vm.setData({
              classHaveData: false
            })
          }
        }else{
          vm.setData({
            classHaveData:false
          })
        }
      }
    },
    fail(info) {
      console.log(info)
    }
  })
}

function getClassPeriodCoachList(vm) {
  wx.request({
    url: app.url + '/v1/classperiod/getClassPeriodCoachList',
    data: {
      "startTime": vm.data.startDate,
      "endTime": vm.data.endDate,
      "orgUserId": wx.getStorageSync('userInfo').userId,
      "pageNo": vm.data.coachPageNo,
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success(res) {
      console.log(res)
      if (res.data.code == 10000) {
        var list = res.data.response;
        if (list.length == 0 && vm.data.coachPageNo==1){
          vm.setData({ Period:true,height:0 })
          return false;
        }
        if (list.length > 0) {
          let coachPeriodList = vm.data.coachPeriodList.concat(list);
          vm.setData({
            coachPeriodList: coachPeriodList,
            Period: false, height: 450
          })
          if (list.length < 16) {
            vm.setData({
              coachHaveData: false,
              Period: false, height: 450
            })
          }
        } else {
          vm.setData({
            coachHaveData: false,
            Period: false, height: 450
          })
        }
      }
    },
    fail(info) {
      console.log(info)
    }
  })
}
