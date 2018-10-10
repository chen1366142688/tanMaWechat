const app = getApp().globalData;
const util = require('../../../utils/util.js');
const date = new Date();
const month = parseInt(date.getMonth()) + 1;
var nowMonth='',swiperMonth='';
const formatNumber = n => {return n >= 10 ? n : '0' + n}
var yearItration = ''
Page({ 
  data: {
    imgUrls: [1,2,3],
    imgUrl:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/iteration/',
    TableStatus: true,//课表显示状态
    getStuCalendarInfo:[],
    screenList: [],
    month:'', 
    array:[],
    i:0,
    defaultList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    dateList: ['8:00', '', '10:00', '', '12:00', '', '14:00', '', '16:00', '', '18:00', '', '20:00', '', '22:00'],
    schedInfo:[],
    listItem: [], 
    allDou:'',//选中的元素加动画 
    x: 300,
    y: 700,
    activeClassId:'',//选中的classID
    orderCode:'',//选中的订单id
    swing:'',
    swingList:'',
    okNext:false,//判断是否已经获取到数据，true才可以进行下一步操作
    okTxt2:false,//同上
    scheduleId: '', //选中的scheduleId
    btnLfText: '本周',//lfTxt
    btnRgText: '以后每周',//lfTxt
    modalTxt: '您是仅排本周，还是以后每周都这么上课呢？',
    change:0,//弹窗状态
    cilckObj:{},
    activeSpare:0,//当前长按课程的未排课课时
    activeSpareTime:0,//当前长按的剩余课时数
    weekday:'',
    bounceOutDown:'',
    animated:'',
    deleteImg:false,
    modal:false,//弹窗
    appTxt:'',//移动元素的内容
    appCol: '',//移动元素的内容,
    movableHeight:100,//默认悬浮元素的高度
    addCurrims:'addCurrims',
    scrollLeft:0,
    scrollLeftTop:0,
    toView:'',
    isXorY:false,
    longStatus:0,
    isMask: true,
    current: 1
  },
  onLoad(options) { },
  onReady() {
    let years = date.getFullYear() + '-' + formatNumber(month) + '-' + formatNumber(date.getDate());
    nowMonth = years;
  },
  onShow() {
    let that = this;
    app.noType();
    let mowDate = formatNumber(month) + '-' + formatNumber(date.getDate());
    let years = date.getFullYear() + '-' + formatNumber(month);
    that.setData({ month: month, okTxt2: false, okNext:false}) 
    wx.showLoading({
      title: '加载中...',
    })
    console.log(years)
    console.log(mowDate)
    getMyClassList(that)//底部课程列表
    getStuCalendarInfo(that, years, mowDate)//获取日历
    if (wx.getStorageSync('changeTime') == 1) {//是课班详情过来的
      that.setData({ 
        activeClassId: wx.getStorageSync('classId'), 
        longStatus: wx.getStorageSync('longStatus'),
        scrollLeft: wx.getStorageSync('week')
      })
      let int = setInterval(function () {
        if (that.data.array.length > 0 && that.data.okTxt2) { 
          clearInterval(int);
          getClassAttendInfo(that)
        }
      },50)
      setTimeout(function () { 
        that.setData({ swing: '', TableStatus: false, x: 300, y: 700, appCol: that.data.appCol, appTxt: that.data.appTxt, movableHeight: 100, addCurrims: 'addCurrims', bounceOutDown: 'allDou', isXorY: true}) 
        wx.setStorageSync('longStatus',0)
        wx.setStorageSync('week', 0)
      }, 50)
    }
  },
  onHide() {
    
  },
  onUnload() {
     
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  //日期优化
  swiperChange(e){
    const that = this;
    let current = e.detail.current;
    if (current - that.data.current == 1 || (that.data.current == 2 && current == 0)) {//right
      let NextMonth = util.getNextMonth(nowMonth);
      swiperMonth = NextMonth;
      yearItration = NextMonth.slice(0, 4)
      nowMonth = NextMonth + '-01';
      let mowDate = NextMonth.slice(-2) + '-01';
      that.setData({ month: NextMonth.slice(-2), isMask: true })
      getStuCalendarInfo(that, NextMonth, mowDate, 3)//获取日历
    } else {//left
      let PreMonth = util.getPreMonth(nowMonth);
      swiperMonth = PreMonth;
      yearItration = PreMonth.slice(0, 4)
      nowMonth = PreMonth + '-01';
      let mowDate = PreMonth.slice(-2) + '-01';
      that.setData({ month: PreMonth.slice(-2), isMask: true })
      getStuCalendarInfo(that, PreMonth, mowDate, 2)//获取日历
    }
    that.setData({ current: current })
  },
  longpress(e){//修改课班时间
    const that = this;
    wx.setStorageSync('changeTime',1)
    let attendDate = e.currentTarget.dataset.attenddate;
    let endTime = e.currentTarget.dataset.endtime;
    let isDate = date.getFullYear() + '-' + attendDate + " " + endTime + ':00';
    let dateisPan = new Date(isDate).getTime()/1000; //课程时间
    let nowDate = parseInt(date.getTime() / 1000);//当前时间
    if (dateisPan<nowDate){return}
    let cur = e.currentTarget.dataset.cur;
    let height = e.currentTarget.dataset.height;
    let top = parseInt(e.currentTarget.dataset.top) + 88
    let week = e.currentTarget.dataset.week;
    if (week > 4) { that.setData({ scrollLeft: 150 }) }
    let col = e.currentTarget.dataset.col;
    let scheduleId = e.currentTarget.dataset.scheduleid;
    let orderCode = e.currentTarget.dataset.ordercode;
    let activeClassId = e.currentTarget.dataset.classid;
    let listItem = that.data.listItem;
    let schedInfo = that.data.schedInfo;
    let result = that.data.getStuCalendarInfo;
    for (let i = 0; i < schedInfo.length; i++) {
      if (schedInfo[i].scheduleId == scheduleId) {
        schedInfo[i].name = 'rubberBand';
        that.setData({ ["schedInfo[" + i + "]"]: schedInfo[i] })
      } else { schedInfo[i].name = '' } 
    }
    for (let x = 0; x < result.length; x++) {
      result[x].arr = [];
      for (let y = 0; y < schedInfo.length; y++) {
        if (result[x].yearMonth == schedInfo[y].attendDate) {
          if (schedInfo[y].dayTimeEnd % 1 !== 0) {
            schedInfo[y].dayTimeEnd = parseInt(schedInfo[y].dayTimeEnd) + 1;
          }
          schedInfo[y].gosh = y;
          result[x].arr.push(schedInfo[y])
        }
      }
    }
    let array = split_array(result, 7);
    that.setData({array:array,longStatus:1})
    if (orderCode == null) {
      that.setData({ deleteImg: true, scheduleId: scheduleId })
    } else {
      let listNewArr = listItem.filter((val, index, arr) => {
        return val.orderCode == orderCode;
      });
      that.setData({ deleteImg: true, scheduleId: scheduleId, activeSpare: listNewArr[0].spareSchedule, activeSpareTime: listNewArr[0].spareTime, orderCode: orderCode, activeClassId: activeClassId })
      //获取空位
      getClassAttendInfo(that)
    }
    setTimeout(function () { 
      that.setData({ swing: '', TableStatus: !that.data.TableStatus, x: week * 134, y: top, appCol: col, appTxt: cur, movableHeight: height, addCurrims: 'addCurrims', bounceOutDown: 'allDou', isXorY:true}) 
    }, 800)
  },
  clickMonth(e){
    this.setData({ screenWeek: !this.data.screenWeek})
  },
  tapWeek(e){
    const that = this;
    let screenList = that.data.screenList;
    let num = e.currentTarget.dataset.num;
    for (let i = 0; i < screenList.length;i++){
      if (screenList[i].num == num){
        screenList[i].active = 'active'
      }else{
        screenList[i].active = ''
      }
    }
    wx.setStorageSync('indexTop', num - 1)
    that.setData({ screenList: screenList, i: num - 1, okNext:false})
    //请求当前周的数据
    getStuScheduleInfo(that, '',that.data.array[that.data.i])
    let int = setInterval(function () {
      if (that.data.okNext) {
        clearInterval(int);
        let schedInfo = that.data.schedInfo;
        let result = that.data.getStuCalendarInfo;
        let arr = [];
        for (let x = 0; x < result.length; x++) {
          result[x].arr = [];
          for (let y = 0; y < schedInfo.length; y++) {
            if (result[x].yearMonth == schedInfo[y].attendDate) {
              schedInfo[y].dayTimeEnd = schedInfo[y].dayTimeEnd.toString();
              schedInfo[y].dayTimeStart = schedInfo[y].dayTimeStart.toString();
              schedInfo[y].End = schedInfo[y].dayTimeEnd;
              schedInfo[y].dayTimeEnd = schedInfo[y].dayTimeEnd.indexOf(":") == -1 ? parseInt(schedInfo[y].dayTimeEnd) : parseInt(schedInfo[y].dayTimeEnd.replace(":", ""))
              schedInfo[y].dayTimeEnd = Number(schedInfo[y].dayTimeEnd) / 100
              if (schedInfo[y].dayTimeEnd % 1 !== 0) {
                schedInfo[y].dayTimeEnd = parseInt(schedInfo[y].dayTimeEnd) + 1;
              }
              schedInfo[y].Start = schedInfo[y].dayTimeStart;
              schedInfo[y].gosh = y;
              schedInfo[y].dayTimeStart = schedInfo[y].dayTimeStart.indexOf(":") == -1 ? schedInfo[y].dayTimeStart : schedInfo[y].dayTimeStart.replace(":", "")
              schedInfo[y].dayTimeStart = parseInt(Number(schedInfo[y].dayTimeStart) / 100)
              result[x].arr.push(schedInfo[y])
            }
          }
        }
        let array = split_array(result, 7);
        that.setData({ array: array})
        getClassAttendInfo(that)
      }
    }, 50);
  },
  longListItem(e){//修改课班时间
    const that = this;
    wx.setStorageSync('changeTime', 1)
    let cur = e.currentTarget.dataset.cur;
    let col = e.currentTarget.dataset.col;
    let id = e.currentTarget.dataset.ordercode;
    let classid = e.currentTarget.dataset.classid;
    let spare = e.currentTarget.dataset.spare;
    let spareTime = e.currentTarget.dataset.sparetime;
    let list = that.data.listItem;
    that.setData({ 
      movableHeight: 100, deleteImg: false, appCol: col, appTxt: cur, activeClassId: classid, orderCode: id, activeSpare: spare, activeSpareTime: spareTime, bounceOutDown: 'allDou', isXorY:true,longStatus:2
    })
    for(let i=0; i<list.length; i++){
      if (list[i].orderCode == id){
        list[i].name = 'rubberBand'
        that.setData({ ["listItem["+i+"]"]: list[i] })
      } 
      // else { list[i].name = ''; that.setData({ ["listItem[" + i + "]"]: list[i] })}
    }
    setTimeout( ()=> { 
      that.setData({ swingList: '', TableStatus: !that.data.TableStatus, addCurrims: 'addCurrims', allDou: 'allDou'})
      list.map((val, index, arr) => {
        if (val.name == 'rubberBand') {
          val.name = '';
          that.setData({ ["listItem[" + index + "]"]: val })
        }
      });
      //获取空位
      getClassAttendInfo(that)
    },800)
  },
  //点击有空位
  clickNullDate(e){
    const that = this;
    if (e.currentTarget.dataset.sparesignup == '0'){return}//已报满课程不可以进行操作
    let cilckObj={
      top: parseInt(e.currentTarget.dataset.top) + 88,
      height: e.currentTarget.dataset.height,
      week: e.currentTarget.dataset.week,
      classId:e.currentTarget.dataset.classid,
      classSectionId: e.currentTarget.dataset.classsectionid || '',
      attendId: e.currentTarget.dataset.attendid || '',
      attendDate: e.currentTarget.dataset.attenddate || '',
      dayTimeStart: e.currentTarget.dataset.start || '',
      dayTimeEnd: e.currentTarget.dataset.end || '',
      orderCode:that.data.orderCode
    };
    let arr = that.data.schedInfo;
    let newArr = arr.filter((val, index, arr) => {
      return val.classId == cilckObj.classId && val.End === e.currentTarget.dataset.end && val.Start === e.currentTarget.dataset.start ;
    });
    if(that.data.longStatus == 2){
      if (newArr.length > 0) { that.setData({ scheduleId: newArr[0].scheduleId }) }
    } else if (that.data.longStatus == 1){
      console.log("不管")
    }
    
    let week = e.currentTarget.dataset.week - 1;
    if (week > 3) { that.setData({ scrollLeft: 150 }) } else { that.setData({ scrollLeft: 0 })}
    that.setData({
      cilckObj: cilckObj, activeClassId: e.currentTarget.dataset.classid || '', okNext: false, okTxt2: false,
    })
    wx.setStorageSync('changeTime',0)
    wx.setStorageSync('classId', 0)
    //判断是否重复
    checkByDate(that, cilckObj)
  },
  //触发可移动元素
  changeMova(e){
    // console.log(e)
  },
  //长按空格地方
  longNull(e){
    const that = this;
    let cur = '+新增课程';
    let top = e.currentTarget.dataset.index*50 + 88
    let week = e.currentTarget.dataset.week-1;
    if (week>3){that.setData({scrollLeft:150})}
    that.setData({ TableStatus: !that.data.TableStatus, x: week * 134, y: top, appCol: 'col', appTxt: cur, movableHeight: 50, deleteImg: false, addCurrims: '', weekday: parseFloat(week), isXorY:false})
  },
  //点击记录
  goInfo(e) {
    wx.navigateTo({
      url: '../Course-record/Course-record?orderCode=' + e.currentTarget.dataset.ordercode,
    })
  },
  //点击课班去详情
  goCurseDeta(e){
    const that = this;
    let scheduleId = e.currentTarget.dataset.scheduleid;
    let scheduleName = e.currentTarget.dataset.schedulename;
    let col = e.currentTarget.dataset.col;
    let activeClassId = e.currentTarget.dataset.classid;
    let attendDate = e.currentTarget.dataset.attenddate;
    let endTime = e.currentTarget.dataset.endtime;
    let week = e.currentTarget.dataset.week;
    if (week > 4) { that.setData({ scrollLeft: 150 }); wx.setStorageSync('week', 150)}
    
    this.setData({ appCol: col, appTxt: scheduleName, activeClassId: activeClassId, longStatus: 1, scheduleId: scheduleId})
    if(e.currentTarget.dataset.scheduletype == "01"){
      let isDate = date.getFullYear() + '-' + attendDate + " " + endTime + ':00';
      let dateisPan = new Date(isDate).getTime() / 1000; //课程时间
      let nowDate = parseInt(date.getTime() / 1000);//当前时间
      if (dateisPan < nowDate) {
        wx.navigateTo({
          url: '../CourseDetails/CourseDetails?scheduleId=' + scheduleId + '&noShowFoot=1',
        })
      } else {
        wx.navigateTo({
          url: '../CourseDetails/CourseDetails?scheduleId=' + scheduleId + '&noShowFoot=2',
        })
      }
    }else{
        wx.navigateTo({
          url: '../NewAgenda/NewAgenda?scheduleId=' + scheduleId,
        })
    } 
  },
  //点击课程列表去课程详情
  goItemInfo(e){
    const that = this;
    let cur = e.currentTarget.dataset.cur;
    let col = e.currentTarget.dataset.col;
    let id = e.currentTarget.dataset.ordercode;
    let classid = e.currentTarget.dataset.classid;
    let spare = e.currentTarget.dataset.spare;
    let spareTime = e.currentTarget.dataset.sparetime;
    that.setData({
       deleteImg: false,
       orderCode: id, 
    })
    wx.navigateTo({
      url: '../CourseDetails/CourseDetails?orderCode=' + id
    })
  },
  //点击新增课程
  NewCourses(e){
    if (this.data.weekday == null){return}
    wx.navigateTo({
      url: '../../../pages/Timetable/NewClasses/NewClasses?dateTime=' + date.getFullYear() + '-' + this.data.array[this.data.i][this.data.weekday].yearMonth,
    })
    this.setData({
      TableStatus: !this.data.TableStatus, okNext: false,
      okTxt2: false})
  },
  //删除日程
  deleteImg(e){
    const that = this;
    that.setData({
       change: 3, 
       modal: !this.data.modal,
       modalTxt: '是否要退出该课班',
       btnLfText: '取消',
       btnRgText: '确定',
       okNext: false,//判断是否已经获取到数据，true才可以进行下一步操作
       okTxt2: false,//同上
       scrollLeft: 0,
      isXorY: false,
      bounceOutDown: '',
    })
    wx.setStorageSync('changeTime', 0)
    wx.setStorageSync('classId', 0)
  },
  //取消按钮
  cancelImg(e){
    const that = this;
    let schedInfo = that.data.array[that.data.i];
    for (let val of schedInfo) {
      for (let vals of val.arr){
        vals.name = ''
      }
    }
    that.setData({ 
      ["array[" + that.data.i + "]"]: schedInfo,
      animated: '', 
      bounceOutDown: '', 
      TableStatus: !that.data.TableStatus,
      activeClassId:'',
      okNext: false,//判断是否已经获取到数据，true才可以进行下一步操作
      okTxt2: false,//同上
      scrollLeft: wx.getStorageSync('week'),
      bounceOutDown:'',
      isXorY:false,
      x: 300,
      y: 700,
    })
    wx.setStorageSync('changeTime', 0)
    wx.setStorageSync('classId', 0)
  },
   
  //弹窗取消
  cancel(e){
    let that = this;
    let change = e.currentTarget.dataset.change;
    switch (change) {
      case 1://弹窗1：该时段已安排课程，是否挤掉该课程
        break;
      case 2://弹窗2：课程已开始，不可以在取消课程
        break;
      case 3://弹窗3：是否要退出该课班
        break;
      case 4://弹窗4：没有未安排课时，是否要把最后一堂课移到这里？
        break;
      case 5://弹窗5：课时已用完，需要先续费(暂时跳转到详情去购买课程)
        wx.navigateTo({
          url: '../../../pages/keChen/coursedetails/coursedetails',
        })
        this.setData({ TableStatus: !that.data.TableStatus })
        break;
    }
    this.setData({ modal: !this.data.modal})
  },
  sure(e){
    let that = this;
    let change = parseInt(e.currentTarget.dataset.change);
    this.setData({ modal: !this.data.modal})
    switch (change) {
      case 1://弹窗1：该时段已安排课程，是否挤掉该课程
        //删除日程
        if(that.data.longStatus == 1){
          deleteStuSchdle(that)
        }else if(that.data.longStatus == 2){
          addSchdeule(that, that.data.cilckObj)
        }
        //that.setData({ animated: 'animated', bounceOutDown: 'fadeOutDownBig'})
        //添加课班日程
        //addSchdeule(that, that.data.cilckObj)
        break;
      case 2://弹窗2：课程已开始，不可以在取消课程
        break;
      case 3://弹窗3：是否要退出该课班
        //删除日程
        deleteStuSchdle(that)
        that.setData({ animated: 'animated', bounceOutDown: 'fadeOutDownBig', activeClassId: '', })
        break;
      case 4://弹窗4：没有未安排课时，是否要把最后一堂课移到这里？
        break;
      case 5://弹窗5：课时已用完，需要先续费(暂时跳转到详情去购买课程)
        wx.navigateTo({
          url: '../../../pages/keChen/coursedetails/coursedetails',
        })
        this.setData({TableStatus: !that.data.TableStatus})
        break;
    }
  }
})
//判断是否重复
function checkByDate(that, cilckObj){
  let year = date.getFullYear() + '-';
  wx.request({
    url: app.url + '/v1/schedule/checkScheduleByDate',
    method: "GET",
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: { 
      scheduleId: '',
      attendDate: year+cilckObj.attendDate,
      dayTimeStart: cilckObj.dayTimeStart,
      dayTimeEnd: cilckObj.dayTimeEnd
    },
    success(res) {
      if (res.data.code == 10000) {
        if(res.data.response == 0){//无重复
          //判断未排课课时是否为0
          if (that.data.activeSpare <= 0){
            that.setData({
              modal: !that.data.modal,
              btnLfText: '取消',
              btnRgText: '确认',
              modalTxt: '您没有未安排课时',
              change: 4
            })
            return;
          } else if (that.data.activeSpareTime <= 0){
            that.setData({
              modal: !that.data.modal,
              btnLfText: '取消',
              btnRgText: '确认',
              modalTxt: '课时已用完，需要先续费',
              change: 5
            })
            return;
          }else{
            if(that.data.longStatus == 1){
              /*删除当前课程*/
              deleteStuSchdle(that)
            }else{
              //添加课班日程
              addSchdeule(that, cilckObj)
            }
          }
        }else{//课班重复是否挤掉
          that.setData({ 
            modal:!that.data.modal,
            btnLfText:'取消',
            btnRgText:'确认',
            modalTxt:'该时段已安排课程，是否挤掉该课程',
            change:1
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: '网络异常，请重试',
        icon: 'none'
      })
    }
  })
}

//删除日程
function deleteStuSchdle(that){
  wx.request({
    url: app.url + '/v1/schedule/deleteStuSchedule',
    method: "GET",
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: { scheduleId: that.data.scheduleId},
    success(res){
      if(res.data.code == 10000){
        console.log("删除成功：change",that.data.change)
        if (that.data.change == 0 || that.data.change == 1){ 
          //添加课班日程
          addSchdeule(that, that.data.cilckObj)
        }else{
          // that.setData({ movableHeight: that.data.cilckObj.height, allDou: '', x: (that.data.cilckObj.week - 1) * 134, y: that.data.cilckObj.top })           //去抖动，换位置
          //删除课班成功的动画然后回到第一个状态
          // let mowDate = formatNumber(month) + '-' + formatNumber(date.getDate());
          // let years = date.getFullYear() + '-' + formatNumber(month);
          getStuCalendarInfo(that, swiperMonth, that.data.cilckObj.attendDate)//获取日历//获取日历
          getMyClassList(that)//底部课程列表
          setTimeout(() => { that.setData({ bounceOutDown: '', animated: '', TableStatus: true, x: 300, y: 700, movableHeight: 100, change:0}) }, 600)
        }
      }else{
        if(res.data.code == 30004){
          wx.showModal({
            title: '提示',
            content: '教练已修改课程时间，请重新排课',
            success: function (res) {
              if (res.confirm) {
                let mowDate = formatNumber(month) + '-' + formatNumber(date.getDate());
                let years = date.getFullYear() + '-' + formatNumber(month);
                getMyClassList(that)//底部课程列表
                getStuCalendarInfo(that, years, mowDate)//获取日历   
                that.setData({ TableStatus: true})
              } else if (res.cancel) {
                let mowDate = formatNumber(month) + '-' + formatNumber(date.getDate());
                let years = date.getFullYear() + '-' + formatNumber(month);
                getMyClassList(that)//底部课程列表
                getStuCalendarInfo(that, years, mowDate)//获取日历  
                that.setData({ TableStatus: true }) 
              }
            }
          }) 
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    },
    fail(info){
      wx.showToast({
        title: '删除失败，请重试',
        icon:'none'
      })
    }
  })
}
//获取底部列表
function getMyClassList(that){
  wx.request({
    url: app.url + '/v1/schedule/getScheduleOrder',
    method : "GET",
    header: { 'token': wx.getStorageSync('userInfo').token },
    success : function(res){
      if (res.data.code == 10000){
        let result = res.data.response;
        for (let val of result) {
          val.name = ''
        }
        that.setData({
           listItem : result
        })
      }else{
        if (wx.getStorageSync('userInfo').token) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          console.log("用户没有登录所以报错了")
        }
      }
    }
  })
} 
//获取日历
function getStuCalendarInfo(that,years,date,num){
  wx.app.request({
    url: app.url+'/v1/schedule/getStuCalendarInfo',
    header : {'token' : wx.getStorageSync('userInfo').token},
    data: {yearMonth: years || ''},
    method: 'GET',
    success(res) {
      setTimeout(() => { wx.hideLoading() }, 800)
      if(res.data.code == '10000'){
        let result = res.data.response;
        let monthWeek = result.length/7;
        let screenList = [];
        let arrayObj = split_array(result, 7);
        console.log(monthWeek)
        for (let i = 0;  i < monthWeek;i++){
          screenList.push({ 'name': `第${i+1}周`, 'num': i+1, 'active': ''})
        }
        let newArr = result.filter((val, index, arr) => {
          return val.yearMonth == date;
        });
        newArr = newArr.length == 0 ? [result[0]] : newArr;
        let indexTop=0;
        for (let j = 0; j < result.length;j++){
          if (result[j].yearMonth == newArr[0].yearMonth){
            j+=1;
            if (j / 7 <= 1) {indexTop=0;} 
            else if(j/7 >1 && j/7 <=2){indexTop = 1;} 
            else if (j / 7 > 2 && j / 7 <= 3){indexTop = 2;}
            else if (j / 7 > 3 && j / 7 <= 4) {indexTop = 3;}
            else if (j / 7 > 4 && j / 7 <= 5) {indexTop = 4;}
            else if (j / 7 > 5 && j / 7 <= 6) {indexTop = 5;}
            else if (j / 7 > 6 && j / 7 <= 7) {indexTop = 6;}
            if(wx.getStorageSync('indexTop')){//非第一次
              that.setData({ i: wx.getStorageSync('indexTop') })
              wx.getStorageSync('indexTop') >= screenList.length ? screenList[screenList.length-1].active = 'active':screenList[wx.getStorageSync('indexTop')].active = 'active'
              let indexClass = wx.getStorageSync('indexTop') >= screenList.length ? screenList.length - 1 : wx.getStorageSync('indexTop')
              getStuScheduleInfo(that, years,arrayObj[indexClass])
            }else{//这是第一次
              that.setData({ i: indexTop })
              screenList[indexTop].active = 'active'
              getStuScheduleInfo(that, years, arrayObj[indexTop])
              wx.setStorageSync('indexTop', indexTop)
              
            }
          }
        }
        let int = setInterval(function () {
          if (that.data.okNext){
            clearInterval(int);
            let schedInfo = that.data.schedInfo;
            for (let x = 0; x < result.length; x++) {
              result[x].arr = [];
              for (let y = 0; y < schedInfo.length; y++) {
                if (result[x].yearMonth == schedInfo[y].attendDate) {
                  schedInfo[y].dayTimeEnd = schedInfo[y].dayTimeEnd.toString();
                  schedInfo[y].dayTimeStart = schedInfo[y].dayTimeStart.toString();
                  schedInfo[y].End = schedInfo[y].dayTimeEnd;
                  schedInfo[y].dayTimeEnd = schedInfo[y].dayTimeEnd.indexOf(":") == -1 ? parseInt(schedInfo[y].dayTimeEnd) : parseInt(schedInfo[y].dayTimeEnd.replace(":", "") )
                  schedInfo[y].dayTimeEnd = Number(schedInfo[y].dayTimeEnd) / 100
                  if (schedInfo[y].dayTimeEnd % 1 !== 0) {
                    schedInfo[y].dayTimeEnd = parseInt(schedInfo[y].dayTimeEnd) + 1;
                  }
                  schedInfo[y].Start = schedInfo[y].dayTimeStart;
                  schedInfo[y].gosh =y;
                  schedInfo[y].dayTimeStart = schedInfo[y].dayTimeStart.indexOf(":") == -1 ? schedInfo[y].dayTimeStart : schedInfo[y].dayTimeStart.replace(":", "")
                  schedInfo[y].dayTimeStart = parseInt(Number(schedInfo[y].dayTimeStart) / 100)
                  result[x].arr.push(schedInfo[y])
                }
              }
            }
            let array = split_array(result, 7);
            console.log("获取日历",array)
            that.setData({ getStuCalendarInfo: result, screenList: screenList, array: array, okTxt2: true, okNext:false }) 
          }
          console.log("num-->",num)
          if (num == 2) {
            that.setData({ toView: 'numOne', isMask: false, })
          } else if (num == 3) {
            that.setData({ toView: 'numOne', isMask: false, })
          } else {
            setTimeout(() => { that.setData({ isMask: false, toView: 'numOne' }) }, 1000)
          } 
        }, 100);
      }else{
        that.setData({ isMask: false,})
        if (wx.getStorageSync('userInfo').token) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          console.log("用户没有登录所以报错了")
        }
      }
    },
    fail(res) {
      setTimeout(() => { wx.hideLoading() }, 800)
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    }
  })
}
//获取日程安排信息
function getStuScheduleInfo(that,years, arrayObj) {
  let year = years ? years.slice(0, 4) + '-' : date.getFullYear()+'-';
  wx.request({
    url: app.url + '/v1/schedule/getStuScheduleInfo',
    method: "GET",
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      dateStart: year + arrayObj[0].yearMonth,
      dateEnd: year + arrayObj[arrayObj.length-1].yearMonth
    },
    success(res) {
      if (res.data.code == 10000) {
        let result = res.data.response;
        for (let val of result) {
          val.name = ''
        }
        that.setData({ schedInfo: result, okNext: true, isMask:false})
      } else {
        that.setData({ isMask: false })
        if(wx.getStorageSync('userInfo').token){
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }else{
          console.log("用户没有登录所以报错了")
        }
      }
    }
  })
} 
//获取空位
function getClassAttendInfo(that){
  let year = date.getFullYear() + '-';
  let getStuCalendarInfo = that.data.getStuCalendarInfo;
  wx.request({
    url: app.url + '/v1/schedule/getClassAttendInfo',
    method: "GET",
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      classId:that.data.activeClassId,
      dateStart: year + that.data.array[that.data.i][0].yearMonth,
      dateEnd: year + that.data.array[that.data.i][that.data.array[that.data.i].length-1].yearMonth
    },
    success: function (res) {
      if (res.data.code == 10000) {
        let schedInfo = res.data.response;
        let arr = [];
        for (let x = 0; x < getStuCalendarInfo.length; x++) {
          getStuCalendarInfo[x].attendArr = [];
          for (let y = 0; y < schedInfo.length; y++) {
            if (getStuCalendarInfo[x].yearMonth == schedInfo[y].attendDate) {
              schedInfo[y].End = schedInfo[y].dayTimeEnd;
              schedInfo[y].dayTimeEnd = schedInfo[y].dayTimeEnd.replace(":", "")
              schedInfo[y].dayTimeEnd = Number(schedInfo[y].dayTimeEnd) / 100
              if (schedInfo[y].dayTimeEnd % 1 !== 0) {
                schedInfo[y].dayTimeEnd = parseInt(schedInfo[y].dayTimeEnd) + 1;
              }
              schedInfo[y].Start = schedInfo[y].dayTimeStart;
              schedInfo[y].gosh = y;
              schedInfo[y].dayTimeStart = schedInfo[y].dayTimeStart.replace(":", "")
              schedInfo[y].dayTimeStart = parseInt(Number(schedInfo[y].dayTimeStart) / 100)
              getStuCalendarInfo[x].attendArr.push(schedInfo[y])
            }
          }
        }
        let array = split_array(getStuCalendarInfo, 7);
        that.setData({ array: array,y:750}) 
      }
    }
  })
}
//添加课班日程
function addSchdeule(that, cilckObj){
  let year = date.getFullYear() + '-';
  console.log(that.data.activeClassId)
  wx.request({
    url: app.url + '/v1/schedule/saveStuSchedule',
    method: "POST",
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      "attendDate": year +cilckObj.attendDate || '',
      "attendId": cilckObj.attendId || '',
      "classId": that.data.activeClassId,
      "classSectionId": cilckObj.classSectionId,
      "orderCode": cilckObj.orderCode,
    },
    success(res){
      if (res.data.code == 10000) {
        that.setData({  x: 134 * (cilckObj.week - 1), y: cilckObj.top, movableHeight: cilckObj.height, })
        //添加成功的动画然后回到第一个状态
        // let mowDate = formatNumber(month) + '-' + formatNumber(date.getDate());
        // let years = date.getFullYear() + '-' + formatNumber(month);
        getStuCalendarInfo(that, swiperMonth, cilckObj.attendDate)//获取日历
        getMyClassList(that)//底部课程列表
        setTimeout(() => { that.setData({ TableStatus: true, x: 300, y: 700, movableHeight: 100, bounceOutDown: '', animated: ''}) }, 500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }
  })
}
function forNum(num){
  const arrNum = ['零','一','二','三','四','五','六','七','八','九','十','十一','十二'];
  for (let [key, val] of arrNum.entries()) {
    if (num == key) { return val}
  }
}
function split_array(arr,len){
  let a_len = arr.length;
  let result = new Array();
  for (let i = 0; i < a_len;i+= 7){
    result.push(arr.slice(i,i+len))
  }
  return result;
}
function chinanum(num) {
  num--;
  var china = new Array('一', '二', '三', '四', '五', '六', '日');
  var arr = new Array();
  for (var i = 0; i < china.length; i++) {
    arr[0] = china[num];
  }
  return arr.join("")
}
