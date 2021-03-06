/*次三位数次数*/
const years = []
const months = []
const days = []
/*四位数带小数*/
const firstPlaces = []
const secondBits = []
const thirdBits = []
const fourthBits  = []
//three
const heights = []
const heightBits = []
const heightThirds = []
const heightFourths = []
const app = getApp().globalData
for (let i = 0; i <= 9; i++) {
  months.push(i)
  years.push(i)
  days.push(i)
  //五位数的时候
  firstPlaces.push(i)
  secondBits.push(i)
  thirdBits.push(i)
  fourthBits.push(i)
  heights.push(i)
  heightBits.push(i)
  heightThirds.push(i)
  heightFourths.push(i)
}
/*正计时*/
var second = 0;//初始化
var millisecond = 0;//毫秒
var int;
/*倒计时*/
var secondMax = 999;//初始化
var millisecondMax = 1000;//毫秒
var interval;
Page({
  data: {
    seconds: 0,
    secondMax: 3599,
    timeMax:'999:99',
    maxTime:'999:99',
    actionMax:true,
    stopMaxTime:false,
    resetMax:false,
    time: '000:00',
    cost: 0,
    action:true,
    stopTime:false,
    reset:false,
    childName: [ 
      { "name": '选项1', "active": true },
      { "name": '选项2', "active": false },
      { "name": "选项3", "active": false },
      { "name": '选项4', "active": false }
    ],
    active1:true,
    active2: false,
    active3: false,
    active4: false,
    active: 'Exercise-Program-choose-one',
    years: years,
    year: 0,
    months: months,
    month: 0,
    days: days,
    day: 0,
    value: [0, 0, 0],
    firstPlaces: firstPlaces,
    firstPlace:0,
    secondBits: secondBits,
    secondBit:0,
    thirdBits: thirdBits,
    thirdBit:0,
    fourthBits: fourthBits,
    fourthBit:0,
    valueTime:[0,0,0,0],
    heights: heights,
    height: 0,
    heightBits: heightBits,
    heightBit: 0,
    heightThirds: heightThirds,
    heightThird: 0,
    heightFourths: heightFourths,
    heightFourth: 0,
    valueHeight: [0, 0, 0, 0],
    SuffixOnt:'s',
    Suffix:'次',
    SuffixCm:'cm',
    childId : 0
  },
  cilckChild(e) {
    const that = this;
    let index = e.currentTarget.dataset.index;
    let childName = that.data.childName;
    if(index == 0){
      that.setData({
        active1: true,
        active2: false,
        active3: false,
        active4: false,
      })
    }else if(index == 1){
      that.setData({
        active1: false,
        active2: true,
        active3: false,
        active4: false,
      })
    }else if(index == 2){
      that.setData({
        active1: false,
        active2: false,
        active3: true,
        active4: false,
      })
    }else{
      that.setData({
        active1: false,
        active2: false,
        active3: false,
        active4: true,
      })
    }
    for (let i = 0; i < childName.length; i++) {
      if (index == i) {
        childName[i].active = true;
      } else {
        childName[i].active = false;
      }
    }
    that.setData({ childName: childName })
  },
  bindChange: function (e) {
    const val = e.detail.value
    // console.log(val)
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
    })
  },
  bindChangeTime:function(e){
    let value = e.detail.value
    this.setData({
      firstPlace: this.data.firstPlaces[value[0]],
      secondBit: this.data.secondBits[value[1]],
      thirdBit: this.data.thirdBits[value[2]],
      fourthBit: this.data.fourthBits[value[3]]
    })
  },
  bindChangeHeight:function(e){
    let value = e.detail.value
    this.setData({
      height: this.data.heights[value[0]],
      heightBit: this.data.heightBits[value[1]],
      heightThird: this.data.heightThirds[value[2]],
      heightFourth: this.data.heightFourths[value[3]]
    })
  },
  onLoad: function (options) {
    this.setData({
      childId: options.childrenid,
      testId : options.testId
    })
  },
  timing(e){
    this.setData({ action: !this.data.action})
    start(this)
  },
  stopTime(e) {
    console.log("共计秒：" + second + '秒:' + millisecond+'毫秒')
    let arr = formatTimeS(second);
    let millSecondTotal = millisecond/10;
    millSecondTotal = String(millSecondTotal);
    if (millSecondTotal < 10){//说明这是一位数
      millSecondTotal = '1';
    }else{
      if (millSecondTotal.slice(1, millSecondTotal.length) > 0 && millSecondTotal.slice(1, millSecondTotal.length) < 9){
        millSecondTotal = Number(millSecondTotal.slice(0, 1)) + 1;
      }else{
        millSecondTotal = Number(millSecondTotal.slice(0, 1));
      }
    }
    if (millSecondTotal>9){
      millSecondTotal = 0;
      arr[2] = arr[2]+1
    }
    arr.push(millSecondTotal)
    this.setData({
      valueTime:arr,
      firstPlace:arr[0] > 0 ? arr[0] : 0,
      secondBit:arr[1] > 0 ? arr[1] : 0,
      thirdBit:arr[2] > 0 ? arr[2] : 0,
      fourthBit:arr[3] > 0 ? arr[3] : 0
    })
    stop(this)
  },
  reset(e) {
    Reset(this)
  },
  timingMax(e){
    this.setData({ actionMax: !this.data.actionMax, stopMaxTime: false })
    startMax(this)
  },
  stopMaxTime(e){
    console.log("现在是记录的时间时长：",this.data.secondMax)
    stopMax(this)
    this.setData({ stopMaxTime: true, resetMax: true })
  },
  resetMax(e) {
    ResetMax(this)
  },
  pauseBtnTime(){
    let pushObj = {
      childId: parseFloat(this.data.childId),
      parentId: wx.getStorageSync('userInfo').userId,
      testId: parseFloat(this.data.testId),
      list: [{
        orderIndex: 0,
        testTabId: 0,
        testValue: "" + this.data.firstPlace + this.data.secondBit + this.data.thirdBit + "." + this.data.fourthBit
      }]
    }
    console.log(wx.getStorageSync('userInfo').oauthToken.token)
    console.log(pushObj)
    wx.request({
      url: app.rQUrl + '/v1/corporeityTest/addTestResult',
      method: 'POST',
      header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
      data: pushObj,
      success: function (res) {
        console.log(res)
      }
    })
  },
  pauseBtnCount(){
    console.log(this.data.year,this.data.month,this.data.day)
  },
  pauseBtnDistance(){
    console.log(this.data.height, this.data.heightBit, this.data.heightThird, this.data.heightFourth)
  },
  // 提交数据
  pushResult(){
  }, 
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function (res) { },
})
//正重置函数
function Reset(that) {
  clearInterval(int);
  millisecond = second = 0;
  that.setData({time:'000:00',action:!that.data.action})
}
//正开始函数
function start(that) {
  int = setInterval(function () { timer(that)}, 10);//每隔50毫秒执行一次timer函数
}
//正计时函数
function timer(that) {
  millisecond = millisecond + 10;
  if (millisecond >= 1000) {
    millisecond = 0;
    second = second + 1;
  }
  if (second >= 999) {
    clearInterval(int);
  }
  that.setData({ time: formatTimeSecond(second) + ':' + formatTime(millisecond/10)})
}
//正暂停函数
function stop() {
  clearInterval(int);
}


//负重置函数
function ResetMax(that) {
  clearInterval(interval);
  secondMax = 999;
  millisecondMax = 1000;
  that.setData({ timeMax: '999:99', actionMax: !that.data.actionMax })
}
//负开始函数
function startMax(that) {
  interval = setInterval(function () { timerMax(that) }, 10);//每隔50毫秒执行一次timer函数
}
//负计时函数
function timerMax(that) {
  millisecondMax = millisecondMax - 10;
  if (millisecondMax <= 0) {
    millisecondMax = 999;
    secondMax = secondMax - 1;
  }
  if (secondMax <= 0) {
    clearInterval(interval);
  }
  that.setData({ timeMax: formatTimeSecond(secondMax) + ':' + formatTime(parseInt(millisecondMax / 10))})
}
//负暂停函数
function stopMax() {
  clearInterval(interval);
}










function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}
function formatTimeSecond(num) {
  if (num < 10)
    return '00' + num
  if (num < 100)
    return '0' + num
  else
    return num + ''
}
function formatTimeS(num) {
  if (num < 10){
    return [0, 0, num]
  }else if (num >= 10 && num < 100){
    num = String(num);
    let first = Number(num.slice(0,1))
    let two = Number(num.slice(1, num.length));
    return [0,first,two]
  }else{
    num = String(num);
    let first = Number(num.slice(0, 1));
    let two = Number(num.slice(1, 2));
    let three = Number(num.slice(2, num.length));
    return [first, two,three]
  }
}
