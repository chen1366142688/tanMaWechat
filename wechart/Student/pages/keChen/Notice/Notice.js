//logs.js

const app = getApp().globalData;
Page({
  data: {
    addendRollHeigth: 1200,
    NoticePage:1,
    noticeList:[],
    minUrl: app.imgUrl,
    attendLastFoot:'已经到底了'
  }, 
  onReady(){
    
  },
  onLoad: function () {
    const that = this;
    var res = wx.getSystemInfoSync();
    that.setData({ addendRollHeigth: res.windowHeight })
  },
  onShow(){
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    lectureNotice(this)
  },
  //联系教练拨打电话
  callCoach: function (e) {
    var phoneNumber = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
  },
  scrolltolower(e){
    this.setData({ NoticePage: this.data.NoticePage+1})
    lectureNotice(this)
  },
  //暂停课程
  stopKe: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.memberid)
    var memberid = e.currentTarget.dataset.memberid;
    wx.showModal({
      title: '提示',
      content: '课程暂停申请需要教练方确认，课程暂停后，您将不会收到本课程的所有开课通知，如需要恢复请联系教练操作。确定暂停本课程吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.url + '/v1/attend/applySuspendAttend',
            header: { 'token': wx.getStorageSync('userInfo').token },
            method: 'GET',
            data: {
              'memberId': memberid
            },
            success: function (res) {
              wx.showToast({
                title: '暂停课程成功',
              })
              //设置状态
              var list = that.data.noticeList;
              for (let x = 0; x < list.length; x++) {
                if (list[x].memberId == memberid) {
                  list[x].attendMemberStatus = '02'
                }
              }
              that.setData({ noticeList: list })
            },
            fail: function (info) {
              wx.showToast({
                title: '暂停课程失败，请刷新重试',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
      
    })
      
  },
  //取消开课
  cancelKe: function (e) {
    console.log("什么情况")
    console.log(e)
    var that = this;
    var attendId = e.currentTarget.dataset.attend;
      //这是开课通知的取消开课
      wx.showModal({
        title: '提示',
        content: '取消本次开课后，您需要联系教练确认下次开班的时间，确定取消吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: app.url + '/v1/attend/cancelAttend',
              header: { 'token': wx.getStorageSync('userInfo').token },
              method: 'GET',
              data: {
                'cancelType': 1,//1学员取消 0教练取消
                'attendId': attendId
              },
              success: function (res) {
                console.log("请求成功，取消开课ok")
                wx.showToast({
                  title: '取消开课成功',
                })
                //设置状态
                var list = that.data.noticeList;
                for (let x = 0; x < list.length; x++) {
                  if (list[x].attendId == attendId) {
                    list[x].attendMemberStatus = '06'
                  }
                }
                that.setData({ noticeList: list })
              },
              fail: function (info) {
                wx.showToast({
                  title: '取消开课失败，请刷新重试',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
  },
  
})
/*获取学员开课通知列表*/
function lectureNotice(that) {
  if (wx.getStorageSync('userInfo').userType) {
    let userType = wx.getStorageSync("userInfo").userType;
    let isOldUser = userType ? userType.substr(1, 1) : "";
    if (isOldUser != '1') {
      that.setData({ Period: 1, attendLastFoot: '', addendRollHeigth: 0 })
      return false;
    }
  }
  wx.request({
    url: app.url + '/v1/attend/getAttendNoticeList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      "pageNumber": that.data.NoticePage,
      "theNumber": 10,
      "userId": wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      //code=30005时,暂不跳转到注册页面
      if (res.data.code == '10000') {
        var result = res.data.response;
        if (that.data.NoticePage == 1 && result.length == 0) {
          that.setData({ Period: 1, attendLastFoot: '', addendRollHeigth: 0 })
          return false;
        }
        if (result.length < 10) {
          that.setData({
            attendLastFoot: "已全部显示",
            Period: 0
          })
        } else {
          that.setData({
            attendLastFoot: "",
            Period: 0,
          })
        }
        for (let i in result) {
          result[i].weekDay = '周' + chinanum(result[i].weekDay);
        }
        let tempNoticeList = that.data.noticeList;
        tempNoticeList = tempNoticeList.concat(result);
        that.setData({
          noticeList: tempNoticeList,
          Period: 0
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取开课通知失败，请刷新重试',
        icon: 'none',
        duration: 2000
      })
    },
  })
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
