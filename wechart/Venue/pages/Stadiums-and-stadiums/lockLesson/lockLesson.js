// pages/lockLesson/lockLesson.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
          
              homeId: "",
          attendDate:'',
      lastAttendDate:'',
      nextAttendDate:'',
       thisYearMonth:'',
           nextMonth:'',
           lastMonth:'',
          currentTab:'0',
      homeAttendList:[],
             thisDay:'',
        thisCalendar:[],
        Period:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const today = getDate(new Date());
    this.setData({
      attendDate: today,
         thisDay: new Date().getDate(),
          homeId: wx.getStorageSync('homeId')
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
    //获取今日开课
    app.noType();
    this.setData({ Period:0})
    getHomeAttendScheduleList(this,this.data.attendDate);
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

  currentTabClick:function(e){//tab切换
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {

      if (e.target.dataset.current==='0'){//今日开课
          getHomeAttendScheduleList(this, this.data.attendDate);
       }else{//本月开课
          //获取日历信息
          getThisCalendar(this, this.data.attendDate);
       }

      this.setData({
        currentTab: e.target.dataset.current
      });
    }
  },
  dayItemClick:function(e){//选择日期
    if (this.data.thisDay != e.target.dataset.dayid){
        this.setData({
          thisDay: e.target.dataset.dayid
        });
        const attendDate = this.data.thisYearMonth + '-' + formatNumber(e.target.dataset.dayid);
        getHomeAttendScheduleList(this, attendDate); 

    }
  },
  monthChange: function (e) {//月份改变
    
    getThisCalendar(this, e.target.dataset.attenddate); 
    //查询课程列表
    const attendDate = e.target.dataset.attenddate.substring(0, 7) + '-' + formatNumber(this.data.thisDay);
    getHomeAttendScheduleList(this, attendDate);

  }


})

function getThisCalendar(vm, monthDate){//获取日历
  wx.request({
    url: app.url + '/v1/attend/getClassCalendarList',
    method: 'POST',
    data: {
      "homeId": vm.data.homeId,
      "yearMonth": monthDate
    },
    success: (res) => {
      if (res.data.code == '10000') {
          var data = res.data.response;

          var calendar = data.dayVos; 
          vm.setData({
                thisCalendar: calendar,
              lastAttendDate: data.lastTime,
              nextAttendDate: data.nextTime,
                   lastMonth: data.lastTime.substring(5,7),
                   nextMonth: data.nextTime.substring(5, 7),
               thisYearMonth: monthDate.substring(0, 7)
          });
      } else {
        console.log(res.data.msg)
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })


}

function getHomeAttendScheduleList(vm, attendDate){//查询课程列表
  wx.request({
    url: app.url + '/v1/attend/getHomeAttendScheduleList',
    method: 'GET',
    data: {
      "homeId": vm.data.homeId,
      "attendDate": attendDate
    },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        if(data.length==0){
          vm.setData({ Period:1})
          return false;
        }
          vm.setData({
            homeAttendList: data,
            Period: 0
          })

      }else{
        console.log(res.data.msg)
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
}

function getDate(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
} 