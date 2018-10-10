// pages/Information/Perfect-Information/Perfect-Information.js
const app = getApp().globalData
const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.url,
    curIndex:1,
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'pitch-on',
    coursepersonbnotice: '',
    childName:'',
    idCard:'',
    activeImg:true,
    noActiveImg: true,
    year:'1990',
    month:'01',
    day:'01',
    ActiveDate: '',
    Sex:1,
    end: fmtDate(new Date),
  },
  //点击切换tabbar
  Information(e) {
    let val = e.currentTarget.dataset.val;
    console.log(val)
    wx.setStorageSync('haveIdCard', val)
    var that = this;
    this.setData({
      curIndex:val
    })
    if (val == 1) {
      that.setData({
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 0) {
      that.setData({
        coursepersona: '',
        trainingcourse: true,
        noticecoursetab: false,
        idCard:''
      })
    }
  },
  ContactCustomerService(e){
    wx.makePhoneCall({//客服电话待定
      phoneNumber: '13679695212',
    })
  },
  inputChildName(e){
    this.setData({ childName:e.detail.value})
  },
  inputCard(e){
    this.setData({idCard:e.detail.value})
  },
  //切换性别
  active(e){
    const that = this;
    let index = e.currentTarget.dataset.index;//男2女4
    that.setData({ 
      Sex: index,
      activeImg: !that.data.activeImg,
      noActiveImg: !that.data.noActiveImg
      })
  },
  bindDateChange(e) {
    let date = e.detail.value;
    let ActiveDate = e.detail.value;
    date = date.split("-")
    this.setData({
      year: date[0],
      month:date[1],
      day:date[2],
      ActiveDate: ActiveDate
    })
  },
  next(e){
    const that = this;
    let curIndex = that.data.curIndex
    let childName = that.data.childName
    let idCard = that.data.idCard
    let Sex = that.data.Sex;//1男2女
    let ActiveDate = that.data.ActiveDate
    if (childName) {
      console.log("姓名ok")
      wx.setStorageSync('childName', childName)
    } else {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none'
      })
      return false;
    }
    if (curIndex == 1){//有身份证
      if (reg.test(idCard)) {
        console.log("身份证ok")
        wx.setStorageSync('idCard', that.data.idCard)
        wx.setStorageSync('haveIdCard', '1')
        wx.navigateTo({
          url: '../../../pages/Information/Height-Weight/Height-Weight',
        })
      } else {
        wx.showToast({
          title: '身份证号码不正确',
          icon: 'none'
        })
        return false;
      }
    } else if (curIndex == 0){//没有身份证
      if (ActiveDate){
        console.log("已经选择时间")
        wx.setStorageSync('Sex', Sex)
        wx.setStorageSync('ActiveDate', ActiveDate)
        wx.setStorageSync('haveIdCard', '0')
        wx.navigateTo({
          url: '../../../pages/Information/Height-Weight/Height-Weight',
        })
      }else{
        wx.showToast({
          title: '请选择您孩子的出生年月日',
          icon:'none'
        })
        return false;
      }
    }
    
    
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})

function fmtDate(obj) {
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}