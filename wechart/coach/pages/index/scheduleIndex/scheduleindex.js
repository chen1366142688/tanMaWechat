const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js')
const app=getApp().globalData
const date = new Date();
const month = parseInt(date.getMonth()) + 1;
const formatNumber = n => { return n >= 10 ? n : '0' + n }
const clen = 7;
let years = date.getFullYear() + '-' + formatNumber(month) + '-' + formatNumber(date.getDate());
var currentFirstDate;
Page({
  data: {
    imgUrls:[1,2,3],
    imgUrl:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/coach/iteration/',
    dateList:[],
    list:[],
    ScheduleInfo:[],
    hid:true,
    nullDate:'',
    count:0,
    idx:0,
    week:'',
    studentStatus:true,
    isMock:false,
    mockInfo:'是否移除学员名称？',
    userId:'',
    scrollLeft:0,
    toView:'',
    isMask:true,
    tabload:true,
    floorstatus:true,
    reachBottomAttendDates:'',
    lastHeigthChangeTime:0,
    current:1
  },
  onReady(){},
  onLoad(options) { },
  onShow() {
    let that = this;
    app.noType();
    that.setData({ userId: wx.getStorageSync('userInfo').userId, })
    setDate(new Date(),that,1);
    api._get(`/v1/attend/getCoachAttendInfo?dateStart=${years}`).then(res => {
      if(res.code == 10000){
        let result = res.response;
        that.setData({ tabload: false })
        let newArr = result.filter((val, index, arr) => {
          return val.attendDate == years;
        });
        if (newArr.length <= 0) {
          that.setData({ hid: false })
        } else {
          that.setData({ hid: true })
        }
        for (let [key, val] of result.entries()) {
          val.attendDates = val.attendDate
          val.attendDate = val.attendDate.split("-");
          val.status = false;
        }
        let datePass = (years + '-' + that.data.week).split("-");
        that.setData({ count: 0, list: result, nullDate: datePass })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '网络异常，请稍后再试！',
        icon:'none'
      })
    })
  },

  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {
    let that = this;
    //setDate(addDate(currentFirstDate, 7),that);暂时滚动没有改变日期
    if (that.data.count >= 4) { that.setData({ tabload:false}); return }
    let dateList = that.data.dateList;
    let list = that.data.list;
    var reachBottomAttendDates = that.data.count == 0 ? fun_submit(years) : fun_submit(that.data.reachBottomAttendDates); 
    api._get(`/v1/attend/getCoachAttendInfo?dateStart=${reachBottomAttendDates}`).then(res => {
      if (res.code == 10000) {
        let result = res.response;
        if (result.length == 0){
          that.setData({ count: 4,tabload: false})
          return;
        }
        for (let [key, val] of result.entries()) {
          val.attendDates = val.attendDate
          val.attendDate = val.attendDate.split("-");
          val.status = false;
        }
        that.setData({ list: list.concat(result), count: that.data.count + 1, reachBottomAttendDates: reachBottomAttendDates})
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '网络异常，请稍后再试！',
        icon: 'none'
      })
    })
  },
  onShareAppMessage() {},
  // toupper(e) {
  //   const that = this;
  //   let myDate = new Date();
  //   if (myDate.getTime() / 10 - that.data.lastHeigthChangeTime / 10 < 200) {
  //     that.setData({ toView: 'numOne' })
  //     return false;
  //   }
  //   that.setData({ lastHeigthChangeTime: myDate.getTime() })
  //   this.setData({ isMask: true })
  //   setDate(addDate(currentFirstDate, -7),this,2);
  // },
  // tolower(e) {
  //   const that = this;
  //   let myDate = new Date();
  //   if (myDate.getTime() / 10 - that.data.lastHeigthChangeTime / 10 < 200) {
  //     that.setData({ toView: 'numOne' })
  //     return false;
  //   }
  //   that.setData({ lastHeigthChangeTime: myDate.getTime() })
  //   this.setData({ isMask: true })
  //   setDate(addDate(currentFirstDate, 7),this,3);
  // },
  swiperChange(e){
    const that = this;
    let current = e.detail.current;
    console.log("current:",current)
    if (current-that.data.current == 1 || (that.data.current == 2 && current == 0)){//right
    console.log("右")
      setDate(addDate(currentFirstDate, 7), this, 3);
    } else{//left
      console.log("左")
      setDate(addDate(currentFirstDate, -7), this, 2);
    }
    that.setData({ current: current })
  },
  // 跳转课程详情
  getClassDetail(e){
    wx.navigateTo({
      url: '../../curriculum/curriculumDetail/curriculumDetail?attendId=' + e.currentTarget.dataset.attendid + "&classId=" + e.currentTarget.dataset.info.classId + "&classSectionId=" + e.currentTarget.dataset.info.classSectionId + "&attendDate=" + e.currentTarget.dataset.info.attendDate
    })
  },
  //加课
  goAddCurse(e){
    wx.navigateTo({
      url: `../../index/redact/redact?attendId=${e.currentTarget.dataset.attendid || ""}`,
    })
  },
  //旷课
  Absenteeism(e){
    this.setData({ studentStatus: !this.data.studentStatus})
  },
  //切换时间
  clickNowDate(e){
    let that = this;
    let nowDate = e.currentTarget.dataset.nowdate;
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    api._get(`/v1/attend/getCoachAttendInfo?dateStart=${nowDate}`).then(res => {
      if (res.code == 10000) {
        let result = res.response;
        that.setData({ tabload: false })
        let newArr = result.filter((val, index, arr) => {
          return val.attendDate == nowDate;
        });
        if(newArr.length <= 0){
          that.setData({ hid: false})
        }else{
          that.setData({ hid: true })
        }
        for (let [key, val] of result.entries()) {
          val.attendDates = val.attendDate
          val.attendDate = val.attendDate.split("-");
          val.status = false;
        }
        let datePass = (nowDate  + '-' + e.currentTarget.dataset.week).split("-");
        that.setData({ count:0, nullDate: datePass,list: result })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '网络异常，请稍后再试！',
        icon: 'none'
      })
    })
  },
  // 获取滚动条当前位置
  onPageScroll (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //拨打电话
  callPhone(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone || '',
      success(res){
        console.log("拨打成功")
      },fail(info){
        wx.showToast({
          title: '拨打电话失败，请查看电话是否正确',
          icon:'none'
        })
      }
    })
  },
  //旷课
  Absenteeism(e){
    const that = this;
    let scheduleId = e.currentTarget.dataset.scheduleid;
    let index = e.currentTarget.dataset.index;
    let signStatus = 2;
    api._get(`/v1/attend/updateAttendSignStatusNew?scheduleId=${scheduleId}&signStatus=${signStatus}`).then(res => {
      console.log(res)
      if(res.code == 10000){
        let list = that.data.list;
        for (let i = 0; i < list[index].studentVO.length;i++){
          if (list[index].studentVO[i].scheduleId == scheduleId ){
            list[index].studentVO[i].signStatus = 2;
            that.setData({ ["list[" + index + "]"]: list[index] })
          }
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '网络异常，请稍后再试！',
        icon: 'none'
      })
    })
  },

  //弹窗状态
  cancel() {
    this.setData({ isMock: false })
  },
  sure() { 
    const that = this;
    let scheduleId = that.data.scheduleId;
    let list = that.data.list;
    let index = that.data.idx;
    api._get(`/v1/attend/deleteAttendStudent?scheduleId=${scheduleId}`).then(res => {
      if (res.code == 10000) {
        this.setData({ isMock: false })
        for (let i = 0; i < list[index].studentVO.length;i++){
          if (list[index].studentVO[i].scheduleId == scheduleId){
            console.log(list[index])
            list[index].studentVO[i].splice(i, 1); 
            that.setData({ ["list[" + index + "]"]: list[index] })
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '网络异常，请稍后再试！',
        icon: 'none'
      })
    })
  },
  //移除
  deleteCurse(e){
    this.setData({ isMock: true, scheduleId: e.currentTarget.dataset.scheduleid, idx: e.currentTarget.dataset.index})
  },
  //取消旷课
  cancelAbsen(e){
    const that = this;
    let scheduleId = e.currentTarget.dataset.scheduleid;
    let index = e.currentTarget.dataset.index;
    let signStatus = 0;
    api._get(`/v1/attend/updateAttendSignStatusNew?scheduleId=${scheduleId}&signStatus=${signStatus}`).then(res => {
      console.log(res)//这里改变了状态应该刷新
      if (res.code == 10000) {
        let list = that.data.list;
        for (let i = 0; i < list[index].studentVO.length; i++) {
          if (list[index].studentVO[i].scheduleId == scheduleId) {
            list[index].studentVO[i].signStatus = 0;
            that.setData({ ["list[" + index + "]"]: list[index] })
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '网络异常，请稍后再试！',
        icon: 'none'
      })
    })
  },
  //学员列表收起展开
  clickTake(e){
    let that = this;
    let list = that.data.list;
    let all = e.currentTarget.dataset.all;
    for (let i = 0; i < list.length; i++) {
      if (all.attendId){
        if (list[i].attendId == all.attendId){
          list[i].status = !list[i].status;
          that.setData({ ["list[" + i + "]"]: list[i] })
          return;
        }
      }else{
        if (list[i].attendDate == all.attendDate && list[i].dayTimeEnd == all.dayTimeEnd && list[i].dayTimeStart == all.dayTimeStart && list[i].classSectionId == all.classSectionId) {
          list[i].status = !list[i].status;
          that.setData({ ["list[" + i + "]"]: list[i] })
          return;
        }
      }
      
    }
  }
})
var formatDate = function (date) {
  var year = formatNumber(date.getFullYear()) + '-';
  var month = formatNumber((date.getMonth() + 1)) + '-';
  var day = formatNumber(date.getDate()); 
  var week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  
  // return year + month + day + ' ' + week;
  return { "week": week, "date": day, "active": "", nowDate: year + month + day, studentCount:0}
};
var addDate = function (date, n) {
  date.setDate(date.getDate() + n);
  return date;
};
var setDate = function (date,that,num) {
  var week = date.getDay() - 1;
  var weekNow = {};
  let index = 0;
  var arr = []
  date = addDate(date, week * -1);
  currentFirstDate = new Date(date);
  for (var i = 0; i < clen; i++) {
    arr.push(formatDate(i == 0 ? date : addDate(date, 1)))
  }
  for (let [key, val] of arr.entries()) {
    if (val.nowDate == years){
      arr[key].active = 'active';
      weekNow = val;
      that.setData({week: weekNow.week })
    }
  }
  api._get(`/v1/attend/getCoachScheduleInfo?dateStart=${num == 1 ? years : arr[arr.length -7].nowDate}&dateEnd=${arr[arr.length - 1].nowDate}`).then(res => {
    if (res.code == 10000) { 
      for(let i = 0;i<arr.length;i++){
        for(let j = 0;j<res.response.length;j++){
          if (arr[i].nowDate == res.response[j].attendDate){
            arr[i].studentCount = res.response[j].studentCount
          }
        }
      }
      that.setData({ ScheduleInfo: res.response, dateList: arr,   })
    }else{
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    }
  }).catch(e => {
    console.log(e)
    wx.showToast({
      title: '网络异常，请稍后再试！',
      icon:'none'
    })
  })
  if (num == 2 || num == 3){
    AttendInfo(that, arr, weekNow)
  }else{
    setTimeout(() => { that.setData({ isMask: false })},1000)
  } 
};
function AttendInfo(that, arr, weekNow){
  api._get(`/v1/attend/getCoachAttendInfo?dateStart=${arr[arr.length - 7].nowDate}`).then(res => {
    if (res.code == 10000) {
      let result = res.response;
      that.setData({ tabload: false })
      let newArr = result.filter((val, index, arrs) => {
        return val.attendDate == arr[arr.length - 7].nowDate;
      });
      if (newArr.length <= 0) {
        that.setData({ hid: false })
      } else {
        that.setData({ hid: true })
      }
      for (let [key, val] of result.entries()) {
        val.attendDates = val.attendDate
        val.attendDate = val.attendDate.split("-");
        val.status = false;
      }
      let datePass = (arr[arr.length - 7].nowDate + '-' + (weekNow.week ? weekNow.week : '一')).split("-");
      that.setData({ count: 0, nullDate: datePass, list: result , isMask: false, })
    } else {
      that.setData({ isMask: false, })
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  }).catch(e => {
    console.log(e)
    that.setData({ isMask: false, })
    wx.showToast({
      title: '网络异常，请稍后再试！',
      icon: 'none'
    })
  })
}
function fun_submit(arg) {
  var date1 = new Date(arg);
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + 7);
  var times = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  return times;
}
